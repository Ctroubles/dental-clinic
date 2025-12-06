import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card"

const newPatientsData = [
  {
    name: "Carlos Mendoza",
    whatsapp: "+51 987 654 321",
    avatar: "https://api.slingacademy.com/public/sample-users/1.png",
    fallback: "CM",
    subscriptionDuration: "3 meses",
    joinDate: "Hace 2 días",
  },
  {
    name: "Lucía Estefanía Torres",
    whatsapp: "+51 912 345 678",
    avatar: "https://api.slingacademy.com/public/sample-users/2.png",
    fallback: "MT",
    subscriptionDuration: "1 mes",
    joinDate: "Hace 3 días",
  },
  {
    name: "Juan Pablo Ríos",
    whatsapp: "+51 998 765 432",
    avatar: "https://api.slingacademy.com/public/sample-users/3.png",
    fallback: "JR",
    subscriptionDuration: "6 meses",
    joinDate: "Hace 4 días",
  },
  {
    name: "Ana Lucía Vargas",
    whatsapp: "+51 977 123 456",
    avatar: "https://api.slingacademy.com/public/sample-users/5.png",
    fallback: "AV",
    subscriptionDuration: "2 meses",
    joinDate: "Hace 5 días",
  },
  {
    name: "Diego Alejandro Soto",
    whatsapp: "+51 966 789 012",
    avatar: "https://api.slingacademy.com/public/sample-users/5.png",
    fallback: "DS",
    subscriptionDuration: "1 mes",
    joinDate: "Hace 6 días",
  },
]

export function RecentSales() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Nuevos Pacientes</CardTitle>
        <CardDescription>
          Se han registrado 25 nuevos pacientes este mes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {newPatientsData.map((patient, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={patient.avatar} alt="Avatar" />
                <AvatarFallback>{patient.fallback}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm leading-none font-medium">
                  {patient.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {patient.whatsapp}
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {patient.subscriptionDuration}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {patient.joinDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
