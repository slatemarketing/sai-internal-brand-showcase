"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Download,
  FileText,
  ExternalLink,
  Info,
  CheckCircle,
  Calendar,
} from "lucide-react";

export function BrandQuickActions() {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadAll = async () => {
    setDownloading(true);
    // Simulate download process
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handleDownloadAll}
        disabled={downloading}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        {downloading ? "Preparing..." : "Download All Assets"}
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Brand Guidelines
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Brand Guidelines</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-6 pb-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Logo Usage</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Maintain minimum clear space of 1x logo height</li>
                  <li>• Use high contrast variants for accessibility</li>
                  <li>• Do not stretch, rotate, or distort the logo</li>
                  <li>• Use SVG format for web, PNG for print</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Color Application</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Obsidian (#232B2B) for primary CTAs and headers</li>
                  <li>• Stratum (#F0F4F4) for light backgrounds</li>
                  <li>• Maintain WCAG AA contrast ratios (4.5:1 minimum)</li>
                  <li>• Test all color combinations before use</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Typography</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Primary: Inter (web), Helvetica (print)</li>
                  <li>• Monospace: Geist Mono for code elements</li>
                  <li>• Maintain consistent line heights (1.5x)</li>
                  <li>• Use font weights 400, 500, 600, 700</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Full Guidelines PDF
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Info className="h-4 w-4" />
            Version Info
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Brand Asset Information</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 px-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Version</span>
                <Badge variant="secondary">v1.2.0</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">
                  Dec 15, 2024
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Assets</span>
                <span className="text-sm text-muted-foreground">60 files</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Formats Available</span>
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-xs">
                    PNG
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    SVG
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    PDF
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recent Updates
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Logo refresh completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated all variants with improved contrast
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      Color palette expanded
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added extended shades and accessibility improvements
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Button asChild variant="outline">
        <a
          href="https://www.figma.com/color-palette-generator/?colors=232B2B-5F6F7C-82998A-6D94C3-F0F4F4"
          target="_blank"
          rel="noopener noreferrer"
          className="gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Figma Workspace
        </a>
      </Button>
    </div>
  );
}
