// WARP Config Generator for Node.js (GitHub Actions)
const crypto = require('crypto');
const https = require('https');

// IP ranges
const IP_RANGES = {
  discord: "103.224.0.0/16, 104.16.0.0/12, 108.136.0.0/14, 108.156.0.0/14, 13.224.0.0/12, 13.32.0.0/12, 138.128.136.0/21, 143.204.0.0/16, 15.204.0.0/16, 162.158.0.0/15, 162.210.192.0/21, 170.178.160.0/19, 172.64.0.0/13, 18.128.0.0/9, 185.107.56.0/24, 188.114.96.0/22",
  youtube: "1.0.0.0/9, 1.192.0.0/10, 101.64.0.0/10, 103.0.0.0/14, 103.100.128.0/19, 103.101.0.0/18, 103.103.128.0/17, 103.105.0.0/16, 103.106.192.0/18, 103.107.128.0/17, 103.108.0.0/17, 103.111.128.0/17, 103.111.64.0/19",
  twitter: "104.16.0.0/12, 104.244.40.0/21, 146.75.0.0/16, 151.101.0.0/16, 152.192.0.0/13, 162.158.0.0/15, 172.64.0.0/13, 192.229.128.0/17, 199.232.0.0/16",
  instagram: "102.0.0.0/8, 103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19",
  facebook: "102.0.0.0/8, 103.200.28.0/22, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21, 103.252.96.0/19",
  viber: "100.24.0.0/13, 104.16.0.0/12, 104.64.0.0/10, 107.20.0.0/14, 108.136.0.0/14, 108.156.0.0/14",
  tiktok: "1.192.0.0/10, 101.0.0.0/11, 101.32.0.0/12, 101.64.0.0/10, 103.105.128.0/17, 103.136.0.0/16",
  spotify: "104.154.0.0/15, 104.64.0.0/10, 146.75.0.0/16, 151.101.0.0/16, 173.222.0.0/15, 18.128.0.0/9, 184.24.0.0/13, 184.50.0.0/15",
  zetflix: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22",
  nnmclub: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22",
  rutracker: "104.16.0.0/12, 162.158.0.0/15, 172.64.0.0/13, 185.81.128.0/23, 188.114.96.0/22",
  kinozal: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22",
  copilot: "104.208.0.0/13, 104.40.0.0/13, 104.64.0.0/10, 13.104.0.0/14, 13.64.0.0/11, 131.253.32.0/20, 138.91.0.0/16",
  canva: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22, 216.239.32.0/19",
  patreon: "103.200.28.0/22, 103.214.160.0/20, 103.226.224.0/19, 103.228.130.0/23, 103.230.0.0/17, 103.240.180.0/22, 103.246.240.0/21",
  animego: "185.178.208.0/22, 49.13.80.0/20",
  jutsu: "104.16.0.0/12, 144.76.0.0/16, 172.64.0.0/13, 188.114.96.0/22",
  yummianime: "104.16.0.0/12, 172.64.0.0/13, 188.114.96.0/22, 45.95.201.0/24, 50.7.0.0/16, 67.159.0.0/18",
  pornhub: "152.192.0.0/13, 208.99.64.0/19, 216.18.160.0/19, 64.210.128.0/19, 64.88.240.0/20, 66.254.96.0/19",
  xvideos: "104.16.0.0/12, 138.199.0.0/18, 143.244.32.0/19, 156.146.32.0/19, 169.150.192.0/18, 172.64.0.0/13",
  pornolab: "13.224.0.0/12, 18.128.0.0/9, 185.110.92.0/24, 185.61.148.0/23, 54.160.0.0/11",
  ficbook: "104.16.0.0/12, 172.64.0.0/13, 185.206.164.0/22",
  bestchange: "162.19.0.0/16, 188.124.37.0/24, 54.36.0.0/15"
};

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, data: result, status: res.statusCode });
        } catch (error) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, data, status: res.statusCode });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Generate random keys
function generateKeys() {
  const privateKey = crypto.randomBytes(32);
  const publicKey = crypto.randomBytes(32);
  
  return {
    privKey: privateKey.toString('base64'),
    pubKey: publicKey.toString('base64')
  };
}

