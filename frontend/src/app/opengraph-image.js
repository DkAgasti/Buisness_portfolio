import { ImageResponse } from 'next/og';

// Social share card (Open Graph). 1200×630 branded preview with the real logo.
export const alt = 'CodePro — Full Stack Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const mark = 'https://res.cloudinary.com/fexwwils/image/upload/v1790410089/portfolio/migrated/e3isrfaohx771itxat9e.png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#09090b',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ambient brand glow */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: 'radial-gradient(circle at center, rgba(59,130,246,0.45), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: 'radial-gradient(circle at center, rgba(139,92,246,0.42), transparent 70%)',
          }}
        />

        {/* Brand mark (on a white tile so it reads on the dark card) + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 44 }}>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} width={88} height={88} alt="" />
          </div>
          <div style={{ color: '#e5e7eb', fontSize: 40, fontWeight: 600 }}>CodePro</div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', color: '#ffffff', fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>
          Full Stack Developer
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 18,
            fontSize: 34,
            fontWeight: 500,
            background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          React · Next.js · Node.js · Python · FastAPI · MongoDB · AWS
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', marginTop: 34, color: '#9ca3af', fontSize: 27, maxWidth: 900 }}>
          Building modern web apps, SaaS platforms, AI-powered solutions, and scalable backend systems.
        </div>
      </div>
    ),
    { ...size }
  );
}
