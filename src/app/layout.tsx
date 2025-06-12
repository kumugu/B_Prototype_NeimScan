import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NeimScan: 축의금 기록기',
  description: '축의금 관리 웹앱',
  manifest: '/manifest.json',
  themeColor: '#F8F8F8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#F8F8F8" />
      </head>
      <body>{children}</body>
    </html>
  )
}