// Generate QR code (fallback)
async function generateQRCode(text) {
  // Try external QR service
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(text)}`;
    
    return new Promise((resolve) => {
      https.get(qrUrl, (res) => {
        if (res.statusCode === 200) {
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const base64 = buffer.toString('base64');
            resolve(`data:image/png;base64,${base64}`);
          });
        } else {
          resolve(createFallbackQR());
        }
      }).on('error', () => {
        resolve(createFallbackQR());
      });
    });
  } catch (error) {
    return createFallbackQR();
  }
}

function createFallbackQR() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="white" stroke="#ccc"/>
    <rect x="20" y="20" width="20" height="20" fill="black"/>
    <rect x="40" y="20" width="20" height="20" fill="white"/>
    <rect x="60" y="20" width="20" height="20" fill="black"/>
    <rect x="20" y="40" width="20" height="20" fill="white"/>
    <rect x="40" y="40" width="20" height="20" fill="black"/>
    <rect x="60" y="40" width="20" height="20" fill="white"/>
    <text x="100" y="120" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code</text>
    <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">Use config text</text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Main function to generate WARP config
async function generateWarpConfigUniversal(selectedServices, siteMode, deviceType) {
  try {
    console.log("Starting WARP config generation...");
    
    const { privKey, pubKey } = generateKeys();
    console.log("Keys generated successfully");

    const regBody = JSON.stringify({
      install_id: "",
      tos: new Date().toISOString(),
      key: pubKey,
      fcm_token: "",
      type: "ios",
      locale: "en_US",
    });

    console.log("Sending registration request...");
    const regResponse = await makeRequest("https://api.cloudflareclient.com/v0i1909051800/reg", {
      method: "POST",
      headers: {
        "User-Agent": "okhttp/3.12.1",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(regBody)
      },
      body: regBody
    });
    
    if (!regResponse.ok) {
      throw new Error(`Registration failed: ${regResponse.status}`);
    }
    
    const regData = regResponse.data;
    console.log("Registration successful");
    
    if (!regData.result || !regData.result.id || !regData.result.token) {
      throw new Error("Invalid registration response structure");
    }
    
    const id = regData.result.id;
    const token = regData.result.token;

    console.log("Enabling WARP...");
    const warpBody = JSON.stringify({ warp_enabled: true });
    const warpResponse = await makeRequest(`https://api.cloudflareclient.com/v0i1909051800/reg/${id}`, {
      method: "PATCH",
      headers: {
        "User-Agent": "okhttp/3.12.1",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Length": Buffer.byteLength(warpBody)
      },
      body: warpBody
    });

    if (!warpResponse.ok) {
      throw new Error(`WARP enable failed: ${warpResponse.status}`);
    }

    const warpData = warpResponse.data;
    console.log("WARP enabled successfully");
    
    if (!warpData.result || !warpData.result.config || !warpData.result.config.peers || !warpData.result.config.peers[0]) {
      throw new Error("Invalid WARP response structure");
    }
    
    const peer_pub = warpData.result.config.peers[0].public_key;
    const client_ipv4 = warpData.result.config.interface.addresses.v4;
    const client_ipv6 = warpData.result.config.interface.addresses.v6;

    let allowed_ips_set = new Set();

    if (siteMode === "specific" && selectedServices && selectedServices.length > 0) {
      selectedServices.forEach((service) => {
        if (IP_RANGES[service]) {
          const serviceIps = IP_RANGES[service].split(", ");
          serviceIps.forEach(ip => allowed_ips_set.add(ip.trim()));
        }
      });
    }

    const allowed_ips = siteMode === "all" ? "0.0.0.0/0, ::/0" : Array.from(allowed_ips_set).join(", ");
    const platform_params = deviceType === "computer" ? "Jc = 4\nJmin = 40\nJmax = 70" : "Jc = 120\nJmin = 23\nJmax = 911";

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
Endpoint = engage.cloudflareclient.com:2408`;

    console.log("Generating base64 config...");
    const confBase64 = Buffer.from(conf).toString('base64');
    
    const confWithoutMtu = conf.replace(/^MTU = 1280\n?/gm, "");
    
    console.log("Generating QR code...");
    const qrCodeBase64 = await generateQRCode(confWithoutMtu);
    
    console.log("Config generation completed successfully");
    
    return {
      configBase64: confBase64,
      qrCodeBase64: qrCodeBase64,
    };
  } catch (error) {
    console.error("Error in generateWarpConfigUniversal:", error.message);
    throw error;
  }
}

module.exports = {
  generateWarpConfigUniversal,
  IP_RANGES
};