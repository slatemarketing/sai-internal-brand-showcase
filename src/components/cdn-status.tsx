"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { checkCDNHealth, type CDNHealthStatus } from "@/lib/cdn-health";
import { Wifi, WifiOff, Clock } from "lucide-react";

export function CDNStatus() {
  const [health, setHealth] = useState<CDNHealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthStatus = await checkCDNHealth();
        setHealth(healthStatus);
      } catch (error) {
        console.error("Failed to check CDN health:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              Checking...
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Checking CDN status...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (!health) {
    return null;
  }

  const isAllHealthy = health.logos.isHealthy && health.colorPalette.isHealthy;
  const avgResponseTime = health.logos.responseTime && health.colorPalette.responseTime
    ? Math.round((health.logos.responseTime + health.colorPalette.responseTime) / 2)
    : undefined;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={isAllHealthy ? "default" : "destructive"} 
            className="gap-1"
          >
            {isAllHealthy ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
            CDN {isAllHealthy ? "Online" : "Issues"}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span>Logo CDN:</span>
              <Badge variant={health.logos.isHealthy ? "default" : "destructive"} className="text-xs">
                {health.logos.isHealthy ? "Online" : "Offline"}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Palette CDN:</span>
              <Badge variant={health.colorPalette.isHealthy ? "default" : "destructive"} className="text-xs">
                {health.colorPalette.isHealthy ? "Online" : "Offline"}
              </Badge>
            </div>
            {avgResponseTime && (
              <div className="text-xs text-muted-foreground">
                Avg response: {avgResponseTime}ms
              </div>
            )}
            {(!health.logos.isHealthy || !health.colorPalette.isHealthy) && (
              <div className="text-xs text-muted-foreground">
                Some downloads may be unavailable
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}