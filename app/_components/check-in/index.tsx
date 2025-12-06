"use client"

import { useState } from "react"
import { QrCodeIcon } from "lucide-react"
import { Button } from "../ui/button"
import { CheckInModal } from "./check-in-modal"

export default function CheckIn() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <QrCodeIcon size={18} />
        <span className="text-sm font-medium hidden sm:block">Check in</span>
      </Button>
      <CheckInModal open={open} onOpenChange={setOpen}>
        <div>Check in new</div>
      </CheckInModal>
    </>
  )
}
