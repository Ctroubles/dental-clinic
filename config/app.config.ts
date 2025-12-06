/**
 * Application configuration interface for centralized environment management.
 */
interface AppConfig {
  /** Application metadata and branding configuration */
  app: {
    /** Application display name used in branding and metadata */
    name: string
    /** Application version for tracking and debugging */
    version: string
    /** Base URL for the application, used for metadata and domain extraction */
    url: string
    /** Current deployment environment */
    environment: "development" | "staging" | "production"
  }

  /** API configuration for backend communication */
  api: {
    /** Backend API base URL for all service calls */
    baseUrl: string
    basePath: string
    /** Request timeout in milliseconds for API calls */
    timeout: number
  }
}

/**
 * Application configuration instance with environment variable mapping.
 * Maps environment variables to typed configuration with fallback defaults.
 */
const config: AppConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Dot Update",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "0.0.1",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    environment:
      (process.env
        .NEXT_PUBLIC_ENVIRONMENT as AppConfig["app"]["environment"]) ||
      "development",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050",
    basePath: process.env.NEXT_PUBLIC_API_BASE_PATH || "/api",
    timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 30000),
  },
}

/**
 * Frozen application configuration object.
 * Provides immutable access to application settings throughout the codebase.
 *
 * @example
 * ```typescript
 * import { appConfig } from '@/config/app.config';
 *
 * // Access API configuration
 * const apiUrl = appConfig.api.baseUrl;
 *
 * // Access pricing information
 * const mcs150Price = appConfig.pricing.mcs150;
 *
 * // Access application metadata
 * const appName = appConfig.app.name;
 * ```
 */
export const appConfig = Object.freeze(config)
