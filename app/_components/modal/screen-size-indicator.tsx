"use client"

import { useEffect, useState } from "react"

type ScreenSizeIndicatorProps = {
  enabled: string | undefined
}

export default function ScreenSizeIndicator({
  enabled,
}: ScreenSizeIndicatorProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (enabled !== "true") return

    function updateDimensions() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()

    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [enabled])

  if (enabled !== "true") {
    return null
  }

  const { width, height } = dimensions

  return (
    <div className="fixed right-20 bottom-4 z-50 flex space-x-2 rounded-full bg-foreground px-2.5 py-1 font-mono text-background text-xs">
      <span className="sm:hidden">XS</span>
      <span className="hidden sm:inline md:hidden">SM</span>
      <span className="hidden md:inline lg:hidden">MD</span>
      <span className="hidden lg:inline xl:hidden">LG</span>
      <span className="hidden xl:inline 2xl:hidden">XL</span>
      <span className="hidden 2xl:inline">2XL</span>

      <div className="h-4 w-px bg-border" />

      <span>
        {width.toLocaleString()} x {height.toLocaleString()} px
      </span>

      <div className="h-4 w-px bg-border" />

      <span>Dev</span>
    </div>
  )
}
