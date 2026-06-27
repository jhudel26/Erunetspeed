// Vercel OG Image generation for speed test results using SVG converted to PNG
import sharp from 'sharp';

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "image/png");

  const { download = "0", upload = "0", ping = "0" } = req.query;

  const d = isNaN(download) ? 0 : parseFloat(download);
  const u = isNaN(upload) ? 0 : parseFloat(upload);
  const p = isNaN(ping) ? 0 : parseFloat(ping);

  const svg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>

    <!-- Background -->
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#070A12"/>
      <stop offset="50%" stop-color="#0B1220"/>
      <stop offset="100%" stop-color="#070A12"/>
    </linearGradient>

    <!-- Soft Accent Glow -->
    <radialGradient id="glow1">
      <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>

    <radialGradient id="glow2">
      <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>

    <!-- Shadow -->
    <filter id="shadow">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#000" flood-opacity="0.5"/>
    </filter>

    <!-- Text Style -->
    <style>
      .font { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; }
    </style>

  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Ambient Glow -->
  <circle cx="250" cy="150" r="220" fill="url(#glow1)"/>
  <circle cx="950" cy="500" r="260" fill="url(#glow2)"/>

  <!-- Header -->
  <text x="600" y="90" text-anchor="middle"
        class="font"
        font-size="44"
        font-weight="700"
        fill="#E5E7EB"
        letter-spacing="2">
    INTERNET SPEED RESULTS
  </text>

  <text x="600" y="120" text-anchor="middle"
        class="font"
        font-size="16"
        fill="#94A3B8">
    Real-time network performance summary
  </text>

  <!-- Cards Group -->
  
  <!-- DOWNLOAD -->
  <g filter="url(#shadow)">
    <rect x="120" y="170" width="280" height="300" rx="22"
          fill="rgba(255,255,255,0.05)" stroke="rgba(59,130,246,0.25)"/>
    <text x="260" y="240" text-anchor="middle" class="font" font-size="18" fill="#93C5FD">DOWNLOAD</text>
    <text x="260" y="330" text-anchor="middle" class="font" font-size="54" font-weight="700" fill="#60A5FA">
      ${d.toFixed(2)}
    </text>
    <text x="260" y="370" text-anchor="middle" class="font" font-size="14" fill="#64748B">Mbps</text>
  </g>

  <!-- PING -->
  <g filter="url(#shadow)">
    <rect x="460" y="170" width="280" height="300" rx="22"
          fill="rgba(255,255,255,0.05)" stroke="rgba(245,158,11,0.25)"/>
    <text x="600" y="240" text-anchor="middle" class="font" font-size="18" fill="#FCD34D">PING</text>
    <text x="600" y="330" text-anchor="middle" class="font" font-size="54" font-weight="700" fill="#F59E0B">
      ${p.toFixed(0)}
    </text>
    <text x="600" y="370" text-anchor="middle" class="font" font-size="14" fill="#64748B">ms</text>
  </g>

  <!-- UPLOAD -->
  <g filter="url(#shadow)">
    <rect x="800" y="170" width="280" height="300" rx="22"
          fill="rgba(255,255,255,0.05)" stroke="rgba(34,197,94,0.25)"/>
    <text x="940" y="240" text-anchor="middle" class="font" font-size="18" fill="#86EFAC">UPLOAD</text>
    <text x="940" y="330" text-anchor="middle" class="font" font-size="54" font-weight="700" fill="#34D399">
      ${u.toFixed(2)}
    </text>
    <text x="940" y="370" text-anchor="middle" class="font" font-size="14" fill="#64748B">Mbps</text>
  </g>

  <!-- Footer -->
  <text x="600" y="560" text-anchor="middle"
        class="font"
        font-size="14"
        fill="#6B7280">
    Powered by ERU Speed Test • Accurate network measurement
  </text>

</svg>
`);

  sharp(svg)
    .png()
    .toBuffer()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      console.error('Error converting SVG to PNG:', err);
      res.status(500).send('Error generating image');
    });
}