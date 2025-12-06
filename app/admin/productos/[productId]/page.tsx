import { Suspense } from "react"
// import ProductViewPage from "~/app/_components/components/product-view-page"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import PageContainer from "~/app/_components/layout/page-container"

export const metadata = {
  title: "Dashboard : Product View",
}

type PageProps = { params: Promise<{ productId: string }> }

export default async function Page(props: PageProps) {
  const params = await props.params
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Suspense fallback={<FormCardSkeleton />}>
          {/* <ProductViewPage productId={params.productId} /> */}
        </Suspense>
      </div>
    </PageContainer>
  )
}
