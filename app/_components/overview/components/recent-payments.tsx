"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar"
import { Badge } from "~/app/_components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"

// Mock data for recent payments
const recentPaymentsData = [
  {
    id: 1,
    patientName: "Juan Perez",
    treatment: "Limpieza dental",
    amount: 150,
    method: "yape",
    date: "Hace 2 horas",
    initials: "MG",
  },
  {
    id: 2,
    patientName: "Carlos Mendoza",
    treatment: "Extracción de muela",
    amount: 280,
    method: "cash",
    date: "Hace 5 horas",
    initials: "CM",
  },
  {
    id: 3,
    patientName: "Ana Torres",
    treatment: "Ortodoncia - Cuota 1",
    amount: 450,
    method: "card",
    date: "Ayer",
    initials: "AT",
  },
  {
    id: 4,
    patientName: "Luis Ramírez",
    treatment: "Blanqueamiento",
    amount: 380,
    method: "transfer",
    date: "Hace 2 días",
    initials: "LR",
  },
  {
    id: 5,
    patientName: "Patricia Vega",
    treatment: "Endodoncia",
    amount: 520,
    method: "yape",
    date: "Hace 3 días",
    initials: "PV",
  },
]

const paymentMethodLabels: Record<string, string> = {
  yape: "Yape",
  cash: "Efectivo",
  card: "Tarjeta",
  transfer: "Transferencia",
  plin: "Plin",
}

const paymentMethodColors: Record<string, string> = {
  yape: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  cash: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  card: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  transfer:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  plin: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
}

export function RecentPayments() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pagos Recientes</CardTitle>
        <CardDescription>
          Últimos pagos registrados en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentPaymentsData.map(payment => (
            <div key={payment.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://api.slingacademy.com/public/sample-users/${payment.id}.png`}
                  alt={payment.patientName}
                />
                <AvatarFallback>{payment.initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm leading-none font-medium">
                  {payment.patientName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {payment.treatment}
                </p>
              </div>
              <div className="ml-auto text-right space-y-1">
                <p className="text-sm font-medium">S/ {payment.amount}</p>
                <div className="flex items-center gap-2 justify-end">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${paymentMethodColors[payment.method]}`}
                  >
                    {paymentMethodLabels[payment.method]}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {payment.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
