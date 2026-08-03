import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Personal Portfolio',
    description: 'A portfolio built with the MERN stack and Next.js',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </body>
        </html>
    )
}