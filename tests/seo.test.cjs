const assert = require('node:assert/strict');
const { test } = require('node:test');
require('./register-typescript.cjs');

const { requestOrigin, seoResponse, replaceStaticOrigin, STATIC_SITE_ORIGIN } = require('../lib/seo-response.ts');
const { default: worker } = require('../worker/index.js');
const { middleware } = require('../middleware.ts');
const { onRequest: pages } = require('../functions/_middleware.js');
const seoConfig = require('../config/seo.ts');

function assertNoIndex(response) {
  const directives = response.headers.get('X-Robots-Tag').split(/,\s*/);
  for (const directive of ['noindex', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex']) {
    assert.ok(directives.includes(directive));
  }
}

test('origins follow the request and validated proxy headers', () => {
  assert.equal(requestOrigin(new Headers({ host: 'example.netlify.app' })), 'https://example.netlify.app');
  assert.equal(requestOrigin(new Headers({ host: 'localhost:3017' })), 'http://localhost:3017');
  assert.equal(requestOrigin(new Headers({ host: '[::1]:3017' })), 'http://[::1]:3017');
  assert.equal(requestOrigin(new Headers({ host: 'internal:3000', 'x-forwarded-host': 'custom.example, proxy', 'x-forwarded-proto': 'https, http' })), 'https://custom.example');
  for (const host of ['bad.example/path', 'user@bad.example', 'bad.example?query', '', '<invalid>']) {
    assert.throws(() => requestOrigin(new Headers({ host })), TypeError);
  }
});

test('Next middleware prevents indexing and removes sitemap discovery on every host', async () => {
  for (const host of ['first.example', 'mirror.netlify.app', 'changed.example']) {
    for (const path of ['/', '/cloud.ico', '/api/generate', '/robots.txt', '/robots.txt/', '/sitemap.xml', '/sitemap.xml/', '/opengraph-image']) {
      const response = middleware(new Request(`http://internal:3000${path}`, {
        headers: { host: 'internal:3000', 'x-forwarded-host': host, 'x-forwarded-proto': 'https' },
      }));
      assert.equal(response.status, /sitemap|opengraph/.test(path) ? 404 : 200);
      assertNoIndex(response);
      const body = await response.text();
      if (path.startsWith('/robots.txt')) assert.equal(body, 'User-agent: *\nAllow: /\n');
      assert.ok(!body.includes('Sitemap:'));
      assert.ok(!body.includes('<loc>'));
      assert.ok(!body.includes(STATIC_SITE_ORIGIN));
      assert.ok(!body.includes('internal'));
    }
  }
  const head = seoResponse(new Request('https://example.com/sitemap.xml', { method: 'HEAD' }));
  assert.equal(await head.text(), '');
  assert.equal(seoResponse(new Request('https://example.com/api/generate')), null);
  assert.equal(seoResponse(new Request('https://example.com/robots.txt', { method: 'POST' })), null);
});

test('stream replacement handles every byte boundary and preserves Unicode', async () => {
  const source = `<head>Кириллица 🌍 ${STATIC_SITE_ORIGIN}/ ${STATIC_SITE_ORIGIN}/#website</head>🌍${'я'.repeat(70)}`;
  const bytes = new TextEncoder().encode(source);
  for (let split = 0; split <= bytes.length; split++) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes.slice(0, split));
        controller.enqueue(bytes.slice(split));
        controller.close();
      },
    });
    const response = replaceStaticOrigin(new Response(stream, {
      headers: { 'Content-Type': 'text/html', ETag: 'static', 'Content-Length': String(bytes.length) },
    }), 'https://mirror.example');
    assert.equal(await response.text(), source.replaceAll(STATIC_SITE_ORIGIN, 'https://mirror.example'), `byte ${split}`);
    assert.equal(response.headers.get('etag'), null);
    assert.equal(response.headers.get('content-length'), null);
  }
});

