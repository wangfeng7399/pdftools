"use client"

import Script from "next/script"

const ADSENSE_CLIENT_ID = "ca-pub-7294360251146049"

export function GoogleAdSense() {
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
