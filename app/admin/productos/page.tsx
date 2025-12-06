import { Suspense } from "react"
import Link from "next/link"
import { IconPlus } from "@tabler/icons-react"
import { SearchParams } from "nuqs/server"
// import ProductListingPage from "~/app/_components/components/product-listing"
import PageContainer from "~/app/_components/layout/page-container"
import { buttonVariants } from "~/app/_components/ui/button"
import { Heading } from "~/app/_components/ui/heading"
import { Separator } from "~/app/_components/ui/separator"
import { DataTableSkeleton } from "~/app/_components/ui/table/data-table-skeleton"
import { searchParamsCache, serialize } from "~/lib/searchparams"
import { cn } from "~/lib/utils"

export const metadata = {
  title: "Admin: Productos",
}

type pageProps = {
  searchParams: Promise<SearchParams>
}

export default async function Page(props: pageProps) {
  const searchParams = await props.searchParams
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams)

  // This key is used for invoke suspense if any of the search params changed (used for filters).
  // const key = serialize({ ...searchParams });

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Productos"
            description="Gestiona los productos del centro."
          />
          <Link
            href="/admin/productos/nuevo"
            className={cn(buttonVariants(), "text-xs md:text-sm")}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Link>
        </div>
        <Separator />
        <Suspense
          // key={key}
          fallback={
            <DataTableSkeleton columnCount={5} rowCount={8} filterCount={2} />
          }
        >
          {/* <ProductListingPage /> */}
        </Suspense>
      </div>
    </PageContainer>
  )
}
