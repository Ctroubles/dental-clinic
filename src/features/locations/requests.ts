import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetLocationsUseCaseInput } from "@/application/use-cases/locations/get-locations.use-case"
import { Location, LocationInsert } from "@/domain/entities/location"

export async function getLocations(request?: IGetLocationsUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request?.filters?.search) {
    searchParams.set("search", request.filters.search)
  }

  if (request?.page) {
    searchParams.set("page", request.page.toString())
  }

  if (request?.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `locations?${queryString}` : "locations"

  const response = await apiFetch<PageableResult<Location>>(url, {
    method: "GET",
  })
  return response
}

export async function getLocationById(id: string) {
  const response = await apiFetch<Location>(`locations/${id}`, {
    method: "GET",
  })
  return response
}

export async function createLocation(newLocation: LocationInsert) {
  const response = await apiFetch<Location>("locations", {
    method: "POST",
    body: JSON.stringify(newLocation),
  })
  return response
}

export async function updateLocation(id: string, location: Location) {
  const response = await apiFetch<Location>(`locations/${id}`, {
    method: "PUT",
    body: JSON.stringify(location),
  })
  return response
}

export async function deleteLocation(id: string) {
  const response = await apiFetch<Location>(`locations/${id}`, {
    method: "DELETE",
  })
  return response
}
