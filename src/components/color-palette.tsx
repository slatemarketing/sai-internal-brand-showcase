"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Download, ExternalLink, Copy, Check, Palette, AlertCircle } from "lucide-react";

// Utility to check if a color is dark
const isColorDark = (hex: string): boolean => {
  const rgb = parseInt(hex.substring(1), 16);
  const [r, g, b] = [(rgb >> 16) & 0xff, (rgb >> 8) & 0xff, rgb & 0xff];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
};

interface ColorSwatchProps {
  hex: string;
  isPrimary?: boolean;
}

function ColorSwatch({ hex, isPrimary = false }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  const dark = isColorDark(hex);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get color name from hex value
  const getColorName = (hex: string) => {
    const colorMap: Record<string, string> = {
      "#232B2B": "Obsidian",
      "#5F6F7C": "Ash", 
      "#82998A": "Juniper",
      "#6D94C3": "Mineral",
      "#F0F4F4": "Stratum"
    };
    return colorMap[hex.toUpperCase()] || "";
  };

  const colorName = getColorName(hex);

  return (
    <div
      className={cn(
        "group relative rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer border-2 border-transparent hover:border-white/20",
        isPrimary ? "h-40" : "h-32"
      )}
      style={{ backgroundColor: hex }}
      onClick={handleCopy}
    >
      <div className="flex flex-col gap-1">
        {colorName && (
          <span
            className={cn(
              "text-sm font-medium",
              dark ? "text-white/90" : "text-black/90"
            )}
          >
            {colorName}
          </span>
        )}
        <span
          className={cn(
            "font-mono font-bold text-lg",
            dark ? "text-white" : "text-black"
          )}
        >
          {hex}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className={cn(
            "transition-all duration-200",
            dark
              ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
              : "bg-black/10 hover:bg-black/15 text-black border-black/20"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
        
        {isPrimary && (
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              dark ? "bg-white/10 text-white" : "bg-black/10 text-black"
            )}
          >
            Primary
          </Badge>
        )}
      </div>
    </div>
  );
}

interface ColorPaletteProps {
  primaryColors: string[];
  fullPalette: string[][];
  paletteLinks: { download: string; external: string };
}

export function ColorPalette({
  primaryColors,
  fullPalette,
  paletteLinks,
}: ColorPaletteProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    
    try {
      const filename = "SlateAI-Color-Palette-v0.2.png";
      const proxyUrl = `/api/download?url=${encodeURIComponent(paletteLinks.download)}&filename=${encodeURIComponent(filename)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        
        if (response.status === 429) {
          throw new Error("Too many downloads. Please wait a moment and try again.");
        } else if (response.status === 404) {
          throw new Error("Color palette file not found. Please contact support.");
        } else if (response.status === 502) {
          throw new Error("CDN temporarily unavailable. Please try again later.");
        } else {
          throw new Error(errorMessage);
        }
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error("Download failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Download failed. Please try again.";
      setDownloadError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setDownloadError(null), 5000);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Palette className="h-8 w-8" />
            Color Palette
          </h2>
          <p className="text-muted-foreground mt-2">
            Official SlateAI brand colors with hex values and usage guidelines
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {primaryColors.length + fullPalette.flat().length} colors total
        </Badge>
      </div>

      {/* Error display */}
      {downloadError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{downloadError}</p>
        </div>
      )}

      {/* Primary Colors Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold">Primary Colors</h3>
            <p className="text-muted-foreground">Core brand colors for primary usage</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleDownload}
              disabled={downloading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Downloading..." : "Download Palette"}
            </Button>
            <Button asChild>
              <a
                href={paletteLinks.external}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Figma Workspace
              </a>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {primaryColors.map((hex) => (
            <ColorSwatch key={hex} hex={hex} isPrimary />
          ))}
        </div>
      </div>

      <Separator />

      {/* Extended Palette Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold">Extended Palette</h3>
          <p className="text-muted-foreground">
            Complete color system with tints and shades for flexible design applications
          </p>
        </div>
        
        <div className="space-y-4">
          {fullPalette.map((row, index) => (
            <div key={index} className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Shade Group {index + 1}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {row.map((hex) => (
                  <ColorSwatch key={hex} hex={hex} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold">Usage Guidelines</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h5 className="font-medium text-foreground mb-2">Primary Colors</h5>
            <ul className="space-y-1">
              <li>• Use for main UI elements and branding</li>
              <li>• Maintain contrast ratios for accessibility</li>
              <li>• Obsidian (#232B2B) for primary text and CTAs</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-foreground mb-2">Extended Palette</h5>
            <ul className="space-y-1">
              <li>• Use for backgrounds, borders, and subtle elements</li>
              <li>• Create depth and hierarchy in designs</li>
              <li>• Always test readability before implementation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
