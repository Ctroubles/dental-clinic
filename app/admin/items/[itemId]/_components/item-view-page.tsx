"use client"

import { notFound } from "next/navigation"
import FormCardSkeleton from "~/app/_components/form-card-skeleton"
import { useGetItemById } from "@/features/items/hooks"
import ItemForm from "./item-form"

type TItemViewPageProps = {
  itemId: string
}

export default function ItemViewPage({ itemId }: TItemViewPageProps) {
  let pageTitle = "Agregar nuevo servicio/producto"

  const { data: itemData = null, isLoading } = useGetItemById(itemId)

  if (itemId !== "nuevo") {
    pageTitle = "Editar servicio/producto"

    if (!isLoading && !itemData) {
      notFound()
    }
  }

  if (isLoading) {
    return <FormCardSkeleton />
  }

  return <ItemForm initialData={itemData} pageTitle={pageTitle} />
}
