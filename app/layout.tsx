import '@/styles/globals.css'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'
import InstallPrompt from './components/InstallPrompt'

export const metadata = {
  title: 'ספירת העומר',
  description: 'אפליקציה לספירת העומר',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ספירת העומר',
  },
  icons: {
    icon: '/omer-logo-he.png',
    apple: '/omer-logo-he.png',
  },
}

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-200 pb-16">
        <ThemeProvider>
          {children}
          <Footer />
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
