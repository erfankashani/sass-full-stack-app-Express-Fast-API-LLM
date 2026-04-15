import { ClerkProvider } from '@clerk/nextjs'; // for authentication
import type { AppProps } from 'next/app';
import '../styles/globals.css';  // This imports Tailwind styles
import ShaderBackground from '@/components/ui/shader-background';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <ShaderBackground />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}