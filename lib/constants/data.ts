import { NavItem } from "types"

export type Product = {
  photo_url: string
  name: string
  description: string
  created_at: string
  price: number
  id: number
  category: string
  updated_at: string
}

export const navItems: NavItem[] = [
  {
    title: "Inicio",
    url: "/admin/inicio",
    icon: "dashboard",
    shortcut: ["i", "i"],
    isActive: false,
    items: [],
  },
  {
    title: "Visitas",
    url: "/admin/visitas",
    icon: "calendar",
    shortcut: ["v", "v"],
    isActive: false,
    items: [],
  },
  {
    title: "Cargos Registrados",
    url: "/admin/cargos",
    icon: "clipboard",
    shortcut: ["c", "c"],
    isActive: false,
    items: [],
  },
  {
    title: "Pagos Registrados",
    url: "/admin/pagos",
    icon: "cash",
    shortcut: ["$", "$"],
    isActive: false,
    items: [],
  },
  {
    title: "Pacientes",
    url: "/admin/pacientes",
    icon: "user",
    shortcut: ["p", "p"],
    isActive: false,
    items: [],
  },
  {
    title: "Doctores",
    url: "/admin/doctores",
    icon: "doctor",
    shortcut: ["d", "d"],
    isActive: false,
    items: [],
  },
  {
    title: "Servicios y Productos",
    url: "/admin/items",
    icon: "product",
    shortcut: ["s", "s"],
    isActive: false,
    items: [],
  },
  {
    title: "Ubicaciones",
    url: "/admin/ubicaciones",
    icon: "mapPin",
    shortcut: ["u", "u"],
    isActive: false,
    items: [],
  },
  // {
  //   title: 'Suscripciones',
  //   url: '/admin/suscripciones',
  //   icon: 'billing',
  //   shortcut: ['s', 's'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Productos',
  //   url: '/admin/productos',
  //   icon: 'product',
  //   shortcut: ['p', 'p'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Tablero',
  //   url: '/admin/tablero',
  //   icon: 'kanban',
  //   shortcut: ['t', 't'],
  //   isActive: false,
  //   items: []
  // },
  // {
  //   title: 'Cuenta',
  //   url: '#',
  //   icon: 'billing',
  //   isActive: true,
  //   items: [
  //     {
  //       title: 'Perfil',
  //       url: '/admin/perfil',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     // {
  //     //   title: 'Iniciar sesión',
  //     //   shortcut: ['l', 'l'],
  //     //   url: '/auth/sign-in',
  //     //   icon: 'login'
  //     // }
  //   ]
  // },
]

export interface SaleUser {
  id: number
  name: string
  email: string
  amount: string
  image: string
  initials: string
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    image: "https://api.slingacademy.com/public/sample-users/1.png",
    initials: "OM",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    image: "https://api.slingacademy.com/public/sample-users/2.png",
    initials: "JL",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    image: "https://api.slingacademy.com/public/sample-users/3.png",
    initials: "IN",
  },
  {
    id: 4,
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    image: "https://api.slingacademy.com/public/sample-users/4.png",
    initials: "WK",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    image: "https://api.slingacademy.com/public/sample-users/5.png",
    initials: "SD",
  },
]
