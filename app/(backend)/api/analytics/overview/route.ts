import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext(() => {
  const getAnalyticsOverviewController = getInjection(
    "IGetAnalyticsOverviewController"
  )
  return getAnalyticsOverviewController()
})
