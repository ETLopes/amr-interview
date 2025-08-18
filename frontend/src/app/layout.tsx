import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'aMORA - Simulador Imobiliário',
  description:
    'Simule a compra do seu imóvel dos sonhos com o aMORA. Calcule entrada, financiamento e planejamento financeiro.',
  keywords: ['imóveis', 'simulador', 'financiamento', 'casa própria', 'entrada'],
  authors: [{ name: 'aMORA Team' }],
  openGraph: {
    title: 'aMORA - Simulador Imobiliário',
    description: 'Simule a compra do seu imóvel dos sonhos',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'aMORA - Simulador Imobiliário',
    description: 'Simule a compra do seu imóvel dos sonhos',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030213',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
