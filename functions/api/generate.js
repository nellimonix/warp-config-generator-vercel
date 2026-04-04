import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

// ---- Crypto ----
function generateKeyPair() {
  const kp = nacl.box.keyPair();
  return {
    privateKey: Buffer.from(kp.secretKey).toString('base64'),
    publicKey: Buffer.from(kp.publicKey).toString('base64'),
  };
}

function reservedToBytes(reserved) {
  if (!reserved) return [0, 0, 0];
  try { return Array.from(Buffer.from(reserved, 'base64')); } catch { return [0, 0, 0]; }
}
function reservedToDashed(reserved) { return reservedToBytes(reserved).join('-'); }
function reservedToCSV(reserved) { return reservedToBytes(reserved).join(', '); }

// ---- IP Ranges ----
const IP_RANGES = {
  discord: "103.224.0.0/16, 104.16.0.0/12, 162.158.0.0/15, 172.64.0.0/13, 188.114.96.0/22, 8.0.0.0/13, 8.32.0.0/11",
  telegram: "149.154.160.0/20, 91.108.4.0/22, 91.108.8.0/22, 91.108.12.0/22, 91.108.16.0/22, 91.108.20.0/22, 91.108.56.0/22, 95.161.64.0/20",
  twitter: "104.244.40.0/21, 192.229.128.0/17, 69.195.160.0/19",
  zetflix: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22",
  canva: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22",
  proton: "185.70.40.0/22",
  nnmclub: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22",
  rutracker: "104.16.0.0/12, 172.64.0.0/13, 185.81.128.0/23, 188.114.96.0/22",
  animego: "104.16.0.0/12, 172.64.0.0/13, 185.178.208.0/22",
  ficbook: "104.16.0.0/12, 172.64.0.0/13, 185.206.164.0/22",
  rutor: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22, 193.46.255.0/24, 75.2.0.0/17",
  modrinth: "104.16.0.0/12, 172.64.0.0/13, 185.206.148.0/22",
};

function resolveAllowedIPs(keys, siteMode) {
  if (siteMode === 'all') return '0.0.0.0/0, ::/0';
  const ranges = new Set();
  keys.forEach(k => { const r = IP_RANGES[k]; if (r) r.split(', ').forEach(x => ranges.add(x.trim())); });
  return ranges.size > 0 ? Array.from(ranges).join(', ') : '0.0.0.0/0, ::/0';
}

// ---- CF WARP API ----
const CF_BASE = 'https://api.cloudflareclient.com/v0i1909051800';
const CF_HEADERS = { 'User-Agent': 'okhttp/3.12.1', 'Content-Type': 'application/json' };

async function registerClient(publicKey) {
  const res = await fetch(`${CF_BASE}/reg`, {
    method: 'POST', headers: CF_HEADERS,
    body: JSON.stringify({ install_id: '', tos: new Date().toISOString(), key: publicKey, fcm_token: '', type: 'ios', locale: 'en_US' }),
  });
  if (!res.ok) throw new Error(`Register failed: ${res.status}`);
  const data = await res.json();
  return { id: data.result.id, token: data.result.token };
}

async function enableWarp(clientId, token) {
  const res = await fetch(`${CF_BASE}/reg/${clientId}`, {
    method: 'PATCH',
    headers: { ...CF_HEADERS, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ warp_enabled: true }),
  });
  if (!res.ok) throw new Error(`Enable WARP failed: ${res.status}`);
  return await res.json();
}

