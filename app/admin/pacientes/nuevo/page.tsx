import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import PatientViewPage from "~/app/admin/pacientes/_components/patient-view-page"

export const metadata = {
  title: "Nuevo Paciente",
}

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <PatientViewPage patientId={"nuevo"} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
