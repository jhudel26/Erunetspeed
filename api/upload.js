// Vercel serverless function for upload test
export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        // Read the body to ensure we receive the full upload
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            // Respond after receiving the full body
            res.status(200).json({
                status: 'ok',
                time: Date.now(),
                bytesReceived: body.length
            });
        });
        
        req.on('error', () => {
            res.status(500).json({ error: 'Upload failed' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
