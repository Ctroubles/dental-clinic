import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import {
  RegisterChargesForVisitInput,
  RegisterChargesForVisitResult,
} from "@/application/use-cases/visits/register-charges-for-visit"
import {
  TrackedCharge,
  TrackedChargeInsert,
} from "@/domain/entities/tracked-charge"
import { CargosFilters } from "./types"

export async function createCargo(cargo: TrackedChargeInsert) {
  const response = await apiFetch<TrackedCharge>("tracked-charges", {
    method: "POST",
    body: JSON.stringify(cargo),
  })
  return response
}

export async function getCargos(request: IGetTrackedChargesUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request.filters?.search) {
    searchParams.set("search", request.filters.search)
  }
  if (request.filters?.patientId) {
    searchParams.set("patientId", request.filters.patientId)
  }
  if (request.filters?.doctorId) {
    searchParams.set("doctorId", request.filters.doctorId)
  }
  if (request.filters?.itemId) {
    searchParams.set("itemId", request.filters.itemId)
  }
  if (request.filters?.type) {
    searchParams.set("type", request.filters.type)
  }
  if (request.filters?.paymentStatus) {
    searchParams.set("paymentStatus", request.filters.paymentStatus)
  }
  if (request.filters?.progressStatus) {
    searchParams.set("progressStatus", request.filters.progressStatus)
  }

  if (request.page) {
    searchParams.set("page", request.page.toString())
  }
  if (request.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `tracked-charges?${queryString}` : "tracked-charges"

  const response = await apiFetch<PageableResult<TrackedCharge>>(url, {
    method: "GET",
  })
  return response
}

export async function getCargoById(cargoId: string) {
  const response = await apiFetch<TrackedCharge>(`tracked-charges/${cargoId}`, {
    method: "GET",
  })
  return response
}

export async function getTrackedChargeById(trackedChargeId: string) {
  return getCargoById(trackedChargeId)
}

export async function updateCargo(cargoId: string, cargo: TrackedChargeInsert) {
  const response = await apiFetch<TrackedCharge>(`tracked-charges/${cargoId}`, {
    method: "PUT",
    body: JSON.stringify(cargo),
  })
  return response
}

export async function deleteCargo(cargoId: string) {
  const response = await apiFetch<null>(`tracked-charges/${cargoId}`, {
    method: "DELETE",
  })
  return response
}

export async function getCargosByPatient(patientId: string) {
  const response = await apiFetch<TrackedCharge[]>(
    `tracked-charges/patient/${patientId}`,
    {
      method: "GET",
    }
  )
  return response
}

export async function getCargosByVisit(visitId: string) {
  const response = await apiFetch<TrackedCharge[]>(
    `tracked-charges/visit/${visitId}`,
    {
      method: "GET",
    }
  )
  return response
}

export async function registerChargesForVisit(
  input: RegisterChargesForVisitInput
) {
  const response = await apiFetch<RegisterChargesForVisitResult>(
    `visits/${input.visitId}/charges`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  )
  return response
}
