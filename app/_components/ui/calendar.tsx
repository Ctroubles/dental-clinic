"use client"

import * as React from "react"
import type { ComponentProps } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { DayPicker } from "react-day-picker"
import { buttonVariants } from "~/app/_components/ui/button"
import { cn } from "~/lib/utils"

// Custom icons that meet the DayPicker requirements
const LeftIcon = () => <ChevronLeftIcon className="size-4" />
const RightIcon = () => <ChevronRightIcon className="size-4" />

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        // eslint-disable-next-line camelcase
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        // eslint-disable-next-line camelcase
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        // eslint-disable-next-line camelcase
        nav_button_previous: "absolute left-1",
        // eslint-disable-next-line camelcase
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        // eslint-disable-next-line camelcase
        head_row: "flex",
        // eslint-disable-next-line camelcase
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        // eslint-disable-next-line camelcase
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        // eslint-disable-next-line camelcase
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        // eslint-disable-next-line camelcase
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        // eslint-disable-next-line camelcase
        day_today: "bg-accent text-accent-foreground",
        // eslint-disable-next-line camelcase
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        // eslint-disable-next-line camelcase
        day_disabled: "text-muted-foreground opacity-50",
        // eslint-disable-next-line camelcase
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        // eslint-disable-next-line camelcase
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: LeftIcon,
        IconRight: RightIcon,
      }}
      {...props}
    />
  )
}

export { Calendar }
