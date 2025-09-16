import { NextResponse } from "next/server";
import { WarpService, WarpGenerationError } from "@/lib/warp-service";

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await req.json();
    const { selectedServices, siteMode, deviceType, endpoint } = body;
    
    console.log('WARP API Request received:', { 
      selectedServices: selectedServices?.length || 0, 
      siteMode, 
      deviceType, 
      endpoint: endpoint ? 'provided' : 'missing'
    });

    // Создание экземпляра сервиса
    const warpService = new WarpService();

    // Генерация конфигурации
    const result = await warpService.generateConfig({
      selectedServices: selectedServices || [],
      siteMode: siteMode || 'all',
      deviceType: deviceType || 'computer',
      endpoint: endpoint || '162.159.195.1:500',
    });

    return NextResponse.json(
      { 
        success: true, 
        content: result 
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("WARP API Error:", error);

    let errorMessage = "Произошла неизвестная ошибка на сервере.";
    let statusCode = 500;

    if (error instanceof WarpGenerationError) {
      errorMessage = `Ошибка генерации: ${error.message}`;
      statusCode = 400;
    } else if (error instanceof Error) {
      errorMessage = `Ошибка: ${error.message}`;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { 
        status: statusCode,
        headers: corsHeaders
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}