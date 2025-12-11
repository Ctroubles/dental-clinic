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
import { dateToHumanReadable, getEntityInitials } from "~/lib/utils"
import { useRecentPayments } from "@/features/analytics/hooks/api/queries"
import { RecentSalesSkeleton } from "./recent-sales-skeleton"

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
  const { data, isLoading, error } = useRecentPayments()

  if (isLoading) {
    return <RecentSalesSkeleton />
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Pagos Recientes</CardTitle>
        <CardDescription>
          Últimos pagos registrados en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data?.map(payment => (
            <div key={payment.id} className="flex items-center">
              {/* <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://api.slingacademy.com/public/sample-users/${index + 1}.png`}
                  alt={payment.patientName}
                />
                <AvatarFallback>
                  {getEntityInitials(payment.patientName)}
                </AvatarFallback>
              </Avatar> */}
              <div className="ml-4 space-y-1 flex-1">
                <p className="text-sm leading-none font-medium">
                  {payment.patientName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {payment.serviceName || "--"}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-medium">S/ {payment.amount}</p>
                <div className="flex items-center gap-2 justify-end">
                  <Badge
                    variant="secondary"
                    className={`text-xs ${paymentMethodColors[payment.method]}`}
                  >
                    {paymentMethodLabels[payment.method]}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {dateToHumanReadable(payment.date)}
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
