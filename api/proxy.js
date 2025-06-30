export default async function handler(req, res) {
  const backendUrl = 'https://serversite-pet-adoption.vercel.app';
  // Build the target URL
  const targetPath = req.url.replace(/^\/api\/proxy/, '');
  const url = backendUrl + targetPath + (req.url.includes('?') ? '' : req.url.split('?')[1] ? '?' + req.url.split('?')[1] : '');

  // Prepare fetch options
  const fetchOptions = {
    method: req.method,
    headers: { ...req.headers },
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  };
  // Remove host header to avoid issues
  delete fetchOptions.headers.host;

  try {
    const response = await fetch(url, fetchOptions);
    const data = await response.text();
    res.status(response.status);
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    // Forward content-type
    res.setHeader('Content-Type', response.headers.get('content-type') || 'text/plain');
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
} 