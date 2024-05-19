import type { AppProps } from 'next/app';
import '../styles/globals.css';
import SessionProvider from '@/providers/session.provider';
import { ChakraProvider } from '@chakra-ui/react';
import CartProvider from '@/providers/cart.provider';

export default function NextApplication({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <SessionProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
