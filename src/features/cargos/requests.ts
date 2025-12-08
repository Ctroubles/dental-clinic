import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import {
  RegisterChargesForVisitInput,
  RegisterChargesForVisitResult,
} from "@/application/use-cases/visits/register-charges-for-visit"
import {
  TrackedCharge,
  TrackedChargeInsert,
} from "@/domain/entities/tracked-charge"
import { serializeCargoFilters } from "./helpers"

export async function createCargo(cargo: TrackedChargeInsert) {
  const response = await apiFetch<TrackedCharge>("tracked-charges", {
    method: "POST",
    body: JSON.stringify(cargo),
  })
  return response
}

export async function getCargos(rawRequest: IGetTrackedChargesUseCaseInput) {
  let queryURL: string = ""

  if (rawRequest) {
    const { filters, ...rest } = rawRequest
    queryURL = serializeCargoFilters({ ...rest, ...(filters || {}) })
  }

  const response = await apiFetch<PageableResult<TrackedCharge>>(
    `tracked-charges${queryURL}`,
    {
      method: "GET",
    }
  )
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
