import Link from "next/link"
import { Plus } from "lucide-react"
import PageContainer from "~/app/_components/layout/page-container"
import { Button } from "~/app/_components/ui/button"
import DoctorListingPage from "~/app/admin/doctores/_components/doctor-listing"

export default function DoctorsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Doctores</h1>
            <p className="text-muted-foreground">
              Gestiona la información de los doctores
            </p>
          </div>
          <Link href="/admin/doctores/nuevo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Doctor
            </Button>
          </Link>
        </div>
        <DoctorListingPage />
      </div>
    </PageContainer>
  )
}
