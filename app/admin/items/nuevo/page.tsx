import { Suspense } from "react"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"
import ItemViewPage from "~/app/admin/items/[itemId]/_components/item-view-page"

export const metadata = {
  title: "Nuevo Servicio/Producto",
}

export default function Page() {
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          <ItemViewPage itemId={"nuevo"} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
