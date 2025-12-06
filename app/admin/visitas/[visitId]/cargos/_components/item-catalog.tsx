"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Badge } from "~/app/_components/ui/badge"
import { Button } from "~/app/_components/ui/button"
import { Card } from "~/app/_components/ui/card"
import { Input } from "~/app/_components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "~/app/_components/ui/tabs"
import { useVisitStore } from "@/features/cargos/hooks/use-visit-store"
import { useGetItems } from "@/features/items/hooks/api/queries"
import { Item } from "@/domain/entities"
import { ItemQuantityDialog } from "./item-quantity-dialog"

export function ItemsCatalog({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: "services" | "products"
  setSelectedTab: (tab: "services" | "products") => void
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showQuantityDialog, setShowQuantityDialog] = useState(false)
  const { addCharge } = useVisitStore()

  const { data: itemsData } = useGetItems({
    pageSize: 100,
    page: 1,
  })

  const filteredItems = useMemo(() => {
    if (!itemsData) return []
    return itemsData?.records.filter(item => {
      const matchesType =
        item.type === (selectedTab === "services" ? "service" : "product")
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch && item.isActive
    })
  }, [selectedTab, searchQuery, itemsData])

  const handleAddItem = (item: Item) => {
    if (item.type === "product") {
      setSelectedItem(item)
      setShowQuantityDialog(true)
    } else {
      addCharge({
        mode: "new",
        itemId: item.id,
        type: item.type,
        description: item.name,
        quantity: 1,
        totalPrice: item.defaultPrice,
        paidAmount: 0,
        paidNow: 0,
        progressStatus: "inProgress",
        id: crypto.randomUUID(),
      })
    }
  }

  const handleConfirmQuantity = (quantity: number) => {
    if (selectedItem) {
      addCharge({
        mode: "new",
        itemId: selectedItem.id,
        type: selectedItem.type,
        description: selectedItem.name,
        quantity,
        totalPrice: selectedItem.defaultPrice * quantity,
        progressStatus: "completed",
        id: crypto.randomUUID(),
        paidAmount: 0,
        paidNow: 0,
      })
      setShowQuantityDialog(false)
      setSelectedItem(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4 text-foreground">
          Catálogo de Items
        </h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={v => setSelectedTab(v as "services" | "products")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No se encontraron items
          </div>
        ) : (
          filteredItems.map(item => (
            <Card
              key={item.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {item.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.description || "--"}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    S/. {item.defaultPrice.toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddItem(item)}
                  className="whitespace-nowrap"
                >
                  Agregar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <ItemQuantityDialog
        open={showQuantityDialog}
        onOpenChange={setShowQuantityDialog}
        onConfirm={handleConfirmQuantity}
        itemName={selectedItem?.name}
      />
    </div>
  )
}
