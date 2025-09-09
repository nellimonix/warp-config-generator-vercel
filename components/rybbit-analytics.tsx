"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

export default function AnalyticsLoader() {
  const [siteId, setSiteId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const hostname = window.location.hostname
    if (hostname === "warp.llimonix.dev") setSiteId("1")
    else if (hostname === "getwarp.netlify.app") setSiteId("2")
    else if (hostname === "getwarp.pages.dev") setSiteId("3")
    else if (hostname === "warply.vercel.app") setSiteId("4")
    else setSiteId(null) // аналитику не добавляем

  }, [])

  if (!siteId) return null

  return (
    <Script
      src="https://anltcs.llimonix.dev/api/script.js"
      data-site-id={siteId}
      strategy="afterInteractive"
    />
  )
}
