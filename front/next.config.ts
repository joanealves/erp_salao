import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})({
  /* suas configurações existentes aqui */
});

export default nextConfig;