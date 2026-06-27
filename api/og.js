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
    <!-- Background Gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e1b4b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
    
    <!-- Card Gradient -->
    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(30, 41, 59, 0.8);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(15, 23, 42, 0.9);stop-opacity:1" />
    </linearGradient>
    
    <!-- Title Gradient -->
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    
    <!-- Download Gradient -->
    <linearGradient id="downloadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
    </linearGradient>
    
    <!-- Upload Gradient -->
    <linearGradient id="uploadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
    
    <!-- Ping Gradient -->
    <linearGradient id="pingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
    </linearGradient>
    
    <!-- Glow Filter -->
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGradient)" />
  
  <!-- Grid Pattern -->
  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.05)" stroke-width="1"/>
  </pattern>
  <rect width="1200" height="630" fill="url(#grid)" />
  
  <!-- Decorative Gradient Orbs -->
  <circle cx="200" cy="150" r="150" fill="rgba(59, 130, 246, 0.15)" filter="url(#glow)" />
  <circle cx="1000" cy="480" r="180" fill="rgba(139, 92, 246, 0.15)" filter="url(#glow)" />
  <circle cx="600" cy="315" r="250" fill="rgba(59, 130, 246, 0.05)" />
  
  <!-- Title Section -->
  <text x="600" y="80" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="url(#titleGradient)" text-anchor="middle" filter="url(#glow)">
    ⚡ SPEED TEST RESULTS
  </text>
  
  <!-- Download Card -->
  <g transform="translate(100, 140)">
    <rect width="320" height="280" rx="20" fill="url(#cardGradient)" stroke="rgba(59, 130, 246, 0.3)" stroke-width="2" />
    <circle cx="160" cy="80" r="50" fill="url(#downloadGradient)" opacity="0.2" />
    <text x="160" y="90" font-family="Arial, sans-serif" font-size="32" fill="#10b981" text-anchor="middle">↓</text>
    <text x="160" y="160" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">DOWNLOAD</text>
    <text x="160" y="210" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#10b981" text-anchor="middle">${parseFloat(download).toFixed(2)}</text>
    <text x="160" y="250" font-family="Arial, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">Mbps</text>
  </g>
  
  <!-- Ping Card -->
  <g transform="translate(440, 140)">
    <rect width="320" height="280" rx="20" fill="url(#cardGradient)" stroke="rgba(245, 158, 11, 0.3)" stroke-width="2" />
    <circle cx="160" cy="80" r="50" fill="url(#pingGradient)" opacity="0.2" />
    <text x="160" y="90" font-family="Arial, sans-serif" font-size="32" fill="#f59e0b" text-anchor="middle">⟷</text>
    <text x="160" y="160" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">PING</text>
    <text x="160" y="210" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#f59e0b" text-anchor="middle">${parseFloat(ping).toFixed(0)}</text>
    <text x="160" y="250" font-family="Arial, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">ms</text>
  </g>
  
  <!-- Upload Card -->
  <g transform="translate(780, 140)">
    <rect width="320" height="280" rx="20" fill="url(#cardGradient)" stroke="rgba(59, 130, 246, 0.3)" stroke-width="2" />
    <circle cx="160" cy="80" r="50" fill="url(#uploadGradient)" opacity="0.2" />
    <text x="160" y="90" font-family="Arial, sans-serif" font-size="32" fill="#3b82f6" text-anchor="middle">↑</text>
    <text x="160" y="160" font-family="Arial, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">UPLOAD</text>
    <text x="160" y="210" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#3b82f6" text-anchor="middle">${parseFloat(upload).toFixed(2)}</text>
    <text x="160" y="250" font-family="Arial, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">Mbps</text>
  </g>
  
  <!-- Footer -->
  <text x="600" y="560" font-family="Arial, sans-serif" font-size="16" fill="#475569" text-anchor="middle">
    Professional Internet Speed Test
  </text>
  <text x="600" y="585" font-family="Arial, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">
    Test your connection speed with accuracy
  </text>
</svg>`;

  res.status(200).send(svg);
}
