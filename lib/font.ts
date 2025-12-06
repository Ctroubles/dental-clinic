import {
  Geist,
  // eslint-disable-next-line camelcase
  Geist_Mono,
  // eslint-disable-next-line camelcase
  Instrument_Sans,
  Inter,
  Mulish,
  // eslint-disable-next-line camelcase
  Noto_Sans_Mono,
} from "next/font/google"
import { cn } from "~/lib/utils"

// eslint-disable-next-line new-cap
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

// eslint-disable-next-line new-cap
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

// eslint-disable-next-line new-cap
const fontInstrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
})

// eslint-disable-next-line new-cap
const fontNotoMono = Noto_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-noto-mono",
})

// eslint-disable-next-line new-cap
const fontMullish = Mulish({
  subsets: ["latin"],
  variable: "--font-mullish",
})

// eslint-disable-next-line new-cap
const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInstrument.variable,
  fontNotoMono.variable,
  fontMullish.variable,
  fontInter.variable
)
