const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = 3004;

// Define the default target server to which requests will be proxied
let target = 'https://api-phonetime.horisen.pro'; // Replace with your default target server URL

app.use(express.json()); // Enable JSON parsing middleware

// Define a route for handling all incoming requests
app.all('*', async (req, res) => {
    // Log the incoming request URL for demonstration purposes
    console.log(`Request received for: ${req.url}`);

    // Determine the target dynamically based on the request
    if (req.url && req.url.includes('access-token')) {
        target = 'https://accounts-phonetime.horisen.pro';
    }

    try {
        const url = target + req.url;
        const headers = {
            ...req.headers
        };

        if (req.headers.authorization) {
            headers['authorization'] = req.headers.authorization;
        }

        // Handle query parameters
        const queryParams = new URLSearchParams(req.query);
        const queryString = queryParams.toString();

        // Handle request data (body)
        const bodyData = req.method === 'POST' ? querystring.stringify(req.body) : null;

        const params = {
            method: req.method,
            url: queryString ? `${url}?${queryString}` : url,
            data: bodyData || req.body,
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        console.log('Request params: ', params);

        const response = await axios(params);

        if (response) {
            res.status(response.status).send(response.data);
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Listen on the specified port
app.listen(port, () => {
    console.log(`Proxy server is listening on port ${port}`);
});
