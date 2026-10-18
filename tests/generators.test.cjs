const assert = require('node:assert/strict');
const { test } = require('node:test');
require('./register-typescript.cjs');

const { defaultAwgOptions, normalizeAwgOptions, normalizeMtu } = require('../lib/awg.ts');
const { buildConfig } = require('../lib/builders/index.ts');
const next = require('../app/api/generate/route.ts');
const worker = require('../worker/api-handler.js');
const pages = require('../functions/api/generate.js');
const protocols = ['awg10', 'awg20', 'awg30', 'awg31'];
const fixture = {
  privateKey: 'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=',
  publicKey: 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=',
  clientIPv4: '172.16.0.2', clientIPv6: '2606:4700:110:8a7e::2',
  allowedIPs: '203.0.113.0/24', endpoint: '192.0.2.1:2408',
  deviceType: 'awg15', reserved: 'AQID', dns: '1.1.1.1, 2606:4700:4700::1111', includeIPv6: true,
  persistentKeepalive: 25, mtu: 1380, i1: 'I1 = <b 0xc400000001>', maskDomain: 'example.com',
};

test('all sixteen independent AWG combinations reach every supported builder', () => {
  for (let bits = 0; bits < 16; bits++) {
    const selected = protocols.filter((_, index) => bits & (1 << index));
    const awg = normalizeAwgOptions({ ...defaultAwgOptions(), protocols: selected });
    for (const format of ['wireguard', 'wiresock', 'clash']) {
      const text = buildConfig(format, { ...fixture, awg });
      const fields = format === 'clash'
        ? ['    jc:', '    i1:', '    content-padding-addition:', '    random-trailers:']
        : ['Jc =', format === 'wiresock' ? 'Id =' : 'I1 =', 'ContentPaddingAddition =', 'RandomTrailers ='];
      fields.forEach((field, index) => assert.equal(text.includes(field), selected.includes(protocols[index]), `${format} ${selected}: ${field}`));
      assert.match(text, format === 'clash' ? /mtu: 1380/ : /MTU = 1380/);
      if (!selected.length) assert.ok(!text.includes('amnezia-wg-option'));
    }
  }
});

test('presets, custom values, disabled parameters and AWG 3.1 flags', () => {
  const input = { ...defaultAwgOptions(), protocols: [...protocols], junkPreset: '30_10_30', junk: { jc: '8' }, ranges: { rekeyTimeout: '10-15' }, randomTrailers: false };
  const awg = normalizeAwgOptions(input);
  const text = buildConfig('wireguard', { ...fixture, awg });
  assert.match(text, /Jc = 8\nJmin = 10\nJmax = 30/);
  assert.match(text, /RekeyTimeout = 10-15/);
  assert.ok(!text.includes('RandomTrailers'));
  assert.match(text, /DisableCookies = on/);
  assert.ok(!normalizeAwgOptions({ ...input, disableCookies: false }).protocols.includes('awg31'));
  assert.doesNotThrow(() => normalizeAwgOptions({ ...input, protocols: [], ranges: { rekeyTimeout: 'bad' }, junk: { jc: 'bad' } }));
});

test('invalid active AWG values and MTU are rejected', () => {
  for (const custom of ['-1', '1.5', '2147483648', '4\nI1=bad']) {
    assert.throws(() => normalizeAwgOptions({ ...defaultAwgOptions(), junk: { jc: custom } }));
  }
  for (const range of ['20-10', '1', '1-2147483648', '1-2\nH1 = 5']) {
    assert.throws(() => normalizeAwgOptions({ ...defaultAwgOptions(), protocols: ['awg30'], ranges: { rekeyTimeout: range } }));
  }
  assert.throws(() => normalizeAwgOptions({ ...defaultAwgOptions(), junk: { jmin: 100, jmax: 10 } }));
  assert.throws(() => normalizeMtu(1279, true));
  assert.throws(() => normalizeMtu(9001, false));
  assert.equal(normalizeMtu(1200, false), 1200);
});

