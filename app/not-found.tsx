"use client"

import { useRouter } from "next/navigation"
import { Button } from "~/app/_components/ui/button"
import { HOME_PATH } from "~/lib/constants"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent">
        404
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        No se encontró la página
      </h2>
      <p>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => router.back()} variant="default" size="lg">
          Volver
        </Button>
        <Button
          onClick={() => router.push(HOME_PATH)}
          variant="ghost"
          size="lg"
        >
          Ir a inicio
        </Button>
      </div>
    </div>
  )
}
