import '@/styles/globals.css'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'

export const metadata = {
  title: 'ספירת העומר',
  description: 'אפליקציה לספירת העומר',
  icons: {
    icon: '/omer-logo-he.png',
    apple: '/omer-logo-he.png',
  },
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
        </ThemeProvider>
      </body>
    </html>
  )
}
