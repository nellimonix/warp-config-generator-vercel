const assert = require('node:assert/strict');
const { test } = require('node:test');
require('./register-typescript.cjs');

const { requestOrigin, seoResponse, replaceStaticOrigin, STATIC_SITE_ORIGIN } = require('../lib/seo-response.ts');
const { default: worker } = require('../worker/index.js');
const { middleware } = require('../middleware.ts');
const { onRequest: pages } = require('../functions/_middleware.js');

test('origins follow the request and validated proxy headers', () => {
  assert.equal(requestOrigin(new Headers({ host: 'example.netlify.app' })), 'https://example.netlify.app');
  assert.equal(requestOrigin(new Headers({ host: 'localhost:3017' })), 'http://localhost:3017');
  assert.equal(requestOrigin(new Headers({ host: '[::1]:3017' })), 'http://[::1]:3017');
  assert.equal(requestOrigin(new Headers({ host: 'internal:3000', 'x-forwarded-host': 'custom.example, proxy', 'x-forwarded-proto': 'https, http' })), 'https://custom.example');
  for (const host of ['bad.example/path', 'user@bad.example', 'bad.example?query', '', '<invalid>']) {
    assert.throws(() => requestOrigin(new Headers({ host })), TypeError);
  }
});

test('Next middleware serves SEO files for each host without cross-request leakage', async () => {
  for (const host of ['first.example', 'mirror.netlify.app', 'changed.example']) {
    for (const path of ['/robots.txt', '/sitemap.xml']) {
      const response = middleware(new Request(`http://internal:3000${path}`, {
        headers: { host: 'internal:3000', 'x-forwarded-host': host, 'x-forwarded-proto': 'https' },
      }));
      assert.equal(response.status, 200);
      const body = await response.text();
      assert.ok(body.includes(`https://${host}/`));
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

test('Worker adapts static HTML and flight data to its request origin', async () => {
  for (const host of ['first.workers.dev', 'custom.example']) {
    for (const contentType of ['text/html; charset=utf-8', 'text/plain', 'text/x-component']) {
      const env = { ASSETS: { fetch: async () => new Response(`${STATIC_SITE_ORIGIN}/`, { headers: { 'Content-Type': contentType } }) } };
      const response = await worker.fetch(new Request(`https://${host}/`), env, {});
      assert.equal(await response.text(), `https://${host}/`);
    }
    for (const path of ['/robots.txt', '/sitemap.xml']) {
      const response = await worker.fetch(new Request(`https://${host}${path}`), {}, {});
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(`https://${host}/`));
    }
  }
});

test('non-text assets and API dispatch retain their responses', async () => {
  const image = new Response(new Uint8Array([137, 80, 78, 71]), { headers: { 'Content-Type': 'image/png' } });
  assert.equal(replaceStaticOrigin(image, 'https://example.com'), image);
  const response = await worker.fetch(new Request('https://example.com/api/generate', { method: 'OPTIONS' }), {}, {});
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
});

test('Pages middleware also adapts exported pages and SEO files', async () => {
  const context = {
    request: new Request('https://mirror.pages.dev/'),
    next: async () => new Response(`${STATIC_SITE_ORIGIN}/`, { headers: { 'Content-Type': 'text/html' } }),
  };
  assert.equal(await (await pages(context)).text(), 'https://mirror.pages.dev/');
  const response = await pages({ request: new Request('https://mirror.pages.dev/sitemap.xml') });
  assert.ok((await response.text()).includes('https://mirror.pages.dev/'));
});
