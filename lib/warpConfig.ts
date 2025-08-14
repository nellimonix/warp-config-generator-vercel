import nacl from "tweetnacl"
import { Buffer } from "buffer"

// Import IP ranges
import {
  DISCORD_IPS,
  YOUTUBE_IPS,
  X_TWITTER_IPS,
  FACEBOOK_INSTAGRAM_IPS,
  VIBER_IPS,
  ZETFLIX_IPS,
  NNMCLUB_IPS,
  RUTRACKER_IPS,
  KINOZAL_IPS,
  COPILOT_IPS,
  CANVA_IPS,
  PATREON_IPS,
  ANIMEGO_IPS,
  JUTSU_IPS,
  YUMMYANIME_IPS,
  PORNHUB_IPS,
  XVIDEOS_IPS,
  PORNOLAB_IPS,
  FICBOOK_IPS,
  PROTON_IPS
} from "./ipRanges"

// Простая генерация QR кода через внешний сервис
async function generateQRCode(text: string) {
  try {
    const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WarpGenerator/1.0)'
      }
    })
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const base64 = btoa(binary)
      return `data:image/png;base64,${base64}`
    }
  } catch (error) {
    console.log("QR generation via API failed:", error.message)
  }
  
  // Fallback SVG QR code placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" style="border: 1px solid #ccc;">
    <rect width="200" height="200" fill="white"/>
    <!-- Sad face outline -->
    <circle cx="100" cy="100" r="70" fill="none" stroke="black" stroke-width="2"/>
    <!-- Left eye -->
    <circle cx="80" cy="85" r="5" fill="none" stroke="black" stroke-width="2"/>
    <!-- Right eye -->
    <circle cx="120" cy="85" r="5" fill="none" stroke="black" stroke-width="2"/>
    <!-- Sad mouth -->
    <path d="M 75 125 Q 100 110 125 125" fill="none" stroke="black" stroke-width="2"/>
    <text x="100" y="180" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">QR код недоступен</text>
  </svg>`
  
  return `data:image/svg+xml;base64,${btoa(svg)}`
}


function generateKeys() {
  const keyPair = nacl.box.keyPair()
  return {
    privKey: Buffer.from(keyPair.secretKey).toString("base64"),
    pubKey: Buffer.from(keyPair.publicKey).toString("base64"),
  }
}

async function apiRequest(method: string, endpoint: string, body: any = null, token: string | null = null) {
  const headers: HeadersInit = {
    "User-Agent": "",
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`https://api.cloudflareclient.com/v0i1909051800/${endpoint}`, options)
  return response.json()
}

async function generateWarpConfig(
  selectedServices: string[],
  siteMode: "all" | "specific",
  deviceType: "computer" | "phone",
) {
  const { privKey, pubKey } = generateKeys()

  const regBody = {
    install_id: "",
    tos: new Date().toISOString(),
    key: pubKey,
    fcm_token: "",
    type: "ios",
    locale: "en_US",
  }
  const regResponse = await apiRequest("POST", "reg", regBody)

  const id = regResponse.result.id
  const token = regResponse.result.token

  const warpResponse = await apiRequest("PATCH", `reg/${id}`, { warp_enabled: true }, token)

  const peer_pub = warpResponse.result.config.peers[0].public_key
  const peer_endpoint = warpResponse.result.config.peers[0].endpoint.host
  const client_ipv4 = warpResponse.result.config.interface.addresses.v4
  const client_ipv6 = warpResponse.result.config.interface.addresses.v6

  let allowed_ips_set = new Set<string>()

  if (siteMode === "specific") {
    const ipRanges: { [key: string]: string } = {
      discord: DISCORD_IPS,
      youtube: YOUTUBE_IPS,
      twitter: X_TWITTER_IPS,
      instagram: FACEBOOK_INSTAGRAM_IPS,
      facebook: FACEBOOK_INSTAGRAM_IPS,
      viber: VIBER_IPS,
      zetflix: ZETFLIX_IPS,
      nnmclub: NNMCLUB_IPS,
      rutracker: RUTRACKER_IPS,
      kinozal: KINOZAL_IPS,
      copilot: COPILOT_IPS,
      canva: CANVA_IPS,
      patreon: PATREON_IPS,
      animego: ANIMEGO_IPS,
      jutsu: JUTSU_IPS,
      yummyanime: YUMMYANIME_IPS,
      pornhub: PORNHUB_IPS,
      xvideos: XVIDEOS_IPS,
      pornolab: PORNOLAB_IPS,
      ficbook: FICBOOK_IPS,
      proton: PROTON_IPS,
    }

    selectedServices.forEach((service) => {
      if (ipRanges[service]) {
        allowed_ips_set = new Set([...allowed_ips_set, ...ipRanges[service].split(", ")])
      }
    })
  }

  const allowed_ips = siteMode === "all" ? "0.0.0.0/0, ::/0" : Array.from(allowed_ips_set).join(", ")

  const platform_params = deviceType === "computer" ? "Jc = 4\nJmin = 40\nJmax = 70" : "Jc = 120\nJmin = 23\nJmax = 911"

  const conf = `[Interface]
PrivateKey = ${privKey}
S1 = 0
S2 = 0
${platform_params}
H1 = 1
H2 = 2
H3 = 3
H4 = 4
MTU = 1280
Address = ${client_ipv4}, ${client_ipv6}
DNS = 1.1.1.1, 2606:4700:4700::1111, 1.0.0.1, 2606:4700:4700::1001

[Peer]
PublicKey = ${peer_pub}
AllowedIPs = ${allowed_ips}
Endpoint = engage.cloudflareclient.com:500`

  return conf
}

// 188.114.99.224:1002 engage.cloudflareclient.com:500 ${peer_endpoint}

function removeMtuLine(config: string) {
  return config.replace(/^MTU = 1280\n?/gm, "")
}

export async function getWarpConfigLink(
  selectedServices: string[],
  siteMode: "all" | "specific",
  deviceType: "computer" | "phone",
) {
  try {
    const conf = await generateWarpConfig(selectedServices, siteMode, deviceType)
    const confBase64 = Buffer.from(conf).toString("base64")
    const confWithoutMtu = removeMtuLine(conf)
    const qrCodeBase64 = await generateQRCode(confWithoutMtu)
    return {
      configBase64: confBase64,
      qrCodeBase64: qrCodeBase64,
    }
  } catch (error) {
    console.error("Ошибка при генерации конфига:", error)
    return null
  }
}

