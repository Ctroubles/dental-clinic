import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import VisitViewPage from "~/app/admin/visitas/[visitId]/_components/visit-view-page"

type TPageProps = {
  params: Promise<{ visitId: string }>
}

export const metadata = {
  title: "Editar Visita",
}

export default async function Page({ params }: TPageProps) {
  const { visitId } = await params

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <VisitViewPage visitId={visitId} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
