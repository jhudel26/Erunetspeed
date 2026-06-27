// Server-side rendered page for social media sharing with OG tags
export default function handler(req, res) {
  const { download, upload, ping } = req.query;

  // Set OG image URL with parameters
  const ogImageUrl = `/api/og?download=${download || '0'}&upload=${upload || '0'}&ping=${ping || '0'}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Professional internet speed test tool - measure your download, upload speeds, ping, and jitter with accuracy">
  <meta name="theme-color" content="#0f172a">
  
  <!-- Open Graph / Social Media Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Speed Test Results: ${download || '0'} Mbps Download, ${upload || '0'} Mbps Upload">
  <meta property="og:description" content="Download: ${download || '0'} Mbps, Upload: ${upload || '0'} Mbps, Ping: ${ping || '0'} ms">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Speed Test Results: ${download || '0'} Mbps Download, ${upload || '0'} Mbps Upload">
  <meta name="twitter:description" content="Download: ${download || '0'} Mbps, Upload: ${upload || '0'} Mbps, Ping: ${ping || '0'} ms">
  <meta name="twitter:image" content="${ogImageUrl}">
  
  <title>Speed Test Results</title>
  
  <!-- Redirect to main page after a brief delay -->
  <script>
    setTimeout(function() {
      window.location.href = '/?d=${download || '0'}&u=${upload || '0'}&p=${ping || '0'}';
    }, 100);
  </script>
</head>
<body>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0a0a0f; color: white; font-family: Arial, sans-serif;">
    <p>Loading speed test results...</p>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
