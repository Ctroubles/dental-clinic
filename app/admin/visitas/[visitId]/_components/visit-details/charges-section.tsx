"use client"

// import { useRouter } from "next/navigation"
// import { ExternalLink } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
// import { Button } from "~/app/_components/ui/button"
import { Card } from "~/app/_components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/_components/ui/table"
import {
  formatPaymentStatus,
  getChargeProgressStatusLabel,
  getPaymentStatusColor,
  getProgressStatusColor,
} from "@/features/cargos"
import { Visit } from "@/domain/entities"

interface ChargesSectionProps {
  charges: Visit["charges"]
}

export function ChargesSection({ charges }: ChargesSectionProps) {
  // const getProgressStatusColor = (status: string) => {
  //   switch (status) {
  //     case "IN_PROGRESS":
  //       return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
  //     case "COMPLETED":
  //       return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
  //     case "ON_HOLD":
  //       return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
  //     case "CANCELLED":
  //       return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  //     default:
  //       return "bg-gray-100 text-gray-800"
  //   }
  // }

  const getTypeColor = (type: string) => {
    return type === "SERVICE"
      ? "bg-primary/10 text-primary dark:bg-primary/20"
      : "bg-secondary/10 text-secondary-foreground dark:bg-secondary/20"
  }

  const getTypeLabel = (type: string) => {
    return type === "SERVICE" ? "Servicio" : "Producto"
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Cargos Atendidos
      </h2>

      {charges?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No hay cargos registrados para esta visita.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-start">Monto Total</TableHead>
                <TableHead className="text-start">Pagado</TableHead>
                <TableHead className="text-start">Saldo</TableHead>
                <TableHead className="text-end">Estado Pago</TableHead>
                <TableHead className="text-end">Progreso</TableHead>
                {/* <TableHead className="w-20"></TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges?.map(charge => {
                const balance = charge.totalPrice - charge.paidAmount
                const percentage = (
                  (charge.paidAmount / charge.totalPrice) *
                  100
                ).toFixed(0)

                return (
                  <TableRow key={charge.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">
                          {charge.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {charge.id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getTypeColor(charge.type)}
                      >
                        {getTypeLabel(charge.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-start font-semibold">
                      ${charge.totalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-start">
                      <div>
                        <p className="font-semibold text-accent-foreground mb-0.5">
                          ${charge.paidAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {percentage}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-start">
                      <p
                        className={`font-semibold ${balance > 0 ? "text-orange-500" : "text-muted-foreground"}`}
                      >
                        ${balance.toLocaleString()}
                      </p>
                    </TableCell>
                    <TableCell className="text-end">
                      <Badge
                        variant="outline"
                        className={getPaymentStatusColor(charge.paymentStatus)}
                      >
                        {formatPaymentStatus(charge.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <Badge
                        variant="outline"
                        className={getProgressStatusColor(
                          charge.progressStatus
                        )}
                      >
                        {getChargeProgressStatusLabel(charge.progressStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => router.push(`/charges/${charge.id}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button> */}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  )
}
