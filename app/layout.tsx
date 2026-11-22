import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter, Noto_Sans, Playfair_Display } from "next/font/google"

import "./globals.css"
import { AmbientAurora } from "@/components/ambient-aurora"
import { AmbientGlyphs } from "@/components/ambient-glyphs"
import { AmbientOutlineWords } from "@/components/ambient-outline-words"
import { DepthLayerControls } from "@/components/depth-layer-controls"
import { DepthLayerProvider } from "@/components/depth-layer-provider"
import { SkipLink } from "@/components/skip-link"
import { SmoothScroll } from "@/components/smooth-scroll"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'})

const fontDisplay = Inter({ subsets: ["latin"], variable: "--font-display" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://robert-stewart.dev"),
  title: "Robert Stewart | Full-Stack Software Engineer",
  description:
    "Full-stack software engineer building multi-tenant mobile, web, and cloud systems end to end.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://robert-stewart.dev",
    title: "Robert Stewart | Full-Stack Software Engineer",
    description:
      "Full-stack software engineer building multi-tenant mobile, web, and cloud systems end to end.",
    siteName: "Robert Stewart",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robert Stewart | Full-Stack Software Engineer",
    description:
      "Full-stack software engineer building multi-tenant mobile, web, and cloud systems end to end.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, fontDisplay.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body>
        <SkipLink />
        <ThemeProvider>
          <SmoothScroll>
            <DepthLayerProvider>
              <AmbientAurora />
              <AmbientOutlineWords />
              <AmbientGlyphs />
              <div className="relative z-10">
                <TooltipProvider>{children}</TooltipProvider>
              </div>
              <DepthLayerControls />
            </DepthLayerProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
