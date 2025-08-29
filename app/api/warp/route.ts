import { NextResponse } from "next/server"
import { getWarpConfigLink } from "@/lib/warpConfig"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { selectedServices, siteMode, deviceType, endpoint } = body
    const content = await getWarpConfigLink(selectedServices, siteMode, deviceType, endpoint)
    if (content) {
      return NextResponse.json({ success: true, content })
    } else {
      return NextResponse.json({ success: false, message: "Не удалось сгенерировать конфиг." }, { status: 500 })
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error)
    return NextResponse.json({ success: false, message: "Произошла ошибка на сервере." }, { status: 500 })
  }
}

