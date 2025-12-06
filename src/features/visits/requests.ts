import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetVisitsUseCaseInput } from "@/application/use-cases/visits/get-visits.use-case"
import { Visit, VisitInsert } from "@/domain/entities/visit"

export async function createVisit(visit: VisitInsert) {
  const response = await apiFetch<Visit>("visits", {
    method: "POST",
    body: JSON.stringify(visit),
  })
  return response
}

export async function getVisits(request?: IGetVisitsUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request?.filters?.search) {
    searchParams.set("search", request.filters.search)
  }
  if (request?.filters?.patientId) {
    searchParams.set("patientId", request.filters.patientId)
  }
  if (request?.filters?.doctorId) {
    searchParams.set("doctorId", request.filters.doctorId)
  }

  if (request?.page) {
    searchParams.set("page", request.page.toString())
  }

  if (request?.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `visits?${queryString}` : "visits"

  const response = await apiFetch<PageableResult<Visit>>(url, {
    method: "GET",
  })
  return response
}

export async function getVisitById(visitId: string) {
  const response = await apiFetch<Visit>(`visits/${visitId}`, {
    method: "GET",
  })
  return response
}

export async function getVisitsByPatientId(patientId: string) {
  const response = await apiFetch<Visit[]>(`visits/patient/${patientId}`, {
    method: "GET",
  })
  return response
}

export async function updateVisit(visitId: string, visit: VisitInsert) {
  const response = await apiFetch<Visit>(`visits/${visitId}`, {
    method: "PUT",
    body: JSON.stringify(visit),
  })
  return response
}

export async function deleteVisit(visitId: string) {
  const response = await apiFetch<string>(`visits/${visitId}`, {
    method: "DELETE",
  })
  return response
}