test('Worker prevents indexing of HTML, flight data and retired SEO routes', async () => {
  for (const host of ['first.workers.dev', 'custom.example']) {
    for (const contentType of ['text/html; charset=utf-8', 'text/plain', 'text/x-component']) {
      const env = { ASSETS: { fetch: async () => new Response(`${STATIC_SITE_ORIGIN}/`, { headers: { 'Content-Type': contentType } }) } };
      const response = await worker.fetch(new Request(`https://${host}/`), env, {});
      assertNoIndex(response);
      assert.equal(await response.text(), `${STATIC_SITE_ORIGIN}/`);
    }
    for (const path of ['/robots.txt', '/sitemap.xml']) {
      const response = await worker.fetch(new Request(`https://${host}${path}`), {}, {});
      assert.equal(response.status, path === '/robots.txt' ? 200 : 404);
      assertNoIndex(response);
      assert.ok(!(await response.text()).includes(`https://${host}/`));
    }
  }
});

test('non-text assets and API dispatch retain their responses', async () => {
  const image = new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'Content-Type': 'image/png' } });
  assert.equal(replaceStaticOrigin(image, 'https://example.com'), image);
  const response = await worker.fetch(new Request('https://example.com/api/generate', { method: 'OPTIONS' }), {}, {});
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assertNoIndex(response);
});

test('Pages middleware prevents indexing of exported pages and retires its sitemap', async () => {
  const context = {
    request: new Request('https://mirror.pages.dev/'),
    next: async () => new Response(`${STATIC_SITE_ORIGIN}/`, { headers: { 'Content-Type': 'text/html' } }),
  };
  const homepage = await pages(context);
  assertNoIndex(homepage);
  assert.equal(await homepage.text(), `${STATIC_SITE_ORIGIN}/`);
  const response = await pages({ request: new Request('https://mirror.pages.dev/sitemap.xml') });
  assert.equal(response.status, 404);
  assertNoIndex(response);
});

test('indexing headers preserve asset bytes, redirects and API errors', async () => {
  for (const status of [200, 301, 404, 500]) {
    const bytes = new Uint8Array([137, 80, 78, 71]);
    const response = await worker.fetch(new Request('https://example.com/asset.png'), {
      ASSETS: { fetch: async () => new Response(bytes, {
        status,
        headers: { 'Content-Type': 'image/png', Location: '/target', ETag: 'asset' },
      }) },
    }, {});
    assert.equal(response.status, status);
    assert.equal(response.headers.get('Location'), '/target');
    assert.equal(response.headers.get('ETag'), 'asset');
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
    assertNoIndex(response);
  }
  const error = await worker.fetch(new Request('https://example.com/api/generate', { method: 'DELETE' }), {}, {});
  assert.equal(error.status, 405);
  assertNoIndex(error);
  const head = middleware(new Request('https://example.com/robots.txt', { method: 'HEAD' }));
  assert.equal(await head.text(), '');
  assertNoIndex(head);
});

test('the SEO switch restores host-specific metadata routes and static origin replacement', async () => {
  seoConfig.SEO_ENABLED = true;
  try {
    for (const host of ['first.example', 'mirror.example']) {
      for (const path of ['/robots.txt', '/sitemap.xml']) {
        const request = new Request(`https://${host}${path}`, { headers: { host } });
        for (const response of [middleware(request), await worker.fetch(request, {}, {}), await pages({ request })]) {
          assert.equal(response.status, 200);
          assert.equal(response.headers.get('X-Robots-Tag'), null);
          assert.ok((await response.text()).includes(`https://${host}/`));
        }
      }
      const response = await worker.fetch(new Request(`https://${host}/`), {
        ASSETS: { fetch: async () => new Response(`${STATIC_SITE_ORIGIN}/`, { headers: { 'Content-Type': 'text/html' } }) },
      }, {});
      assert.equal(await response.text(), `https://${host}/`);
      assert.equal(response.headers.get('X-Robots-Tag'), null);
    }
  } finally {
    seoConfig.SEO_ENABLED = false;
  }
});
