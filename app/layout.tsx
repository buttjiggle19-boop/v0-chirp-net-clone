import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Chewy } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })
const chewy = Chewy({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PicPopper",
  description: "Share your moments!",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} ${chewy.className} antialiased`}>{children}</body>
    </html>
  )
}
