/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/api/process-data',
        destination: 'http://127.0.0.1:5000/api/process-data',
      },
    ];
  },
};

module.exports = nextConfig;
// LET ME DEPLOY
