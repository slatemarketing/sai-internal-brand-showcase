"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Copy, Check, Type, ExternalLink } from "lucide-react";

interface FontSampleProps {
  fontName: string;
  fontClass: string;
  usage: string;
  description: string;
  url: string;
  weights?: string[];
}

function FontSample({ fontName, fontClass, usage, description, url, weights }: FontSampleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`font-family: ${fontName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{fontName}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {usage}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {weights && (
          <div className="flex gap-1 flex-wrap">
            {weights.map((weight) => (
              <Badge key={weight} variant="secondary" className="text-xs">
                {weight}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Font samples */}
        <div className="space-y-3">
          <div className={cn("text-2xl font-bold", fontClass)}>
            The quick brown fox jumps
          </div>
          <div className={cn("text-lg", fontClass)}>
            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
          </div>
          <div className={cn("text-base", fontClass)}>
            Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
          </div>
          <div className={cn("text-sm text-muted-foreground", fontClass)}>
            1234567890 !@#$%^&*()
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy CSS
              </>
            )}
          </Button>
          
          <Button asChild variant="outline" size="sm">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              Google Fonts
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function TypographyShowcase() {
  const fonts: FontSampleProps[] = [
    {
      fontName: "Montserrat",
      fontClass: "font-heading",
      usage: "Headings",
      description: "Used for all headings, titles, and emphasis text throughout the brand",
      url: "https://fonts.google.com/specimen/Montserrat",
      weights: ["400", "500", "600", "700", "800", "900"]
    },
    {
      fontName: "Open Sans", 
      fontClass: "font-sans",
      usage: "Body Text",
      description: "Primary font for body text, descriptions, and general content",
      url: "https://fonts.google.com/specimen/Open+Sans",
      weights: ["300", "400", "500", "600", "700", "800"]
    },
    {
      fontName: "Poppins",
      fontClass: "font-accent",
      usage: "Accent",
      description: "Used for buttons, badges, and special callout text elements",
      url: "https://fonts.google.com/specimen/Poppins", 
      weights: ["400", "500", "600", "700"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Type className="h-8 w-8" />
            Typography
          </h2>
          <p className="text-muted-foreground mt-2">
            Official SlateAI font family with usage guidelines and examples
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {fonts.length} font families
        </Badge>
      </div>

      {/* Font samples */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {fonts.map((font) => (
          <FontSample key={font.fontName} {...font} />
        ))}
      </div>

      <Separator />

      {/* Typography hierarchy examples */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Typography Hierarchy</h3>
          <p className="text-muted-foreground mb-6">
            Examples of how our fonts work together in real applications
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold font-heading">
              Main Heading (Montserrat Bold)
            </h1>
            <h2 className="text-2xl font-semibold font-heading">
              Section Heading (Montserrat Semibold)
            </h2>
            <h3 className="text-xl font-medium font-heading">
              Subsection Heading (Montserrat Medium)
            </h3>
            
            <div className="space-y-4">
              <p className="text-base font-sans">
                This is body text using Open Sans. It provides excellent readability and 
                works well for longer content blocks. The font is optimized for both 
                digital screens and print materials.
              </p>
              
              <p className="text-sm text-muted-foreground font-sans">
                This is smaller body text, often used for captions, metadata, or 
                secondary information.
              </p>
            </div>

            <div className="flex gap-3">
              <Button className="font-accent">
                Accent Button (Poppins)
              </Button>
              <Badge className="font-accent">
                Accent Badge
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage guidelines */}
      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold">Typography Guidelines</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <h5 className="font-medium text-foreground mb-2">Font Pairing</h5>
            <ul className="space-y-1">
              <li>• Use Montserrat for all headings and titles</li>
              <li>• Open Sans for body text maintains readability</li>
              <li>• Poppins adds personality to UI elements</li>
              <li>• Never mix more than these three fonts</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-foreground mb-2">Implementation</h5>
            <ul className="space-y-1">
              <li>• Include font-display: swap for performance</li>
              <li>• Load only needed font weights</li>
              <li>• Use CSS variables for consistent application</li>
              <li>• Test across different devices and browsers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}