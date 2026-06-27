// Vercel OG Image generation for speed test results using SVG
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { download = '0', upload = '0', ping = '0' } = req.query;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#12121a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />
  
  <!-- Decorative circles -->
  <circle cx="240" cy="315" r="200" fill="rgba(59, 130, 246, 0.1)" />
  <circle cx="960" cy="315" r="200" fill="rgba(139, 92, 246, 0.1)" />
  
  <!-- Title -->
  <text x="600" y="120" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="url(#titleGradient)" text-anchor="middle">
    ⚡ Speed Test
  </text>
  
  <!-- Download -->
  <g transform="translate(200, 250)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="24" fill="#a0a0b0" text-anchor="middle">↓ Download</text>
    <text x="0" y="70" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#3b82f6" text-anchor="middle">${parseFloat(download).toFixed(2)}</text>
    <text x="0" y="110" font-family="Arial, sans-serif" font-size="20" fill="#a0a0b0" text-anchor="middle">Mbps</text>
  </g>
  
  <!-- Ping -->
  <g transform="translate(600, 250)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="24" fill="#a0a0b0" text-anchor="middle">⟷ Ping</text>
    <text x="0" y="70" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#f59e0b" text-anchor="middle">${parseFloat(ping).toFixed(0)}</text>
    <text x="0" y="110" font-family="Arial, sans-serif" font-size="20" fill="#a0a0b0" text-anchor="middle">ms</text>
  </g>
  
  <!-- Upload -->
  <g transform="translate(1000, 250)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="24" fill="#a0a0b0" text-anchor="middle">↑ Upload</text>
    <text x="0" y="70" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#10b981" text-anchor="middle">${parseFloat(upload).toFixed(2)}</text>
    <text x="0" y="110" font-family="Arial, sans-serif" font-size="20" fill="#a0a0b0" text-anchor="middle">Mbps</text>
  </g>
  
  <!-- Footer -->
  <text x="600" y="550" font-family="Arial, sans-serif" font-size="18" fill="#666" text-anchor="middle">
    Test your internet speed
  </text>
</svg>`;

  res.status(200).send(svg);
}
