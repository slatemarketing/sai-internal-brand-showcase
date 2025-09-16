"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BrandQuickActions } from "@/components/brand-quick-actions";
import { Download, Palette, Image as ImageIcon } from "lucide-react";
import { CDNStatus } from "./cdn-status";

export function BrandHeader() {
  return (
    <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Main header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center p-2">
                <Image
                  src="https://cdn.slateai.org/Logos/FINAL/centered/slate-logo-obsidian-gemini-centered-v1.png"
                  alt="SlateAI Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  SlateAI Brand Assets
                </h1>
                <p className="text-muted-foreground">
                  Internal brand resource center
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Internal Use Only
              </Badge>
              <CDNStatus />
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl">
              Access and download official SlateAI logos, color palettes, and
              brand guidelines. All assets are optimized for digital and print
              use across our AI automation platform.
            </p>
          </div>

          {/* Quick actions */}
          <BrandQuickActions />

          {/* Stats */}
          <div className="flex gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>18 Logo Variants</span>
            </div>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>42 Color Swatches</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>PNG & SVG Formats</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
