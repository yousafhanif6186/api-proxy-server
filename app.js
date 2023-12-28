const http = require('http');
const httpProxy = require('http-proxy');

// Define the target server to which requests will be proxied
let target = 'https://api-phonetime.horisen.pro'; // Replace with your target server URL

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Create a regular HTTP server
const server = http.createServer((req, res) => {
    // Log the incoming request URL for demonstration purposes
    console.log(`Request received for: ${req.url}`);

    if (req.url && req.url.includes('access-token')) {
        target = 'https://accounts-phonetime.horisen.pro';
    }
    console.log(target);
    // Proxy the request to the target server
    proxy.web(req, res, { target });
});

// Log proxy request and target details
proxy.on('proxyReq', (proxyReq, req, res) => {
    console.log(`Proxying request to: ${proxyReq.getHeader('host')}${proxyReq.url}`);
    console.log(`Request url: ${proxyReq.getHeader('host')}${req.url}`);
});

// Log details about the response from the target server
proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log(`Received response with status code: ${proxyRes.statusCode}`);
    // You can log more details about the response headers if needed
    console.log(`Response headers: ${JSON.stringify(proxyRes.headers)}`);
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err);
    res.writeHead(500, {
        'Content-Type': 'text/plain',
    });
    res.end('Proxy Error');
});

// Listen on a specific port
const port = 3004; // Replace with your desired port
server.listen(port, () => {
    console.log(`Proxy server is listening on port ${port}`);
});
