const proxy = require('cors-anywhere');

const PORT = process.env.PORT || 8080;

proxy
  .createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'], // Add any additional headers required by the API
    removeHeaders: ['cookie', 'cookie2'], // Remove any sensitive headers
  })
  .listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
  });
