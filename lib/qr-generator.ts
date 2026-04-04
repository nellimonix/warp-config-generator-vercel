export async function generateQR(text: string): Promise<string> {
  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WarpGenerator/2.0' },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`QR API ${res.status}`);

    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);

    return `data:image/png;base64,${btoa(binary)}`;
  } catch {
    return fallbackSVG();
  }
}

export function unsupportedQR(formatName: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1c1c20"/><polygon points="100,40 160,140 40,140" fill="none" stroke="#EF9F27" stroke-width="2.5"/><text x="100" y="130" text-anchor="middle" font-family="system-ui" font-size="20" fill="#EF9F27">!</text><text x="100" y="170" text-anchor="middle" font-family="system-ui" font-size="11" fill="#71717a">${formatName} — QR не поддерживается</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function fallbackSVG(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1c1c20"/><circle cx="100" cy="90" r="50" fill="none" stroke="#3f3f46" stroke-width="2"/><circle cx="82" cy="78" r="4" fill="#71717a"/><circle cx="118" cy="78" r="4" fill="#71717a"/><path d="M78 108 Q100 95 122 108" fill="none" stroke="#71717a" stroke-width="2"/><text x="100" y="170" text-anchor="middle" font-family="system-ui" font-size="11" fill="#71717a">QR код недоступен</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
