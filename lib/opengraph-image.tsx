import { ImageResponse } from 'next/og';
import { SITE } from '@/config/site';

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const [name, author] = SITE.name.split(' by ');

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: 80, background: '#09090b', color: '#fafaf9',
      }}>
        <div style={{ display: 'flex', width: 96, height: 8, background: '#FAC775', marginBottom: 40 }} />
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>{name}</div>
        <div style={{ display: 'flex', fontSize: 40, color: '#FAC775', marginTop: 24 }}>by {author}</div>
      </div>
    ),
    size,
  );
}
