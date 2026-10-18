require('./register-typescript.cjs');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const dgram = require('node:dgram');
const net = require('node:net');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');
const nacl = require('tweetnacl');
const { buildXray } = require('../lib/builders/xray.ts');

const binary = process.env.XRAY_BINARY;
const dnsAddress = process.env.XRAY_TEST_DNS_ADDRESS || '127.0.0.153';
assert.ok(binary, 'Set XRAY_BINARY to an official xray-core executable before running test:xray.');

function listen(server, port = 0, address = '127.0.0.1') {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, address, resolve);
  });
}

function bind(socket, port = 0, address = '127.0.0.1') {
  return new Promise((resolve, reject) => {
    socket.once('error', reject);
    socket.bind(port, address, resolve);
  });
}

async function freePort() {
  const server = net.createServer();
  await listen(server);
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}

function dnsReply(query) {
  let position = 12;
  const labels = [];
  while (position < query.length && query[position]) {
    const length = query[position++];
    labels.push(query.toString('ascii', position, position + length));
    position += length;
  }
  if (position + 5 > query.length) return;
  position++;
  const type = query.readUInt16BE(position);
  const questionEnd = position + 4;
  const header = Buffer.from(query.subarray(0, 12));
  header.writeUInt16BE(0x8180, 2);
  header.writeUInt16BE(1, 4);
  header.writeUInt16BE(type === 1 ? 1 : 0, 6);
  header.writeUInt16BE(0, 8);
  header.writeUInt16BE(0, 10);
  const answer = type === 1 ? Buffer.from([0xc0, 0x0c, 0, 1, 0, 1, 0, 0, 0, 1, 0, 4, 127, 0, 0, 1]) : Buffer.alloc(0);
  return { name: labels.join('.').toLowerCase(), packet: Buffer.concat([header, query.subarray(12, questionEnd), answer]) };
}

async function ready(port, child, output) {
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(child.exitCode, null, output());
    const connected = await new Promise((resolve) => {
      const socket = net.createConnection({ host: '127.0.0.1', port });
      socket.on('error', () => resolve(false));
      socket.on('connect', () => { socket.destroy(); resolve(true); });
    });
    if (connected) return;
    await delay(50);
  }
  assert.fail(`Xray proxy did not start: ${output()}`);
}

async function exercise(t, legacy, ipv6 = false) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'warp-xray-bootstrap-'));
  assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
  assert.match(path.basename(directory), /^warp-xray-bootstrap-/);
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const queries = [];
  const packets = [];
  const dns = dgram.createSocket('udp4');
  const peer = dgram.createSocket('udp4');
  t.after(() => { try { dns.close(); } catch {} });
  t.after(() => { try { peer.close(); } catch {} });
  await bind(dns, 53, dnsAddress);
  await bind(peer);
  dns.on('message', (message, remote) => {
    const reply = dnsReply(message);
    if (reply) { queries.push(reply.name); dns.send(reply.packet, remote.port, remote.address); }
  });
  peer.on('message', (message) => packets.push(message));
  let directConnections = 0;
  const trap = net.createServer((socket) => { directConnections++; socket.end(); });
  t.after(() => new Promise((resolve) => trap.close(resolve)));
  await listen(trap);
  const endpointName = 'wireguard-bootstrap.test';
  const config = JSON.parse(buildXray({
    privateKey: Buffer.from(nacl.box.keyPair().secretKey).toString('base64'),
    publicKey: Buffer.from(nacl.box.keyPair().publicKey).toString('base64'),
    clientIPv4: '172.16.0.2', clientIPv6: 'fd00::2', includeIPv6: ipv6,
    reserved: 'AQID', endpoint: `${endpointName}:${peer.address().port}`,
    dns: dnsAddress, i1: 'I1 = <b 0xc400000001>', allowedIPs: '0.0.0.0/0', mtu: 1280,
  }));
  const ports = [await freePort(), await freePort()];
  config.inbounds.forEach((inbound, index) => { inbound.port = ports[index]; });
  config.log.loglevel = 'debug';
  if (legacy) config.routing.rules = [
    { type: 'field', port: '53', outboundTag: 'direct' },
    { type: 'field', ip: ipv6 ? ['0.0.0.0/0', '::/0'] : ['0.0.0.0/0'], outboundTag: 'warp' },
    { type: 'field', network: 'tcp,udp', outboundTag: 'direct' },
  ];
  const filename = path.join(directory, 'config.json');
  await fs.writeFile(filename, JSON.stringify(config));
  const check = spawnSync(binary, ['run', '-test', '-config', filename], { encoding: 'utf8', windowsHide: true, timeout: 10000 });
  assert.equal(check.status, 0, `${check.error || ''}\n${check.stdout}\n${check.stderr}`);
  const child = spawn(binary, ['run', '-config', filename], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  child.on('error', (error) => { output += error.message; });
  t.after(async () => {
    if (child.exitCode === null) {
      const exited = new Promise((resolve) => child.once('close', resolve));
      child.kill();
      await exited;
    }
  });
  await ready(ports[1], child, () => output);
  const request = net.createConnection({ host: '127.0.0.1', port: ports[1] });
  request.on('error', () => {});
  request.on('data', () => {});
  request.on('connect', () => request.write(`CONNECT localhost:${trap.address().port} HTTP/1.1\r\nHost: localhost:${trap.address().port}\r\n\r\n`));
  t.after(() => request.destroy());
  const handshake = () => packets.find((packet) => packet.length === 148 && packet.subarray(0, 4).equals(Buffer.from([1, 1, 2, 3])));
  for (let attempt = 0; attempt < 160; attempt++) {
    if (legacy ? directConnections > 0 : handshake()) break;
    await delay(50);
  }
  if (legacy) {
    assert.ok(directConnections > 0, `Legacy direct escape was not detected: ${output}`);
    assert.equal(handshake(), undefined);
    t.diagnostic('Control: hostname traffic reached the direct TCP listener instead of WireGuard.');
  } else {
    assert.ok(queries.includes(endpointName), `Endpoint hostname never reached the local DNS server: ${output}`);
    assert.ok(handshake(), `WireGuard initiation did not reach the synthetic UDP peer: ${output}`);
    assert.equal(directConnections, 0, 'User traffic escaped directly');
    assert.ok(packets.some((packet) => packet.equals(Buffer.from('c400000001', 'hex'))), 'QUIC mask was not delivered');
    assert.ok(packets.length >= 10, 'Noise packets were lost before the WireGuard initiation');
    t.diagnostic(`Endpoint resolved by local DNS; ${handshake().length}-byte initiation with reserved [1,2,3] reached peer; no direct user connection.`);
  }
}

test('legacy routing control exposes direct hostname traffic', { timeout: 20000 }, (t) => exercise(t, true));
test('Xray bootstraps a domain endpoint and sends handshake to peer', { timeout: 20000 }, (t) => exercise(t, false));
test('dual-stack Xray bootstraps a domain endpoint and sends handshake to peer', { timeout: 20000 }, (t) => exercise(t, false, true));
