// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public', // Output directory for service worker
  register: true, // Automatically register service worker
  skipWaiting: true, // Activate service worker immediately
  buildExcludes: [/dynamic-css-manifest\.json$/, /app-build-manifest\.json$/], // ⛔ skip this file
});

module.exports = withPWA({
  reactStrictMode: true,
  // experimental: {
  //   turbo: true,
  // },
}); 