// ---- QR ----
async function generateQR(text) {
  try {
    const res = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(text)}`);
    if (!res.ok) return '';
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return `data:image/png;base64,${btoa(binary)}`;
  } catch { return ''; }
}

// ---- Builders ----
const WARP_PUB = 'bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=';
const DNS = '1.1.1.1, 2606:4700:4700::1111, 1.0.0.1, 2606:4700:4700::1001';
const AWG_PARAM = "I1 = <b 0xc10000000114367096bb0fb3f58f3a3fb8aaacd61d63a1c8a40e14f7374b8a62dccba6431716c3abf6f5afbcfb39bd008000047c32e268567c652e6f4db58bff759bc8c5aaca183b87cb4d22938fe7d8dca22a679a79e4d9ee62e4bbb3a380dd78d4e8e48f26b38a1d42d76b371a5a9a0444827a69d1ab5872a85749f65a4104e931740b4dc1e2dd77733fc7fac4f93011cd622f2bb47e85f71992e2d585f8dc765a7a12ddeb879746a267393ad023d267c4bd79f258703e27345155268bd3cc0506ebd72e2e3c6b5b0f005299cd94b67ddabe30389c4f9b5c2d512dcc298c14f14e9b7f931e1dc397926c31fbb7cebfc668349c218672501031ecce151d4cb03c4c660b6c6fe7754e75446cd7de09a8c81030c5f6fb377203f551864f3d83e27de7b86499736cbbb549b2f37f436db1cae0a4ea39930f0534aacdd1e3534bc87877e2afabe959ced261f228d6362e6fd277c88c312d966c8b9f67e4a92e757773db0b0862fb8108d1d8fa262a40a1b4171961f0704c8ba314da2482ac8ed9bd28d4b50f7432d89fd800c25a50c5e2f5c0710544fef5273401116aa0572366d8e49ad758fcb29e6a92912e644dbe227c247cb3417eabfab2db16796b2fba420de3b1dc94e8361f1f324a331ddaf1e626553138860757fd0bf687566108b77b70fb9f8f8962eca599c4a70ed373666961a8cb506b96756d9e28b94122b20f16b54f118c0e603ce0b831efea614ad836df6cf9affbdd09596412547496967da758cec9080295d853b0861670b71d9abde0d562b1a6de82782a5b0c14d297f27283a895abc889a5f6703f0e6eb95f67b2da45f150d0d8ab805612d570c2d5cb6997ac3a7756226c2f5c8982ffbd480c5004b0660a3c9468945efde90864019a2b519458724b55d766e16b0da25c0557c01f3c11ddeb024b62e303640e17fdd57dedb3aeb4a2c1b7c93059f9c1d7118d77caac1cd0f6556e46cbc991c1bb16970273dea833d01e5090d061a0c6d25af2415cd2878af97f6d0e7f1f936247b394ecb9bd484da6be936dee9b0b92dc90101a1b4295e97a9772f2263eb09431995aa173df4ca2abd687d87706f0f93eaa5e13cbe3b574fa3cfe94502ace25265778da6960d561381769c24e0cbd7aac73c16f95ae74ff7ec38124f7c722b9cb151d4b6841343f29be8f35145e1b27021056820fed77003df8554b4155716c8cf6049ef5e318481460a8ce3be7c7bfac695255be84dc491c19e9dedc449dd3471728cd2a3ee51324ccb3eef121e3e08f8e18f0006ea8957371d9f2f739f0b89e4db11e5c6430ada61572e589519fbad4498b460ce6e4407fc2d8f2dd4293a50a0cb8fcaaf35cd9a8cc097e3603fbfa08d9036f52b3e7fcce11b83ad28a4ac12dba0395a0cc871cefd1a2856fffb3f28d82ce35cf80579974778bab13d9b3578d8c75a2d196087a2cd439aff2bb33f2db24ac175fff4ed91d36a4cdbfaf3f83074f03894ea40f17034629890da3efdbb41141b38368ab532209b69f057ddc559c19bc8ae62bf3fd564c9a35d9a83d14a95834a92bae6d9a29ae5e8ece07910d16433e4c6230c9bd7d68b47de0de9843988af6dc88b5301820443bd4d0537778bf6b4c1dd067fcf14b81015f2a67c7f2a28f9cb7e0684d3cb4b1c24d9b343122a086611b489532f1c3a26779da1706c6759d96d8ab>";

function buildWireguard(p) {
  const lines = ['[Interface]', `PrivateKey = ${p.privateKey}`, `Address = ${p.v4}, ${p.v6}`, `DNS = ${DNS}`, 'MTU = 1280', 'S1 = 0', 'S2 = 0', 'Jc = 120', 'Jmin = 23', 'Jmax = 911', 'H1 = 1', 'H2 = 2', 'H3 = 3', 'H4 = 4'];
  if (p.deviceType === 'awg15') lines.push(AWG_PARAM);
  lines.push('', '[Peer]', `PublicKey = ${p.publicKey}`, `AllowedIPs = ${p.allowedIPs}`, `Endpoint = ${p.endpoint}`);
  return lines.join('\n');
}

function buildThrone(p) {
  const key = p.privateKey.replace(/=$/, '');
  const reserved = reservedToDashed(p.reserved);
  return `wg://${p.endpoint}?private_key=${key}%3D&peer_public_key=${encodeURIComponent(WARP_PUB)}&pre_shared_key=&reserved=${reserved}&persistent_keepalive=0&mtu=1280&use_system_interface=false&local_address=${p.v4}/32-${p.v6}/128&workers=0&enable_amnezia=true&junk_packet_count=120&junk_packet_min_size=23&junk_packet_max_size=911&init_packet_junk_size=0&response_packet_junk_size=0&init_packet_magic_header=1&response_packet_magic_header=2&underload_packet_magic_header=3&transport_packet_magic_header=4#WARP`;
}

