import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import PageContainer from "~/app/_components/layout/page-container"
import { buttonVariants } from "~/app/_components/ui/button"
import { Heading } from "~/app/_components/ui/heading"
import { Separator } from "~/app/_components/ui/separator"
import VisitListingPage from "~/app/admin/visitas/_components/visit-listing"
import { cn } from "~/lib/utils"

export const metadata = {
  title: "Visitas",
}

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <article className="flex flex-1 flex-col space-y-4">
        <header className="flex items-start justify-between">
          <Heading
            title="Visitas"
            description="Gestiona las visitas de pacientes"
          />
          <Link
            href="/admin/visitas/nueva"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Nueva Visita
          </Link>
        </header>
        <Separator />
        <VisitListingPage />
      </article>
    </PageContainer>
  )
}
