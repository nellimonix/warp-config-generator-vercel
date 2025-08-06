import nacl from "tweetnacl"
import { Buffer } from "buffer"
import QRCode from "qrcode"

// Import IP ranges
import {
  DISCORD_IPS,
  YOUTUBE_IPS,
  TWITTER_IPS,
  INSTAGRAM_IPS,
  FACEBOOK_IPS,
  VIBER_IPS,
  TIKTOK_IPS,
  SPOTIFY_IPS,
  ZETFLIX_IPS,
  NNMCLUB_IPS,
  RUTRACKER_IPS,
  KINOZAL_IPS,
  COPILOT_IPS,
  CANVA_IPS,
  PATREON_IPS,
  ANIMEGO_IPS,
  JUTSU_IPS,
  YUMMIANIME_IPS,
  PORNHUB_IPS,
  XVIDEOS_IPS,
  PORNOLAB_IPS,
  FICBOOK_IPS,
  BESTCHANGE_IPS,
} from "./ipRanges"

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
      twitter: TWITTER_IPS,
      instagram: INSTAGRAM_IPS,
      facebook: FACEBOOK_IPS,
      viber: VIBER_IPS,
      tiktok: TIKTOK_IPS,
      spotify: SPOTIFY_IPS,
      zetflix: ZETFLIX_IPS,
      nnmclub: NNMCLUB_IPS,
      rutracker: RUTRACKER_IPS,
      kinozal: KINOZAL_IPS,
      copilot: COPILOT_IPS,
      canva: CANVA_IPS,
      patreon: PATREON_IPS,
      animego: ANIMEGO_IPS,
      jutsu: JUTSU_IPS,
      yummianime: YUMMIANIME_IPS,
      pornhub: PORNHUB_IPS,
      xvideos: XVIDEOS_IPS,
      pornolab: PORNOLAB_IPS,
      ficbook: FICBOOK_IPS,
      bestchange: BESTCHANGE_IPS,
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
Endpoint = ${peer_endpoint}`

  return conf
}

// 188.114.99.224:1002

function removeMtuLine(config: string) {
  return config.replace(/^MTU = 1280\n?/gm, "")
}

async function generateQrCode(config: string) {
  const cleanedConfig = removeMtuLine(config)
  return QRCode.toDataURL(cleanedConfig)
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
    const qrCodeBase64 = await generateQrCode(confWithoutMtu)
    return {
      configBase64: confBase64,
      qrCodeBase64: qrCodeBase64,
    }
  } catch (error) {
    console.error("Ошибка при генерации конфига:", error)
    return null
  }
}