function buildClash(p) {
  const [server, port] = p.endpoint.split(':');
  return `proxies:\n- name: "WARP"\n  type: wireguard\n  private-key: ${p.privateKey}\n  server: ${server}\n  port: ${port}\n  ip: ${p.v4}\n  public-key: ${p.publicKey}\n  allowed-ips: ['0.0.0.0/0']\n  reserved: [${reservedToCSV(p.reserved)}]\n  udp: true\n  mtu: 1280\n  remote-dns-resolve: true\n  dns: [1.1.1.1, 1.0.0.1]\n  amnezia-wg-option:\n   jc: 120\n   jmin: 23\n   jmax: 911\n   s1: 0\n   s2: 0\n   h1: 1\n   h2: 2\n   h4: 3\n   h3: 4`;
}

function buildNekoray(p) {
  const [server, port] = p.endpoint.split(':');
  return JSON.stringify({ mtu: 1280, reserved: reservedToBytes(p.reserved), private_key: p.privateKey, type: 'wireguard', local_address: [`${p.v4}/32`, `${p.v6}/128`], peer_public_key: p.publicKey, server, server_port: parseInt(port) }, null, 2);
}

function buildHusi(p) {
  const [server, port] = p.endpoint.split(':');
  return JSON.stringify({ type: 'wireguard', tag: 'proxy', mtu: 1280, address: [`${p.v4}/32`, `${p.v6}/128`], private_key: p.privateKey, listen_port: 0, peers: [{ address: server, port: parseInt(port), public_key: p.publicKey, pre_shared_key: '', allowed_ips: p.allowedIPs.split(', '), persistent_keepalive_interval: 600, reserved: reservedToCSV(p.reserved) }], detour: 'direct' }, null, 2);
}

function buildKaring(p) {
  const [server, port] = p.endpoint.split(':');
  return JSON.stringify({ outbounds: [{ tag: 'WARP', reserved: reservedToBytes(p.reserved), mtu: 1280, fake_packets: '5-10', fake_packets_size: '40-100', fake_packets_delay: '20-250', fake_packets_mode: 'm4', private_key: p.privateKey, type: 'wireguard', local_address: [`${p.v4}/32`, `${p.v6}/128`], peer_public_key: p.publicKey, server, server_port: parseInt(port) }] }, null, 2);
}

