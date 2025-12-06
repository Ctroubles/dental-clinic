import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import DoctorViewPage from "~/app/admin/doctores/_components/doctor-view-page"

type TDoctorPageProps = {
  params: Promise<{ doctorId: string }>
}

export default async function DoctorPage({ params }: TDoctorPageProps) {
  const { doctorId } = await params

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <DoctorViewPage doctorId={doctorId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
