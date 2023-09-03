/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
};

module.exports = nextConfig;
module.exports = {
  distDir: 'build',
  async rewrites() {
    return [
      {
        source: '/api-llama/:slug*',
        destination: 'https://api.llama.fi/:slug*',
      },
      {
        source: '/covalenthq/:slug*',
        destination: 'https://api.covalenthq.com/:slug*'
      },
      {
        source: '/logos.covalenthq.com/:slug*',
        destination: 'https://logos.covalenthq.com/:slug*'
      },
      {
        source: '/uniswap/:slug*',
        destination: 'https://api.uniswap.org/v2/:slug*'
      },
      {
        source: '/api.1inch.dev/:slug*',
        destination: 'https://api.1inch.dev/:slug*'
      },
      {
        source: '/block/:id',
        destination: '/block/:id',
        // The :path parameter is used here so will not be automatically passed in the query
      },
    ];
  },
};
