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
    // Proxy the request to the target server
    proxy.web(req, res, { target });
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
