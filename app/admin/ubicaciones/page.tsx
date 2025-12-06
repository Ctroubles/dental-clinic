import { Suspense } from "react"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import PageContainer from "~/app/_components/layout/page-container"
import { buttonVariants } from "~/app/_components/ui/button"
import { Heading } from "~/app/_components/ui/heading"
import { ScrollArea, ScrollBar } from "~/app/_components/ui/scroll-area"
import { Separator } from "~/app/_components/ui/separator"
import { DataTableSkeleton } from "~/app/_components/ui/table/data-table-skeleton"
import LocationListingPage from "~/app/admin/ubicaciones/_components/location-listing"
import { cn } from "~/lib/utils"

export const metadata = {
  title: "Ubicaciones",
}

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <header className="flex items-start justify-between">
          <Heading
            title="Ubicaciones"
            description="Gestiona las ubicaciones disponibles"
          />
          <Link
            href="/admin/ubicaciones/nuevo"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Nueva Ubicación
          </Link>
        </header>
        <Separator />

        <LocationListingPage />
      </div>
    </PageContainer>
  )
}
