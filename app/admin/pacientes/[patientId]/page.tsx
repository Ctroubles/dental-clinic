import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import MemberViewPage from "~/app/admin/pacientes/_components/patient-view-page"

export const metadata = {
  title: "Paciente: Detalle",
}

type PageProps = { params: Promise<{ patientId: string }> }

export default async function Page(props: PageProps) {
  const params = await props.params
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <MemberViewPage patientId={params.patientId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
