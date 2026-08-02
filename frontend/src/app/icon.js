import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Favicon — the real 5C brand mark on a white tile (stays legible on both
// light and dark browser tabs, where a bare dark mark would disappear).
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

const mark = `data:image/png;base64,${readFileSync(join(process.cwd(), 'public/mark.png')).toString('base64')}`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background: '#ffffff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={58} height={58} alt="" />
      </div>
    ),
    { ...size }
  );
}
