import Image from "next/image";
import { LogoGallery } from "@/components/logo-gallery";
import { ColorPalette } from "@/components/color-palette";
import { TypographyShowcase } from "@/components/typography-showcase";
import { BrandHeader } from "@/components/brand-header";
import { ErrorBoundary } from "@/components/error-boundary";
import { CDNStatus } from "@/components/cdn-status";
import { Separator } from "@/components/ui/separator";
import {
  logoConfig,
  paletteLinks,
  primaryColors,
  fullPalette,
} from "@/lib/data";

export default function BrandAssetsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <BrandHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-7xl space-y-20">
        {/* Logo Gallery Section */}
        <ErrorBoundary>
          <section id="logos" className="scroll-mt-8">
            <LogoGallery logoConfig={logoConfig} />
          </section>
        </ErrorBoundary>

        <Separator className="my-16" />

        {/* Color Palette Section */}
        <ErrorBoundary>
          <section id="colors" className="scroll-mt-8">
            <ColorPalette
              primaryColors={primaryColors}
              fullPalette={fullPalette}
              paletteLinks={paletteLinks}
            />
          </section>
        </ErrorBoundary>

        <Separator className="my-16" />

        {/* Typography Section */}
        <ErrorBoundary>
          <section id="typography" className="scroll-mt-8">
            <TypographyShowcase />
          </section>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center p-1.5">
                <Image
                  src="https://cdn.slateai.org/Logos/FINAL/centered/slate-logo-obsidian-gemini-centered-v1.png"
                  alt="SlateAI Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold">SlateAI</p>
                <p className="text-sm text-muted-foreground">
                  AI Automation Agency
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SlateAI. Internal brand assets for team use only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
