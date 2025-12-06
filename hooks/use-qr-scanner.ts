import { useCallback, useEffect, useRef, useState } from "react"
import {
  Html5Qrcode,
  Html5QrcodeResult,
  Html5QrcodeScannerState,
  Html5QrcodeSupportedFormats,
  // Html5QrcodeError,
  // Html5QrcodeCamera,
} from "html5-qrcode"
import { Html5QrcodeError, Html5QrcodeErrorTypes } from "html5-qrcode/esm/core"
import {
  formatScannerError,
  getDevicesCameras,
  getPreferredCamera,
  stopScanner,
} from "~/lib/helpers/html5-qrcode"

type TrackedPromise<T> = Promise<T> & {
  _status: "pending" | "fulfilled" | "rejected"
}

// 2️⃣ Helper que crea la promesa rastreada
function trackPromise<T>(promise: Promise<T>): TrackedPromise<T> {
  const tracked = promise as TrackedPromise<T>
  tracked._status = "pending"

  promise.then(
    () => {
      tracked._status = "fulfilled"
    },
    () => {
      tracked._status = "rejected"
    }
  )

  return tracked
}

type ScannerStatus =
  | "idle"
  | "initializing"
  | "scanning"
  | "error"
  | "scanned"
  | "paused"

interface UseQrScannerProps {
  qrcodeElementId: string
  libConfig?: ConstructorParameters<typeof Html5Qrcode>[1]
  cameraScanConfig: Parameters<Html5Qrcode["start"]>[1]
}

export function useQrScanner({
  qrcodeElementId,
  libConfig,
  cameraScanConfig,
}: UseQrScannerProps) {
  const qrScannerRef = useRef<Html5Qrcode | null>(null)
  const [currentStatus, setCurrentStatus] = useState<ScannerStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const _startScannerPromise = useRef<TrackedPromise<void> | null>(null)

  const [data, setData] = useState<object | null>(null)

  // / beta
  const [restartTrigger, setRestartTrigger] = useState(false)
  const [pauseTrigger, setPauseTrigger] = useState(0)
  const [resumeTrigger, setResumeTrigger] = useState(0)
  const [clearDataTrigger, setClearDataTrigger] = useState(0)

  useEffect(() => {
    const regionEl = document.getElementById(qrcodeElementId)
    if (!regionEl) {
      setCurrentStatus("error")
      setErrorMessage(
        "Error de configuración: Elemento del escáner no encontrado."
      )
      return
    }
    let mounted = true

    setCurrentStatus("initializing")

    const newScanner = new Html5Qrcode(qrcodeElementId, libConfig)

    async function startScanner(newScanner: Html5Qrcode) {
      if (!mounted) return
      qrScannerRef.current = newScanner

      const qrCodeSuccessCallback = (
        decodedText: string,
        decodedResult: Html5QrcodeResult
      ) => {
        if (!mounted) return
        console.log("[qrCodeSuccessCallback]", decodedText, decodedResult)
        stopScanner(newScanner)
        try {
          const data = JSON.parse(decodedText)
          setData(data)
          setCurrentStatus("scanned")
        } catch (err) {
          console.error("[qrCodeSuccessCallback] Error parsing data", err)
          setCurrentStatus("error")
          setErrorMessage("Error al procesar el código QR")
        }
      }
      const qrCodeErrorCallback = (
        errorMessage: string,
        error: Html5QrcodeError | Error
      ) => {
        if (!mounted) return
        // console.log('[qrCodeErrorCallback]', errorMessage, error)
        // const errMsg = formatScannerError(errorMessage, error)
        // setErrorMessage(errMsg)
        // setCurrentStatus("error")
      }
      const onScannerReady = () => {
        if (!mounted) return
        setCurrentStatus("scanning")
      }

      try {
        const cameras = await getDevicesCameras()
        const preferredCamera = getPreferredCamera(cameras)

        await newScanner.start(
          preferredCamera.id,
          cameraScanConfig,
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        )
        if (!mounted) return

        setCurrentStatus("scanning")
        onScannerReady?.()
      } catch (err: unknown) {
        if (!mounted) return
        console.log(
          `[startScanner].catch -> ${  JSON.stringify(err ?? '["no error"]')}`
        )

        // qrCodeErrorCallback(err as string, err as Error)
        const errMsg = formatScannerError(err as string, err as Error)
        setErrorMessage(errMsg)
        setCurrentStatus("error")
      }
    }

    const _tracked: TrackedPromise<void> = trackPromise(
      startScanner(newScanner)
    )
    _startScannerPromise.current = _tracked

    return () => {
      mounted = false
      const oldScanner = newScanner
      if (!oldScanner) return

      stopScanner(oldScanner).finally(() => {
        // stopScanner won't stop the scanner if it's not scanning, so we need to check if the previous scanner Promise was not resolved yet, and if so, wait for it to be resolved and then stop it
        if (_tracked?._status === "pending") {
          console.log(
            "the previous scanner is still pending, waiting for it to be resolved"
          )
          _tracked.finally(() => {
            console.log("the previous scanner is resolved, trying to stop it")
            stopScanner(oldScanner)
          })
        }
      })
    }
  }, [qrcodeElementId, libConfig, cameraScanConfig, restartTrigger])

  const handleRestart = useCallback(async () => {
    console.log("[handleRestart] Reiniciando scanner...")

    setData(null)
    setErrorMessage(null)
    setCurrentStatus("initializing")

    // Si hay un scanner activo, detenerlo primero
    if (qrScannerRef.current) {
      try {
        await stopScanner(qrScannerRef.current)
      } catch (err) {
        console.warn("[handleRestart] Error al detener scanner:", err)
      }
    }

    setRestartTrigger(prev => !prev)
  }, [])

  const handlePause = useCallback(async () => {
    if (!qrScannerRef.current) return
    const currentScannerState = qrScannerRef.current.getState()
    console.log("[handlePause] currentScannerState", currentScannerState)
    if (currentScannerState === Html5QrcodeScannerState.SCANNING) {
      try {
        await qrScannerRef.current.pause()
        setCurrentStatus("paused")
      } catch (err) {
        console.error("[handlePause] Error al pausar:", err)
      }
    }
  }, [currentStatus])

  const handleResume = useCallback(async () => {
    if (!qrScannerRef.current) return
    const currentScannerState = qrScannerRef.current.getState()
    console.log("[handleResume] currentScannerState", currentScannerState)
    if (currentScannerState === Html5QrcodeScannerState.PAUSED) {
      try {
        await qrScannerRef.current.resume()
        setCurrentStatus("scanning")
      } catch (err) {
        console.error("[handleResume] Error al reanudar:", err)
        setCurrentStatus("error")
        setErrorMessage("Error al reanudar el scanner")
      }
    }
  }, [currentStatus])

  const handleClearData = useCallback(() => {
    setData(null)
    setErrorMessage(null)
    if (currentStatus === "scanned") {
      setCurrentStatus("scanning")
    }
  }, [currentStatus])

  const handleDestroy = useCallback(() => {
    if (qrScannerRef.current) {
      console.log("[handleDestroy] destroying scanner")
      stopScanner(qrScannerRef.current)
    }
    setCurrentStatus("idle")
    setErrorMessage(null)
  }, [])

  return {
    status: currentStatus,
    errorMessage,
    qrScannerRef,
    data,
    handleRestart,
    handlePause,
    handleResume,
    handleClearData,
    handleDestroy,
  }
}
