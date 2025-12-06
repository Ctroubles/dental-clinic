"use client"

import { type ReactNode, useCallback, useRef, useState } from "react"
import type { Html5QrcodeResult } from "html5-qrcode"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  CreditCard,
  Phone,
  QrCode,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Separator } from "../ui/separator"
import { QrScanner } from "./qr-scanner-initializer"

interface ClientInfo {
  id: string
  dni: string
  firstName: string
  lastName: string
  phone: string
  isValidCCCode: boolean
}

interface Subscription {
  isActive: boolean
  expiresAt: string
  planName: string
  status: "active" | "expired" | "none"
}

interface ClientData {
  client: ClientInfo | null
  subscription: Subscription | null
  isValid: boolean
}

const clientDataMock: ClientData = {
  client: {
    id: "12345678",
    dni: "12345678",
    firstName: "Juan",
    lastName: "Pérez",
    phone: "+1234567890",
    isValidCCCode: true,
  },
  subscription: {
    isActive: true,
    expiresAt: "2024-02-15",
    planName: "Plan Premium",
    status: "active" as const,
  },
  isValid: true,
}

const fetchClientData = async (clientId: string): Promise<ClientData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Mock different scenarios
  const scenarios = [
    // Valid client with active subscription
    {
      client: {
        id: clientId,
        dni: "12345678",
        firstName: "Juan",
        lastName: "Pérez",
        phone: "+1234567890",
        isValidCCCode: true,
      },
      subscription: {
        isActive: true,
        expiresAt: "2024-02-15",
        planName: "Plan Premium",
        status: "active" as const,
      },
      isValid: true,
    },
    // Valid client with expired subscription
    {
      client: {
        id: clientId,
        dni: "87654321",
        firstName: "María",
        lastName: "González",
        phone: "+0987654321",
        isValidCCCode: true,
      },
      subscription: {
        isActive: false,
        expiresAt: "2023-12-01",
        planName: "Plan Básico",
        status: "expired" as const,
      },
      isValid: true,
    },
    // Invalid client
    {
      client: null,
      subscription: null,
      isValid: false,
    },
  ]

  // Return random scenario for demo
  return scenarios[Math.floor(Math.random() * scenarios.length)]
}

