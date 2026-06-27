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
        // Simply respond immediately - the timing is measured on the client side
        res.status(200).json({
            status: 'ok',
            time: Date.now(),
            bytesReceived: req.headers['content-length'] || 0
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