const MASKING_DOMAINS = ['ozon.ru', 'apteka.ru', 'mail.ru', 'psbank.ru', 'lenta.ru', 'www.pochta.ru', 'rzd.ru', 'rutube.ru', 'gosuslugi.ru'];
function buildWiresock(p) {
  const domain = MASKING_DOMAINS[Math.floor(Math.random() * MASKING_DOMAINS.length)];
  const lines = ['[Interface]', `PrivateKey = ${p.privateKey}`, `Address = ${p.v4}, ${p.v6}`, `DNS = ${DNS}`, 'MTU = 1280', 'S1 = 0', 'S2 = 0', 'Jc = 120', 'Jmin = 23', 'Jmax = 911', 'H1 = 1', 'H2 = 2', 'H3 = 3', 'H4 = 4', '# Protocol masking', `Id = ${domain}`, 'Ip = quic', 'Ib = firefox', '', '[Peer]', `PublicKey = ${p.publicKey}`, `AllowedIPs = ${p.allowedIPs}`, `Endpoint = ${p.endpoint}`];
  return lines.join('\n');
}

const BUILDERS = { wireguard: buildWireguard, throne: buildThrone, clash: buildClash, nekoray: buildNekoray, husi: buildHusi, karing: buildKaring, wiresock: buildWiresock };
const EXTENSIONS = { wireguard: 'conf', throne: 'txt', clash: 'yaml', nekoray: 'json', husi: 'json', karing: 'json', wiresock: 'conf' };
const QR_FORMATS = ['wireguard', 'throne', 'wiresock'];

// ---- CORS ----
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

// ---- Pages Functions handlers ----

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}

export async function onRequestGet() {
  return json({ success: true, formats: Object.keys(BUILDERS) });
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const { captchaToken, selectedServices = [], siteMode = 'all', deviceType = 'awg15', endpoint = 'engage.cloudflareclient.com:4500', configFormat = 'wireguard' } = body;

    // hCaptcha
    if (!captchaToken) return json({ success: false, message: 'Капча не пройдена.' }, 400);
    const secret = env.HCAPTCHA_SECRET_KEY;
    if (secret) {
      const vRes = await fetch('https://hcaptcha.com/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: `secret=${secret}&response=${captchaToken}` });
      const vData = await vRes.json();
      if (!vData.success) return json({ success: false, message: 'Неверная капча.' }, 400);
    }

    // Generate
    const kp = generateKeyPair();
    const { id, token } = await registerClient(kp.publicKey);
    const warp = await enableWarp(id, token);
    const peer = warp.result.config.peers[0];
    const iface = warp.result.config.interface;
    const reserved = warp.result.config.client_id || '';
    const allowedIPs = resolveAllowedIPs(selectedServices, siteMode);

    const p = { privateKey: kp.privateKey, publicKey: peer.public_key, v4: iface.addresses.v4, v6: iface.addresses.v6, allowedIPs, endpoint, deviceType, reserved };

    const builder = BUILDERS[configFormat];
    if (!builder) return json({ success: false, message: `Unknown format: ${configFormat}` }, 400);

    const configText = builder(p);
    const ext = EXTENSIONS[configFormat];
    const rid = Math.floor(Math.random() * 9000000) + 1000000;
    const fileName = `${configFormat === 'wireguard' ? 'WARP' : configFormat.toUpperCase()}${rid}.${ext}`;

    let qrCodeBase64 = '';
    if (QR_FORMATS.includes(configFormat)) {
      const qrText = configFormat === 'wireguard' ? configText.replace(/^MTU = \d+\n?/gm, '') : configText;
      qrCodeBase64 = await generateQR(qrText);
    }

    return json({ success: true, content: { configBase64: btoa(configText), qrCodeBase64, configFormat, fileName } });
  } catch (err) {
    return json({ success: false, message: `Ошибка: ${err.message}` }, 500);
  }
}