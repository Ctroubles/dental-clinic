import {
  CameraDevice,
  Html5Qrcode,
  Html5QrcodeScannerState,
} from "html5-qrcode"
import { Html5QrcodeError, Html5QrcodeErrorTypes } from "html5-qrcode/esm/core"

/**
 * Gets the list of available cameras on the device.
 * @returns {Promise<CameraDevice[]>} List of camera devices.
 */
export const getDevicesCameras = async () => {
  const devices = await Html5Qrcode.getCameras()
  return devices
}

/**
 * Returns the user's preferred camera. Currently selects the back camera if available.
 * @param {CameraDevice[]} cameras - List of detected cameras.
 * @returns {CameraDevice} Preferred camera.
 * @throws {Error} If no cameras are found.
 */
export const getPreferredCamera = (cameras: CameraDevice[]): CameraDevice => {
  if (!cameras.length) {
    throw new Error("No cameras found")
  }

  // TODO: Implement logic to get the preferred camera based on local storage

  const backCamera = cameras.find(camera => camera.label.includes("back"))
  return backCamera ?? cameras[0]
}

/**
 * Formats QR scanner error messages to display user-friendly messages.
 * @param {string} errorMessage - Original error message.
 * @param {Html5QrcodeError | Error} error - Received error object.
 * @returns {string} Formatted error message for the user.
 */
export const formatScannerError = (
  errorMessage: string,
  error: Html5QrcodeError | Error
) => {
  if (isQrcodeError(error)) {
    if (error.type === Html5QrcodeErrorTypes.IMPLEMENTATION_ERROR) {
      return "Error al iniciar cámara. Por favor, actualiza la página."
    }
    if (error.type === Html5QrcodeErrorTypes.NO_CODE_FOUND_ERROR) {
      return "No se encontró código QR. Por favor, intenta nuevamente."
    }
    if (error.type === Html5QrcodeErrorTypes.UNKWOWN_ERROR) {
      return "Hubo un error al iniciar el escáner. Por favor, intenta recargar la página."
    }
    return `Error desconocido al iniciar cámara: ${errorMessage ?? error.errorMessage}. Por favor, intenta recargar la página o contacta al soporte.`
  }
  return `Error al iniciar cámara: ${error?.message ?? errorMessage ?? error}`
}

/**
 * Stops the QR scanner and clears used resources.
 * @param {Html5Qrcode} scanner - QR scanner instance.
 * @param {boolean} [clearIfNotScanning=true] - Whether to clear even if not scanning. True by default.
 * @returns {Promise<void>}
 */
export const stopScanner = async (
  scanner: Html5Qrcode,
  clearIfNotScanning: boolean = true
) => {
  console.log("[stopScanner] stopping scanner")
  const scannerState = scanner.getState()
  if (scannerState === Html5QrcodeScannerState.SCANNING) {
    try {
      await scanner.stop()
    } catch (error) {
      console.log(`[stopScanner] error -> ${JSON.stringify(error)}`)
    } finally {
      scanner.clear()
    }
  } else if (clearIfNotScanning) {
    scanner.clear()
  }
}

/**
 * Checks if the received error is a specific Html5Qrcode error.
 * @param {any} err - Error object to check.
 * @returns {boolean} True if it is a Html5QrcodeError, false otherwise.
 */
export const isQrcodeError = (err: unknown): err is Html5QrcodeError =>
  typeof err === "object" &&
  err !== null &&
  "type" in err &&
  typeof (err as { type: string }).type === "string"
