import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { Visit } from "@/domain/entities"
import { ChargeProgressStatus, ItemType } from "@/domain/enums"

export const MOCK_DOCTORS = [
  { id: "doctor-1", name: "Dr. Carlos López" },
  { id: "doctor-2", name: "Dra. María García" },
  { id: "doctor-3", name: "Dr. Juan Rodríguez" },
]

export const MOCK_PATIENTS = [
  { id: "patient-1", name: "Juan Pérez" },
  { id: "patient-3", name: "Carlos Martínez" },
  { id: "patient-4", name: "Ana López" },
  { id: "patient-5", name: "Roberto García" },
  { id: "patient-6", name: "Sofía Rodríguez" },
]

export interface Charge {
  id: string
  mode: "new" | "existing"
  itemId?: string
  trackedChargeId?: string
  type: ItemType
  description: string
  quantity: number | null
  totalPrice: number
  paidAmount: number
  paidNow: number | null
  progressStatus: ChargeProgressStatus
  notes?: string
}

interface VisitStore {
  visit: Visit | null
  charges: Charge[]
  setVisit: (visit: Partial<Visit>) => void
  addCharge: (charge: Charge) => void
  updateCharge: (chargeId: string, updates: Partial<Charge>) => void
  removeCharge: (chargeId: string) => void
  duplicateCharge: (chargeId: string) => void
  initializeVisit: (visit: Visit) => void
  autoCalculatePaymentsToday: (totalPaidAmount: number) => void
}

export const useVisitStore = create<VisitStore>(set => ({
  visit: null,
  charges: [],

  setVisit: updates =>
    set(state => ({
      visit: state.visit ? { ...state.visit, ...updates } : null,
    })),

  addCharge: charge =>
    set(state => ({
      charges: [
        ...state.charges,
        {
          ...charge,
          paidNow: 0,
        },
      ],
    })),

  updateCharge: (chargeId, updates) =>
    set(state => ({
      charges: state.charges.map(c =>
        c.id === chargeId ? { ...c, ...updates } : c
      ),
    })),

  removeCharge: chargeId =>
    set(state => ({
      charges: state.charges.filter(c => c.id !== chargeId),
    })),

  duplicateCharge: chargeId =>
    set(state => {
      const charge = state.charges.find(c => c.id === chargeId)
      if (!charge) return state
      return {
        charges: [
          ...state.charges,
          {
            ...charge,
            id: uuidv4(),
          },
        ],
      }
    }),

  autoCalculatePaymentsToday: (totalPaidAmount: number) => {
    let remainingTodayPayment = Math.max(0, totalPaidAmount)

    set(state => ({
      charges: state.charges.map(charge => {
        const chargePendingAmount = charge.totalPrice - charge.paidAmount
        let chargePaidNow = 0

        if (
          remainingTodayPayment > 0 &&
          remainingTodayPayment >= chargePendingAmount
        ) {
          chargePaidNow = chargePendingAmount
          remainingTodayPayment -= chargePendingAmount
        } else if (remainingTodayPayment > 0) {
          chargePaidNow = remainingTodayPayment
          remainingTodayPayment = 0
        }

        return {
          ...charge,
          paidNow: chargePaidNow,
        }
      }),
    }))
  },

  initializeVisit: (visit: Visit) => set({ visit, charges: [] }),
}))
