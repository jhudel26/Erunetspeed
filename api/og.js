// Vercel OG Image generation for speed test results
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);
  const download = searchParams.get('download') || '0';
  const upload = searchParams.get('upload') || '0';
  const ping = searchParams.get('ping') || '0';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0f',
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px',
            }}
          >
            ⚡ Speed Test
          </div>

          {/* Speed Metrics */}
          <div
            style={{
              display: 'flex',
              gap: '60px',
              alignItems: 'center',
            }}
          >
            {/* Download */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  color: '#a0a0b0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                ↓ Download
              </div>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                {parseFloat(download).toFixed(2)}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#a0a0b0',
                }}
              >
                Mbps
              </div>
            </div>

            {/* Ping */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  color: '#a0a0b0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                ⟷ Ping
              </div>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                {parseFloat(ping).toFixed(0)}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#a0a0b0',
                }}
              >
                ms
              </div>
            </div>

            {/* Upload */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  color: '#a0a0b0',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                ↑ Upload
              </div>
              <div
                style={{
                  fontSize: '64px',
                  fontWeight: 'bold',
                  color: '#10b981',
                }}
              >
                {parseFloat(upload).toFixed(2)}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#a0a0b0',
                }}
              >
                Mbps
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              fontSize: '18px',
              color: '#666',
              marginTop: '20px',
            }}
          >
            Test your internet speed
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
