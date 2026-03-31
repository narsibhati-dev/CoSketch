import type { Metadata } from 'next';
import '@/styles/globals.css';

import { dmSans } from '@/data/fonts';
import ReactQueryProvider from '@/lib/react-query';
import { Toaster } from 'react-hot-toast';
import siteMetadata from '@/lib/siteMetadata';

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: 'CoSketch | Sketch Together, Think Better',
    template: `%s | ${siteMetadata.title}`,
  },

  description: siteMetadata.description,

  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      {/* Favicons */}
      <link
        rel='icon'
        type='image/png'
        href='/favicons/favicon-96x96.png'
        sizes='96x96'
      />
      <link rel='icon' type='image/svg+xml' href='/favicons/favicon.svg' />
      <link rel='shortcut icon' href='/favicons/favicon.ico' />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/favicons/apple-touch-icon.png'
      />
      <meta name='apple-mobile-web-app-title' content='CoSketch' />
      <link rel='manifest' href='/favicons/site.webmanifest' />

      <body className={`${dmSans.className} scroll-smooth antialiased`}>
        <ReactQueryProvider>
          {children}
          <Toaster
            position='top-right'
            reverseOrder={false}
            toastOptions={{
              style: {
                background: '#f9f6ef',
                color: '#1a1916',
                borderRadius: '12px',
                border: '1px solid #e8e2d4',
                boxShadow:
                  '0 18px 45px rgba(0,0,0,0.18), 0 0 0 1px rgba(20,20,16,0.02)',
                padding: '10px 14px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#e04e1f',
                  secondary: '#f5e0d8',
                },
              },
              error: {
                iconTheme: {
                  primary: '#1a1916',
                  secondary: '#f9f6ef',
                },
              },
            }}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
