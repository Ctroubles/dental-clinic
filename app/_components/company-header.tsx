import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/app/_components/ui/sidebar"

export function CompanyHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center"
        >
          <div className="bg-gradient-to-tr from-orange-500 via-pink-500 to-red-500 text-white flex aspect-square size-8 items-center justify-center rounded-full font-bold text-lg">
            R
          </div>
          <div className="flex justify-center flex-col gap-0.5 leading-none">
            <span className="font-extrabold text-lg leading-none drop-shadow-md pt-1 mb-0.5">
              Risaris
            </span>
            <span className="text-xs leading-none text-muted-foreground">
              Panel de Administración
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
