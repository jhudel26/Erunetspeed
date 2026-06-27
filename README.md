# ⚡ Speed Test

A modern, responsive internet speed test web application built with vanilla HTML, CSS, and JavaScript. Deployed on Vercel with serverless functions for accurate speed testing.

## Features

- **Download Speed Test**: Measures download speed using Cloudflare's speed test servers
- **Upload Speed Test**: Tests upload speed with custom serverless endpoint
- **Ping/Latency Test**: Calculates average ping time with multiple requests
- **Modern Dark UI**: Clean, responsive design with smooth animations
- **Share Results**: Generate shareable URLs with dynamic OG images
- **Local Storage**: Saves your last test result for quick reference
- **Mobile Friendly**: Fully responsive design for all devices

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions
- **OG Image**: @vercel/og for dynamic social media images
- **Deployment**: Vercel

## Project Structure

```
speedtest v2/
├── index.html          # Main application page
├── style.css           # Styling with dark mode
├── script.js           # Speed test logic
├── api/
│   ├── ping.js         # Ping test endpoint
│   ├── upload.js       # Upload test endpoint
│   └── og.js           # OG image generator
├── vercel.json         # Vercel configuration
├── package.json        # Dependencies
└── README.md           # Documentation
```

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd speedtest-v2
```

2. Install dependencies:
```bash
npm install
```

## Local Development

Run the development server:

```bash
npm run dev
```

Or use Vercel CLI:

```bash
vercel dev
```

## Deployment to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Deploy with default settings

### Option 3: Vercel Git Integration

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on push

## API Endpoints

### GET /api/ping
Returns current timestamp for ping measurement.

**Response:**
```json
{
  "status": "ok",
  "time": 1719504000000
}
```

### POST /api/upload
Accepts upload data for speed testing.

**Response:**
```json
{
  "status": "ok",
  "time": 1719504000000,
  "bytesReceived": 10000000
}
```

### GET /api/og?download=xx&upload=xx&ping=xx
Generates dynamic OG image for social media sharing.

**Parameters:**
- `download`: Download speed in Mbps
- `upload`: Upload speed in Mbps
- `ping`: Ping in milliseconds

**Response:** PNG image (1200x630)

## Sharing Results

After completing a speed test, click the "Share Result" button to:

1. Copy a shareable URL to clipboard
2. Share via native share dialog (mobile devices)
3. Generate dynamic OG image for social media

**Example Share URL:**
```
https://yourdomain.com/?d=120.50&u=45.30&p=15
```

## Customization

### Change Download Test Server

Edit `script.js` and modify the `testDownload()` function:

```javascript
const url = 'https://your-custom-server.com/__down?bytes=10000000';
```

### Update Colors

Edit `style.css` and modify the CSS variables:

```css
:root {
    --accent-blue: #3b82f6;
    --accent-green: #10b981;
    --accent-purple: #8b5cf6;
    --accent-orange: #f59e0b;
}
```

### Modify OG Image Design

Edit `api/og.js` to customize the social media image appearance.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

- Use a stable internet connection
- Close other bandwidth-intensive applications
- Test multiple times for accurate results
- Results may vary based on server location

## Troubleshooting

### Upload test failing
- Check if `/api/upload` is deployed correctly
- Verify CORS settings in Vercel dashboard
- Check browser console for errors

### OG image not generating
- Ensure `@vercel/og` is installed
- Check Vercel Edge Functions are enabled
- Verify the API endpoint is accessible

### CORS errors
- Ensure `vercel.json` has correct headers
- Check serverless functions have CORS enabled
- Verify API routes are properly configured

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for accurate internet speed testing
