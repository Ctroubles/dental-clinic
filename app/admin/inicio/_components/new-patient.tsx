"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"
import { dateToHumanReadable } from "~/lib/utils"
import { useGetPatients } from "@/features/patients/hooks"

export function NewPatients() {
  const { data: patientsData } = useGetPatients()
  const patients = patientsData?.records || []

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Nuevos Pacientes</CardTitle>
        <CardDescription>
          Se han registrado 25 nuevos Pacientes este mes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {patients.map((patient, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={"https://api.slingacademy.com/public/sample-users/1.png"}
                  alt="Avatar"
                />
                <AvatarFallback>
                  {patient.firstName.charAt(0)}
                  {patient.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm leading-none font-medium">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {patient.phone || "Sin teléfono"}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-muted-foreground mt-1">
                  {dateToHumanReadable(patient.createdAt) ||
                    "Sin fecha de registro"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
