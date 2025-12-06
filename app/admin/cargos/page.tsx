import PageContainer from "~/app/_components/layout/page-container"
import { Heading } from "~/app/_components/ui/heading"
import { Separator } from "~/app/_components/ui/separator"
import TrackedChargesListingPage from "~/app/admin/cargos/_components/cargo-listing"

export const metadata = {
  title: "Cargos Registrados",
}

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <article className="flex flex-1 flex-col space-y-4">
        <header className="flex items-start justify-between">
          <Heading
            title="Cargos Registrados"
            description="Visualiza todos los cargos registrados en el sistema"
          />
        </header>
        <Separator />
        <TrackedChargesListingPage />
      </article>
    </PageContainer>
  )
}
