export const dynamic = 'force-static';
export const revalidate = false;

import { NextResponse } from "next/server";
import { CryptoUtils } from '@/lib/crypto-utils';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Однопиксельный PNG
const ONE_PIXEL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9rJb9QAAAABJRU5ErkJggg==";

// Генерация WireGuard-конфига со статикой
function buildStaticWireguardConfig() {
  const keyPair = CryptoUtils.generateKeyPair();
  const privateKey = keyPair.privateKey;
  const publicKey = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo=";

  const ipv4 = `172.${randInt(16)}.${randInt(256)}.${randInt(254) + 1}`;
  const ipv6 = `2606:4700:${randInt(0xffff).toString(16)}:${randInt(
    0xffff
  ).toString(16)}:${randInt(0xffff).toString(16)}:${randInt(
    0xffff
  ).toString(16)}:${randInt(0xffff).toString(16)}:${randInt(
    0xffff
  ).toString(16)}`;

  return `[Interface]
PrivateKey = ${privateKey}
Address = ${ipv4}, ${ipv6}
DNS = 1.1.1.1, 2606:4700:4700::1111, 1.0.0.1, 2606:4700:4700::1001
MTU = 1280
S1 = 0
S2 = 0
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = ${publicKey}
AllowedIPs = 0.0.0.0/0, ::/0
Endpoint = engage.cloudflareclient.com:4500`;
}

export async function OPTIONS() {
  return new Response(null, { headers: CORS_HEADERS });
}

export async function POST() {
  try {
    const cfgText = buildStaticWireguardConfig();

    const response = {
      success: true,
      content: {
        configBase64: Buffer.from(cfgText).toString("base64"),
        qrCodeBase64: `data:image/png;base64,${ONE_PIXEL_PNG_BASE64}`,
        configFormat: "wireguard",
        fileName: `WARP${100000 + randInt(899999)}.conf`,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    console.error("Fake WARP POST error:", err);
    return NextResponse.json(
      { success: false, message: "Internal generator error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