test('Xray JSON carries addresses, DNS, routing, keepalive, reserved and noise', () => {
  const config = JSON.parse(buildConfig('xray', fixture));
  const warp = config.outbounds.find((item) => item.tag === 'warp');
  const noise = config.outbounds.find((item) => item.tag === 'noise-out');
  assert.equal(warp.settings.secretKey, fixture.privateKey);
  assert.equal(warp.settings.peers[0].publicKey, fixture.publicKey);
  assert.equal(warp.settings.peers[0].endpoint, fixture.endpoint);
  assert.equal(warp.settings.mtu, fixture.mtu);
  assert.deepEqual(warp.settings.address, ['172.16.0.2/32', '2606:4700:110:8a7e::2/128']);
  assert.deepEqual(warp.settings.reserved, [1, 2, 3]);
  assert.equal(warp.settings.peers[0].keepAlive, 25);
  assert.deepEqual(warp.settings.peers[0].allowedIPs, ['0.0.0.0/0', '::/0']);
  assert.deepEqual(warp.settings.remoteDNS, config.dns.servers);
  assert.deepEqual(config.routing.rules, [
    { type: 'field', port: '53', outboundTag: 'direct' },
    { type: 'field', network: 'tcp,udp', outboundTag: 'warp' },
  ]);
  const tags = new Set(config.outbounds.map((outbound) => outbound.tag));
  for (const rule of config.routing.rules) assert.ok(tags.has(rule.outboundTag));
  for (const outbound of config.outbounds) {
    const dialer = outbound.streamSettings?.sockopt?.dialerProxy;
    if (dialer) assert.ok(tags.has(dialer));
  }
  assert.equal(noise.settings.noises.length, 9);
  assert.equal(noise.settings.noises[0].packet, 'c400000001');
  const ipv4 = JSON.parse(buildConfig('xray', { ...fixture, includeIPv6: false, dns: '1.1.1.1', persistentKeepalive: undefined }));
  assert.equal(ipv4.outbounds[0].settings.address.length, 1);
  assert.ok(!Object.hasOwn(ipv4.outbounds[0].settings.peers[0], 'keepAlive'));
  assert.throws(() => buildConfig('xray', { ...fixture, i1: 'bad' }));
});

test('three API implementations export the selected settings with controlled Cloudflare replies', async () => {
  const previousFetch = global.fetch;
  let requests = 0;
  global.fetch = async (url, options = {}) => {
    requests++;
    if (String(url).includes('qrserver.com')) return new Response(new Uint8Array([137, 80, 78, 71]));
    assert.ok(String(url).startsWith('https://api.cloudflareclient.com/'));
    return Response.json(options.method === 'POST' ? { result: { id: 'fixture', token: 'fixture-token' } } : {
      result: { config: { peers: [{ public_key: fixture.publicKey }], interface: { addresses: { v4: fixture.clientIPv4, v6: fixture.clientIPv6 } }, client_id: 'AQID' } },
    });
  };
  try {
    for (const backend of [next, worker, pages]) {
      for (let bits = 0; bits < 16; bits++) {
        const selected = protocols.filter((_, index) => bits & (1 << index));
        for (const format of ['wireguard', 'wiresock', 'clash', 'xray']) {
          const body = { selectedServices: format === 'xray' ? ['youtube'] : [], siteMode: format === 'xray' ? 'specific' : 'all', excludeLan: format === 'xray', deviceType: 'awg15', endpoint: fixture.endpoint, configFormat: format, ipv6: false, mtu: 1400,
            awg: { ...defaultAwgOptions(), protocols: selected }, persistentKeepalive: 31 };
          const request = new Request('http://localhost/api/generate', { method: 'POST', body: JSON.stringify(body) });
          const response = backend === next ? await next.POST(request) : await backend.onRequestPost({ request, env: {} });
          const json = await response.json();
          assert.equal(response.status, 200, JSON.stringify(json));
          const result = json.content;
          const text = Buffer.from(result.configBase64, 'base64').toString('utf8');
          if (format === 'xray') {
            assert.match(result.fileName, /^XRAY\d+\.json$/);
            assert.equal(JSON.parse(text).outbounds[0].settings.mtu, 1400);
            assert.deepEqual(JSON.parse(text).routing.rules[0], { type: 'field', port: '53', outboundTag: 'direct' });
            assert.deepEqual(JSON.parse(text).routing.rules[1], { type: 'field', network: 'tcp,udp', outboundTag: 'warp' });
          } else {
            assert.equal(text.includes(format === 'clash' ? '    jc:' : 'Jc ='), selected.includes('awg10'));
            assert.equal(text.includes(format === 'clash' ? '    i1:' : format === 'wiresock' ? 'Id =' : 'I1 ='), selected.includes('awg20'));
          }
        }
      }
      if (backend !== next) {
        const before = requests;
        const response = await backend.onRequestPost({ request: new Request('http://localhost/api/generate', { method: 'POST', body: JSON.stringify({ awg: { ...defaultAwgOptions(), protocols: ['invalid'] } }) }), env: {} });
        assert.equal(response.status, 400);
        assert.equal(requests, before);
      }
    }
  } finally { global.fetch = previousFetch; }
});
