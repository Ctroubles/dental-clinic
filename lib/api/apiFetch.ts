import { logger } from "~/config/logger"
import { ApiError, ApiErrorPayload } from "~/lib/api/errors"
import { ApiResponse } from "~/types/api"
import { getAuthToken } from "../token"

/**
 * Represents a valid JSON value.
 */
type Json = string | number | boolean | null | { [prop: string]: Json } | Json[]

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
export const BASE_API_URL = `${BASE_URL}/api`

/**
 * Makes an authenticated API request to the backend, automatically handling token refresh and error parsing.
 *
 * @template T - The expected response type (defaults to Json).
 * @param {string} path - The API endpoint path (relative to the base URL).
 * @param {RequestInit} [init={}] - Optional fetch initialization options.
 * @param {boolean} [shouldRetryAuth=true] - Internal flag to control whether to retry authentication once on 401 errors.
 * @returns {Promise<T>} - The parsed JSON response, or null for 204 No Content.
 * @throws {ApiError} - Throws an ApiError for non-OK responses, including failed authentication.
 */
export async function apiFetch<T = Json>(
  path: string,
  init: RequestInit = {},
  options?: {
    baseUrl?: string
  }
): Promise<T> {
  try {
    const token = await getAuthToken()

    const res = await fetch(`${options?.baseUrl || BASE_API_URL}/${path}`, {
      // const res = await fetch(`https://d83f907a4a04.ngrok-free.app/api/${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    const jsonResponse: unknown = await res.json().catch(parseError => {
      logger.error("Response was not valid JSON", {
        error: parseError as Error,
      })
      throw new ApiError({
        message: "Response was not valid JSON",
        code: "INVALID_JSON",
      })
    })

    // Validate backend response structure
    if (!validateBackendResponse(jsonResponse)) {
      logger.error("Response does not match expected backend format", {
        response: jsonResponse,
      })
      throw new ApiError({
        message: "Response does not match expected backend format",
        code: "INVALID_RESPONSE_FORMAT",
      })
    }

    const apiResponse = jsonResponse as ApiResponse<T>

    // Log response status
    if (apiResponse.isSuccess) {
      logger.api(`wasSuccess: ${init.method || "GET"} ${path}`, {
        isSuccess: apiResponse.isSuccess,
        hasData: !!apiResponse.data,
      })
    } else {
      logger.api(`wasFailure: ${init.method || "GET"} ${path}`, {
        isFailure: apiResponse.isFailure,
        error: apiResponse.error,
      })
    }

    // Check if the API call was successful according to backend
    if (apiResponse.isFailure) {
      const errorMessage = apiResponse.error?.description || "Unknown API error"
      throw new ApiError({
        message: errorMessage,
        code: apiResponse.error?.code || "API_ERROR",
      })
    }

    if (!apiResponse.data) {
      // Some endpoints may return null data on successful responses
      logger.warn(
        `No data returned from API for ${init.method || "GET"} ${path}`,
        {
          response: apiResponse,
        }
      )
    }

    return apiResponse.data as T
  } catch (error) {
    throw new ApiError({
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      code: "NETWORK_ERROR",
    })
  }
}

function validateBackendResponse(
  response: unknown
): response is ApiResponse<unknown> {
  if (!response || typeof response !== "object") {
    logger.error("[apiFetch] response is not an object")
    return false
  }

  const apiResponse = response as Record<string, unknown>

  return (
    // 'data' in apiResponse && // TODO: data is not always present when it's an error
    "isSuccess" in apiResponse &&
    "isFailure" in apiResponse &&
    "error" in apiResponse &&
    typeof apiResponse.isSuccess === "boolean" &&
    typeof apiResponse.isFailure === "boolean"
  )
}
