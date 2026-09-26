import { ImageResponse } from 'next/og';

// Apple touch icon (iOS home screen). White tile so the mark stays visible —
// iOS composites transparent icons on black, which would hide the dark "5".
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const mark = 'https://res.cloudinary.com/fexwwils/image/upload/v1790410089/portfolio/migrated/e3isrfaohx771itxat9e.png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={150} height={150} alt="" />
      </div>
    ),
    { ...size }
  );
}
