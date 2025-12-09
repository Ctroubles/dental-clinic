import PageContainer from "~/app/_components/layout/page-container"
import { Heading } from "~/app/_components/ui/heading"
import { Separator } from "~/app/_components/ui/separator"
import PaymentsListingPage from "~/app/admin/pagos/_components/payment-listing"

export const metadata = {
  title: "Pagos Registrados",
}

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Pagos Registrados"
            description="Visualiza todos los pagos registrados en el sistema"
          />
        </div>
        <Separator />
        <PaymentsListingPage />
      </div>
    </PageContainer>
  )
}
