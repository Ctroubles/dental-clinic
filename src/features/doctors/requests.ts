import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetDoctorsUseCaseInput } from "@/application/use-cases/doctors/get-doctors.use-case"
import { Doctor, DoctorInsert } from "@/domain/entities/doctor"

export async function createDoctor(doctor: DoctorInsert) {
  const response = await apiFetch<Doctor>("doctors", {
    method: "POST",
    body: JSON.stringify(doctor),
  })
  return response
}

export async function getDoctors(request?: IGetDoctorsUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request?.filters?.search) {
    searchParams.set("search", request.filters.search)
  }
  if (request?.filters?.gender) {
    searchParams.set("gender", request.filters.gender)
  }

  if (request?.page) {
    searchParams.set("page", request.page.toString())
  }

  if (request?.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `doctors?${queryString}` : "doctors"

  const response = await apiFetch<PageableResult<Doctor>>(url, {
    method: "GET",
  })
  return response
}

export async function getDoctorById(doctorId: string) {
  const response = await apiFetch<Doctor>(`doctors/${doctorId}`, {
    method: "GET",
  })
  return response
}

export async function updateDoctor(doctorId: string, doctor: DoctorInsert) {
  const response = await apiFetch<Doctor>(`doctors/${doctorId}`, {
    method: "PUT",
    body: JSON.stringify(doctor),
  })
  return response
}
