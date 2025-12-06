import { z } from "zod"

export const genderEnum = z.enum(["M", "F"], {
  errorMap: () => ({
    message: "El género debe ser M o F",
  }),
})

export type Gender = z.infer<typeof genderEnum>
