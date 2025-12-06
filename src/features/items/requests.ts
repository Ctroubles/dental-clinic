import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetItemsUseCaseInput } from "@/application/use-cases/items/get-items.use-case"
import { Item, ItemInsert } from "@/domain/entities/item"

export async function createItem(item: ItemInsert) {
  const response = await apiFetch<Item>("items", {
    method: "POST",
    body: JSON.stringify(item),
  })
  return response
}

export async function getItems(request?: IGetItemsUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request?.filters?.search) {
    searchParams.set("search", request.filters.search)
  }
  if (request?.filters?.type) {
    searchParams.set("type", request.filters.type)
  }
  if (
    request?.filters &&
    request?.filters?.isActive !== undefined &&
    request?.filters?.isActive !== null
  ) {
    searchParams.set("isActive", request.filters.isActive.toString())
  }

  if (request?.page) {
    searchParams.set("page", request.page.toString())
  }

  if (request?.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `items?${queryString}` : "items"

  const response = await apiFetch<PageableResult<Item>>(url, {
    method: "GET",
  })
  return response
}

export async function getItemById(itemId: string) {
  const response = await apiFetch<Item>(`items/${itemId}`, {
    method: "GET",
  })
  return response
}

export async function updateItem(itemId: string, item: ItemInsert) {
  const response = await apiFetch<Item>(`items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(item),
  })
  return response
}

export async function deleteItem(itemId: string) {
  const response = await apiFetch<null>(`items/${itemId}`, {
    method: "DELETE",
  })
  return response
}

export async function toggleItemStatus(itemId: string) {
  const response = await apiFetch<Item>(`items/${itemId}/toggle-status`, {
    method: "PATCH",
  })
  return response
}
