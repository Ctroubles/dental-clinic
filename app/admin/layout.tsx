import type { Metadata } from "next"
import { cookies } from "next/headers"
import KBar from "~/app/_components/kbar"
import AppSidebar from "~/app/_components/layout/app-sidebar"
import Header from "~/app/_components/layout/header"
import { SidebarInset, SidebarProvider } from "~/app/_components/ui/sidebar"

export const metadata: Metadata = {
  title: "Olympus Gym - Admin",
  description: "Olympus Gym - Admin",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}
