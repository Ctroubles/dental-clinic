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

// const newMembersData = [
//   {
//     name: 'Carlos Mendoza',
//     whatsapp: '+51 987 654 321',
//     avatar: 'https://api.slingacademy.com/public/sample-users/1.png',
//     fallback: 'CM',
//     subscriptionDuration: '3 meses',
//     joinDate: 'Hace 2 días'
//   },
//   {
//     name: 'Lucía Estefanía Torres',
//     whatsapp: '+51 912 345 678',
//     avatar: 'https://api.slingacademy.com/public/sample-users/2.png',
//     fallback: 'MT',
//     subscriptionDuration: '1 mes',
//     joinDate: 'Hace 3 días'
//   },
//   {
//     name: 'Juan Pablo Ríos',
//     whatsapp: '+51 998 765 432',
//     avatar: 'https://api.slingacademy.com/public/sample-users/3.png',
//     fallback: 'JR',
//     subscriptionDuration: '6 meses',
//     joinDate: 'Hace 4 días'
//   },
//   {
//     name: 'Ana Lucía Vargas',
//     whatsapp: '+51 977 123 456',
//     avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
//     fallback: 'AV',
//     subscriptionDuration: '2 meses',
//     joinDate: 'Hace 5 días'
//   },
//   {
//     name: 'Diego Alejandro Soto',
//     whatsapp: '+51 966 789 012',
//     avatar: 'https://api.slingacademy.com/public/sample-users/5.png',
//     fallback: 'DS',
//     subscriptionDuration: '1 mes',
//     joinDate: 'Hace 6 días'
//   }
// ];

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
