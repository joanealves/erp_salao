declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: any[];
    buildExcludes?: Array<string | RegExp>;
    dynamicStartUrl?: boolean;
    skipWaiting?: boolean;
    publicExcludes?: string[];
  }
  
  type WithPWA = (config?: PWAConfig) => (nextConfig?: NextConfig) => NextConfig;
  
  const withPWA: WithPWA;
  export = withPWA;
}