/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'images.unsplash.com'],
  },
  // Configure SWC for better handling of modern JavaScript features
  compiler: {
    styledComponents: true,
  },
  // Webpack configuration to handle problematic modules
  webpack: (config, { dev, isServer }) => {
    // Handle undici module issues
    config.module.rules.push({
      test: /node_modules\/undici\/lib\/web\/fetch\/util\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: /#target/g,
        replace: '___target',
      },
    });

    return config;
  },
};

// Only use PWA in production
const isProd = process.env.NODE_ENV === 'production';

// Export the final config
module.exports = isProd 
  ? require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
    })(nextConfig)
  : nextConfig; 