export function CheckInModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  className?: string
  children: ReactNode
}) {
  // const [scannedCode, setScannedCode] = useState<string | null>(null)
  const [isScannerVisible, setIsScannerVisible] = useState<boolean>(true)
  const [isScannerReady, setIsScannerReady] = useState<boolean>(false)
  const [clientData, setClientData] = useState<ClientData | null>(
    clientDataMock
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const scanProcessedRef = useRef<boolean>(false)

  // Mock function to simulate backend request

  const onNewScanResult = useCallback(
    async (decodedText: string, decodedResult: Html5QrcodeResult) => {
      if (scanProcessedRef.current) {
        console.log(
          "[CheckinPage] Escaneo ya procesado, ignorando llamada adicional."
        )
        return
      }

      scanProcessedRef.current = true
      console.log("[CheckinPage] Nuevo resultado de escaneo:", decodedText)

      // setScannedCode(decodedText)
      setIsScannerVisible(false)
      setIsScannerReady(false)
      setIsLoading(true)

      try {
        // Parse QR payload to extract ID
        const qrPayload = JSON.parse(decodedText)
        const clientId = qrPayload.id

        if (!clientId) {
          throw new Error("ID no encontrado en el código QR")
        }

        // Fetch client data from backend (mocked)
        const data = await fetchClientData(clientId)
        setClientData(data)
      } catch (error) {
        console.error("Error processing QR code:", error)
        setClientData({
          client: null,
          subscription: null,
          isValid: false,
        })
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // const onScanErrorFromPlugin = useCallback((errorMessage: string, scanErrorObj: any) => {
  //   if (
  //     scanErrorObj &&
  //     (scanErrorObj.name === "NotFoundException" || scanErrorObj.message?.includes("No MultiFormat Readers found"))
  //   ) {
  //     return
  //   }
  // }, [])

  const handleScannerReady = useCallback(() => {
    console.log("[CheckinPage] El escáner está listo y la cámara activa.")
    setIsScannerReady(true)
  }, [])

  const handleScanAgain = () => {
    console.log("[CheckinPage] Preparando para escanear de nuevo.")
    scanProcessedRef.current = false
    // setScannedCode(null)
    // setScanError(null)
    setClientData(null)
    setIsLoading(false)
    setIsScannerVisible(true)
    setIsScannerReady(false)
  }

  const handleRegisterEntry = () => {
    // TODO: Implement entry registration
    console.log("Registering entry for client:", clientData?.client?.id)
    // Close modal after successful registration
    onOpenChange(false)
    // Reset state
    handleScanAgain()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col items-center justify-center h-[90dvh] w-full p-4 max-w-2xl">
        <div className="w-full h-full flex flex-col">
          <DialogHeader className="p-4 relative">
            {!isScannerVisible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleScanAgain}
                className="absolute left-0 top-0 h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-xl font-semibold text-center flex items-center justify-center">
              <QrCode className="mr-2 h-6 w-6" />
              Registrar Ingreso
            </DialogTitle>
            <DialogDescription className="text-sm text-center">
              Escanea el código QR de la entrada para registrar y validar
              ingreso del miembro.
            </DialogDescription>
          </DialogHeader>

          <div className="p-2 flex-1 flex flex-col items-center justify-center">
            {isScannerVisible ? (
              <div className="w-full max-w-md h-full flex-1 p-2">
                <QrScanner
                  qrCodeSuccessCallback={onNewScanResult}
                  onScannerReady={handleScannerReady}
                />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center flex-1">
                <ClientValidationResult
                  clientData={clientData}
                  isLoading={isLoading}
                  handleRegisterEntry={handleRegisterEntry}
                />
              </div>
            )}
          </div>

          <div className="p-4 flex flex-col items-center gap-2">
            {!isScannerVisible && (
              <Button
                onClick={handleScanAgain}
                variant="outline"
                size="sm"
                className="w-full max-w-md bg-transparent"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Volver a Escanear
              </Button>
            )}

            {isScannerVisible && (
              <p
                className={`text-xs text-center w-full ${
                  isScannerReady
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {isScannerReady
                  ? "Cámara activa. Apunte al código QR."
                  : "Preparando escáner..."}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const ClientValidationResult = ({
  clientData,
  isLoading,
  handleRegisterEntry,
}: {
  clientData: ClientData | null
  isLoading: boolean
  handleRegisterEntry: () => void
}) => {
  const handleBuySubscription = () => {
    // TODO: Implement subscription purchase flow
    console.log(
      "Redirecting to subscription purchase for client:",
      clientData?.client?.id
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Validando cliente...</h3>
          <p className="text-sm text-muted-foreground text-center">
            Verificando información del código QR
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!clientData?.isValid || !clientData?.client) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-red-700 dark:text-red-400">
            Cliente no identificado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-red-600 dark:text-red-300">
            No se pudo identificar al cliente. Es posible que el código QR no
            sea válido.
          </p>
          <p className="text-xs text-muted-foreground">
            Si crees que esto es un error, contacta a soporte técnico.
          </p>
        </CardContent>
      </Card>
    )
  }

  const { client, subscription } = clientData
  const hasActiveSubscription =
    subscription?.isActive && subscription?.status === "active"
  const hasExpiredSubscription = subscription?.status === "expired"

  if (!hasActiveSubscription) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-red-700 dark:text-red-400">
            {hasExpiredSubscription
              ? "Suscripción Expirada"
              : "Sin Suscripción Activa"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-red-600 dark:text-red-300 mb-4">
              {hasExpiredSubscription
                ? `La suscripción de ${client.firstName} ${client.lastName} está actualmente expirada.`
                : `${client.firstName} ${client.lastName} no tiene ninguna suscripción activa.`}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>
                {client.firstName} {client.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>DNI: {client.dni}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            {hasExpiredSubscription && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Expiró: {subscription?.expiresAt}</span>
              </div>
            )}
          </div>

          <Button onClick={handleBuySubscription} className="w-full" size="lg">
            Comprar Nueva Suscripción
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <CardTitle className="text-green-700 dark:text-green-400">
          Cliente Verificado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            Suscripción Activa
          </Badge>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {client.firstName} {client.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span>DNI: {client.dni}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Plan: {subscription?.planName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Vence: {subscription?.expiresAt}</span>
          </div>
        </div>

        <Button onClick={handleRegisterEntry} className="w-full" size="lg">
          Registrar Ingreso de Cliente
        </Button>
      </CardContent>
    </Card>
  )
}
