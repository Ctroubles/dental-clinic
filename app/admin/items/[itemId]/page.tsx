import PageContainer from "~/app/_components/layout/page-container"
import ItemViewPage from "~/app/admin/items/[itemId]/_components/item-view-page"

export const metadata = {
  title: "Servicio/Producto: Detalle",
}

type PageProps = { params: Promise<{ itemId: string }> }

export default async function Page(props: PageProps) {
  const params = await props.params
  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <ItemViewPage itemId={params.itemId} />
      </div>
    </PageContainer>
  )
}
