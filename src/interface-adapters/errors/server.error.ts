import { InterfaceAdaptersError } from "./interface-adapters.error"

export class ServerError extends InterfaceAdaptersError {
  public static get name(): string {
    return "ServerError"
  }
  public readonly name = ServerError.name

  constructor(requestId: string, options?: ErrorOptions) {
    const message = `Ha ocurrido un error interno en el servidor. Si el problema persiste, por favor, contacte a soporte con el siguiente ID de solicitud: ${requestId}`

    super(ServerError.name, message, options)
  }
}
