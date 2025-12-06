import { Suspense } from "react"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import PageContainer from "~/app/_components/layout/page-container"
import { buttonVariants } from "~/app/_components/ui/button"
import { Heading } from "~/app/_components/ui/heading"
import { Separator } from "~/app/_components/ui/separator"
import { DataTableSkeleton } from "~/app/_components/ui/table/data-table-skeleton"
import PatientListingPage from "~/app/admin/pacientes/_components/patient-listing"
import { cn } from "~/lib/utils"

export const metadata = {
  title: "Pacientes",
}

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Pacientes" description="Gestiona los pacientes" />
          <Link
            href="/admin/pacientes/nuevo"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Nuevo Paciente
          </Link>
        </div>
        <Separator />
        <PatientListingPage />
      </div>
    </PageContainer>
  )
}
