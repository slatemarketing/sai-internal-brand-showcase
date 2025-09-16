"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Download, Eye, Copy, Check, AlertCircle } from "lucide-react";
import type { LogoConfig, LogoVariant } from "@/lib/data";

interface LogoGalleryProps {
  logoConfig: LogoConfig;
}

export function LogoGallery({ logoConfig }: LogoGalleryProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async (url: string, filename: string) => {
    setDownloading(filename);
    setDownloadError(null);
    
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(
        url
      )}&filename=${encodeURIComponent(filename)}`;
      
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        
        if (response.status === 429) {
          throw new Error("Too many downloads. Please wait a moment and try again.");
        } else if (response.status === 404) {
          throw new Error("File not found. This asset may have been moved or removed.");
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
      setDownloading(null);
    }
  };

  const handleCopyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Logo Collection</h2>
          <p className="text-muted-foreground mt-2">
            Download official SlateAI logos in various formats and color
            variations
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {logoConfig.variants.length} variants × {logoConfig.categories.length}{" "}
          styles
        </Badge>
      </div>

      {/* Error display */}
      {downloadError && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">{downloadError}</p>
        </div>
      )}

      <Tabs defaultValue={logoConfig.categories[0].slug} className="w-full">
        <TabsList className="grid w-full grid-cols-3 border border-border/50 shadow-sm">
          {logoConfig.categories.map((cat) => (
            <TabsTrigger
              key={cat.slug}
              value={cat.slug}
              className="flex items-center gap-2 border-r last:border-r-0 border-border/30 data-[state=active]:border-primary/20"
            >
              <Eye className="h-4 w-4" />
              {cat.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {logoConfig.categories.map((cat) => (
          <TabsContent key={cat.slug} value={cat.slug} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {logoConfig.variants.map((variant) => {
                const fileName = `slate-logo-${variant.color}-${cat.slug}-${logoConfig.version}.png`;
                const filePath = `${logoConfig.basePath}/${cat.folder}/${fileName}`;
                const isDarkTheme = variant.theme === "dark";

                return (
                  <Card
                    key={variant.color}
                    className={cn(
                      "group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
                      "border-2 hover:border-primary/20",
                      isDarkTheme &&
                        "bg-slate-900 border-slate-600 text-slate-100"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle
                          className={cn(
                            "text-lg",
                            isDarkTheme && "text-slate-100"
                          )}
                        >
                          {variant.name}
                        </CardTitle>
                        <Badge
                          variant={isDarkTheme ? "outline" : "default"}
                          className={cn(
                            "text-xs",
                            isDarkTheme &&
                              "border-slate-400 text-slate-200 bg-slate-800"
                          )}
                        >
                          {isDarkTheme ? "Dark" : "Light"}
                        </Badge>
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkTheme
                            ? "text-slate-300"
                            : "text-muted-foreground"
                        )}
                      >
                        {cat.title} layout • PNG format
                      </p>
                    </CardHeader>

                    <CardContent
                      className={cn(
                        "flex items-center justify-center p-8 h-40 mx-4 rounded-lg transition-colors",
                        isDarkTheme
                          ? "bg-slate-800 hover:bg-slate-700"
                          : "bg-slate-50 hover:bg-slate-100"
                      )}
                    >
                      <Image
                        src={filePath}
                        alt={`${variant.name} Logo - ${cat.title} Layout`}
                        width={160}
                        height={80}
                        className="max-h-20 w-auto object-contain transition-transform group-hover:scale-110"
                      />
                    </CardContent>

                    <CardFooter className="pt-4 space-y-4">
                      <div className="flex items-center gap-2 w-full">
                        <Button
                          onClick={() => handleDownload(filePath, fileName)}
                          disabled={downloading === fileName}
                          className={cn(
                            "flex-1",
                            isDarkTheme &&
                              "bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600"
                          )}
                          size="sm"
                          variant={isDarkTheme ? "outline" : "default"}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {downloading === fileName
                            ? "Downloading..."
                            : "Download"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyPath(filePath)}
                          className={cn(
                            "px-3",
                            isDarkTheme &&
                              "border-slate-600 text-slate-700 hover:bg-slate-700 hover:text-slate-100"
                          )}
                        >
                          {copiedPath === filePath ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>

                        <p
                          className={cn(
                            "text-xs truncate flex-1 ml-1.5",
                            isDarkTheme
                              ? "text-slate-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {fileName}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
