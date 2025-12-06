"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useQrScanner } from "hooks/use-qr-scanner"
import {
  type CameraDevice,
  type Html5QrcodeCameraScanConfig,
  type Html5Qrcode as Html5QrcodeClass,
  Html5QrcodeFullConfig,
  type Html5QrcodeResult,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode"
import { Html5Qrcode as Html5QrcodeLib } from "html5-qrcode"
import {
  AlertTriangle,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Trash,
  X,
  XCircle,
} from "lucide-react"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CreditCard,
  Phone,
  User,
} from "lucide-react"
import { RefreshCw } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

const qrcodeRegionId = "HTML5QRCODE_SCAN_REGION"

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

const libConfig: Html5QrcodeFullConfig = {
  formatsToSupport: [
    Html5QrcodeSupportedFormats.QR_CODE,
    Html5QrcodeSupportedFormats.CODABAR,
  ],
  useBarCodeDetectorIfSupported: true,
  experimentalFeatures: {
    useBarCodeDetectorIfSupported: true,
  },
  verbose: true,
}

const cameraScanConfig: Html5QrcodeCameraScanConfig = {
  fps: 10,
  qrbox: 250,
  aspectRatio: 1.0,
}

interface QrScannerInitializerProps {
  fps?: number
  qrbox?: number
  aspectRatio?: number
  qrCodeSuccessCallback: (
    decodedText: string,
    decodedResult: Html5QrcodeResult
  ) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  qrCodeErrorCallback?: (errorMessage: string, error: any) => void
  onScannerReady: () => void
}

export const QrScanner = ({
  qrCodeSuccessCallback,
  onScannerReady,
}: QrScannerInitializerProps) => {
  const {
    status,
    errorMessage,
    data,
    handleRestart,
    handlePause,
    handleResume,
    handleClearData,
    handleDestroy,
  } = useQrScanner({
    qrcodeElementId: qrcodeRegionId,
    libConfig,
    cameraScanConfig,
  })

  useEffect(() => {
    console.log(`useEffect status -> ${status}`)
    if (status === "scanning") {
      onScannerReady?.()
    }
  }, [status, onScannerReady])

  if (status === "error") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
        <AlertTriangle className="h-10 w-10 mb-3" />
        <p className="text-center font-semibold">Error del Escáner</p>
        <p className="text-center text-sm mt-1">{errorMessage}</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      {status === "initializing" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="">Cargando escáner...</p>
        </div>
      )}

      {status === "scanned" ? (
        <ClientValidationResult
          client={data as ClientData["client"]}
          isLoading={false}
          handleRegisterEntry={() => {}}
        />
      ) : (
        <div
          id={qrcodeRegionId}
          className="w-[300px] h-[300px] flex items-center justify-center rounded-lg overflow-hidden"
        />
      )}

      <footer className="pt-5">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePause}>
            <Pause className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleResume}>
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleClearData}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDestroy}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  )
}

const ClientValidationResult = ({
  client,
  isLoading,
  handleRegisterEntry,
}: {
  client: ClientData["client"] | null
  isLoading: boolean
  handleRegisterEntry: () => void
}) => {
  const handleBuySubscription = () => {
    // TODO: Implement subscription purchase flow
    console.log("Redirecting to subscription purchase for client:", client?.id)
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

  // if (!clientData?.isValid || !clientData?.client) {
  if (!client) {
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

  const subscription = {
    isActive: true,
    expiresAt: "2024-02-15",
    planName: "Plan Premium",
    status: "active" as "active" | "expired",
  }

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
