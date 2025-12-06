import KanbanViewPage from "~/app/_components/kanban/components/kanban-view-page"

export const metadata = {
  title: "Admin: Tablero",
}

export default async function page() {
  return <KanbanViewPage />
}
