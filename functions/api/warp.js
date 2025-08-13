import nacl from "tweetnacl"
import { Buffer } from "buffer"
import QRCode from "qrcode"

// IP ranges
const DISCORD_IPS = "103.224.0.0/16, 104.16.0.0/12, 108.136.0.0/14, 108.156.0.0/14, 13.224.0.0/12, 13.32.0.0/12, 138.128.136.0/21, 143.204.0.0/16, 15.204.0.0/16, 162.158.0.0/15, 162.210.192.0/21, 170.178.160.0/19, 172.64.0.0/13, 18.128.0.0/9, 185.107.56.0/24, 188.114.96.0/22"
const YOUTUBE_IPS = "1.0.0.0/9, 1.192.0.0/10, 101.64.0.0/10, 103.0.0.0/14, 103.100.128.0/19, 103.101.0.0/18, 103.103.128.0/17, 103.105.0.0/16, 103.106.192.0/18, 103.107.128.0/17, 103.108.0.0/17, 103.111.128.0/17, 103.111.64.0/19"
const TWITTER_IPS = "104.16.0.0/12, 104.244.40.0/21, 146.75.0.0/16, 151.101.0.0/16, 152.192.0.0/13, 162.158.0.0/15, 172.64.0.0/13, 192.229.128.0/17, 199.232.0.0/16"
const INSTAGRAM_IPS = "102.0.0.0/8, 103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19"
const FACEBOOK_IPS = "102.0.0.0/8, 103.200.28.0/22, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19"
const VIBER_IPS = "100.24.0.0/13, 104.16.0.0/12, 104.64.0.0/10, 107.20.0.0/14, 108.136.0.0/14, 108.156.0.0/14"
const TIKTOK_IPS = "1.192.0.0/10, 101.0.0.0/11, 101.32.0.0/12, 101.64.0.0/10, 103.105.128.0/17, 103.136.0.0/16"
const SPOTIFY_IPS = "104.154.0.0/15, 104.64.0.0/10, 146.75.0.0/16, 151.101.0.0/16, 173.222.0.0/15, 18.128.0.0/9, 184.24.0.0/13, 184.50.0.0/15"
const ZETFLIX_IPS = "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22"
const NNMCLUB_IPS = "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22"
const RUTRACKER_IPS = "104.16.0.0/12, 162.158.0.0/15, 172.64.0.0/13, 185.81.128.0/23, 188.114.96.0/22"
const KINOZAL_IPS = "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22"
const COPILOT_IPS = "104.208.0.0/13, 104.40.0.0/13, 104.64.0.0/10, 13.104.0.0/14, 13.64.0.0/11, 131.253.32.0/20, 138.91.0.0/16"
const CANVA_IPS = "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22, 216.239.32.0/19"
const PATREON_IPS = "103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21"
const ANIMEGO_IPS = "185.178.208.0/22, 49.13.80.0/20"
const JUTSU_IPS = "104.16.0.0/12, 144.76.0.0/16, 172.64.0.0/13, 188.114.96.0/22"
const YUMMIANIME_IPS = "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22, 45.95.201.0/24, 50.7.0.0/16, 67.159.0.0/18"
const PORNHUB_IPS = "152.192.0.0/13, 208.99.64.0/19, 216.18.160.0/19, 64.210.128.0/19, 64.88.240.0/20, 66.254.96.0/19"
const XVIDEOS_IPS = "104.16.0.0/12, 138.199.0.0/18, 143.244.32.0/19, 156.146.32.0/19, 169.150.192.0/18, 172.64.0.0/13"
const PORNOLAB_IPS = "13.224.0.0/12, 18.128.0.0/9, 185.110.92.0/24, 185.61.148.0/23, 54.160.0.0/11"
const FICBOOK_IPS = "104.16.0.0/12, 172.64.0.0/13, 185.206.164.0/22"
const BESTCHANGE_IPS = "162.19.0.0/16, 188.124.37.0/24, 54.36.0.0/15"

async function generateWarpConfig(selectedServices, siteMode, deviceType) {
  const keyPair = nacl.box.keyPair()
  const privKey = Buffer.from(keyPair.secretKey).toString("base64")
  const pubKey = Buffer.from(keyPair.publicKey).toString("base64")

  const regBody = {
    install_id: "",
    tos: new Date().toISOString(),
    key: pubKey,
    fcm_token: "",
    type: "ios",
    locale: "en_US",
  }

  const regResponse = await fetch("https://api.cloudflareclient.com/v0i1909051800/reg", {
    method: "POST",
    headers: {
      "User-Agent": "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(regBody)
  })
  
  const regData = await regResponse.json()
  const id = regData.result.id
  const token = regData.result.token

  const warpResponse = await fetch(`https://api.cloudflareclient.com/v0i1909051800/reg/${id}`, {
    method: "PATCH",
    headers: {
      "User-Agent": "",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ warp_enabled: true })
  })

  const warpData = await warpResponse.json()
  const peer_pub = warpData.result.config.peers[0].public_key
  const client_ipv4 = warpData.result.config.interface.addresses.v4
  const client_ipv6 = warpData.result.config.interface.addresses.v6

  let allowed_ips_set = new Set()

  if (siteMode === "specific") {
    const ipRanges = {
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
Endpoint = engage.cloudflareclient.com:500`

  const confBase64 = Buffer.from(conf).toString("base64")
  const confWithoutMtu = conf.replace(/^MTU = 1280\n?/gm, "")
  const qrCodeBase64 = await QRCode.toDataURL(confWithoutMtu)
  
  return {
    configBase64: confBase64,
    qrCodeBase64: qrCodeBase64,
  }
}

export async function onRequestPost(context) {
  try {
    const { request } = context
    const body = await request.json()
    const { selectedServices, siteMode, deviceType } = body
    
    const content = await generateWarpConfig(selectedServices, siteMode, deviceType)
    
    return new Response(
      JSON.stringify({ success: true, content }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Произошла ошибка на сервере." 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}