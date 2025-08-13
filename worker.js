export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    
    // Serve static files
    if (url.pathname.startsWith('/_next/') || 
        url.pathname.endsWith('.js') || 
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.ico')) {
      return env.ASSETS.fetch(request)
    }
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/warp' && request.method === 'POST') {
        try {
          const body = await request.json()
          // Здесь будет логика генерации конфига
          // (нужно будет перенести из lib/warpConfig.ts)
          
          return new Response(JSON.stringify({ 
            success: true, 
            content: { configBase64: "", qrCodeBase64: "" }
          }), {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            success: false, 
            message: "Ошибка сервера" 
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          })
        }
      }
    }
    
    // Serve main page
    return env.ASSETS.fetch(request)
  },
}