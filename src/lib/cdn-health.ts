interface HealthCheckResult {
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: Date;
}

interface CDNHealthStatus {
  logos: HealthCheckResult;
  colorPalette: HealthCheckResult;
}

// Simple in-memory cache for health checks
let healthCache: CDNHealthStatus | null = null;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export async function checkCDNHealth(): Promise<CDNHealthStatus> {
  const now = Date.now();
  
  // Return cached result if recent
  if (healthCache && (now - lastHealthCheck) < HEALTH_CHECK_INTERVAL) {
    return healthCache;
  }

  const logoHealthPromise = checkEndpointHealth(
    "https://cdn.slateai.org/Logos/FINAL/centered/slate-logo-obsidian-gemini-centered-v1.png"
  );
  
  const paletteHealthPromise = checkEndpointHealth(
    "https://cdn.slateai.org/Color%20Palettes/SlateAI%20Color%20Palette%20v0.2.png"
  );

  try {
    const [logoHealth, paletteHealth] = await Promise.all([
      logoHealthPromise,
      paletteHealthPromise,
    ]);

    healthCache = {
      logos: logoHealth,
      colorPalette: paletteHealth,
    };
    
    lastHealthCheck = now;
    return healthCache;
  } catch (error) {
    // Return degraded status if health checks fail
    const errorResult: HealthCheckResult = {
      isHealthy: false,
      error: error instanceof Error ? error.message : "Unknown error",
      lastChecked: new Date(),
    };

    return {
      logos: errorResult,
      colorPalette: errorResult,
    };
  }
}

async function checkEndpointHealth(url: string): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: "HEAD", // Use HEAD to avoid downloading the full file
      signal: controller.signal,
      cache: "no-cache",
    });

    clearTimeout(timeoutId);

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        isHealthy: true,
        responseTime,
        lastChecked: new Date(),
      };
    } else {
      return {
        isHealthy: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        responseTime,
        lastChecked: new Date(),
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      isHealthy: false,
      error: error instanceof Error ? error.message : "Network error",
      responseTime,
      lastChecked: new Date(),
    };
  }
}

export function getHealthStatus(): CDNHealthStatus | null {
  return healthCache;
}

export function isAllCDNHealthy(): boolean {
  if (!healthCache) return true; // Assume healthy if not checked yet
  return healthCache.logos.isHealthy && healthCache.colorPalette.isHealthy;
}