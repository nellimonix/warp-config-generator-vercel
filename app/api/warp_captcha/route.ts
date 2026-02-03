export const dynamic = 'force-static';
export const revalidate = false;

import { NextResponse } from "next/server";
import { EnhancedWarpService, WarpGenerationError } from "@/lib/warp-service";
import { getFileName, type ConfigFormat } from "@/lib/types";

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;

export async function POST(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await req.json();
    const { 
      selectedServices, 
      siteMode, 
      deviceType, 
      endpoint,
      configFormat = 'wireguard',
      captchaToken
    } = body;
    
    // === Проверка hCaptcha ===
    if (!captchaToken) {
      return NextResponse.json(
        { success: false, message: "Captcha не пройдена." },
        { status: 400, headers: corsHeaders }
      );
    }

    const verifyResp = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${HCAPTCHA_SECRET}&response=${captchaToken}`,
    });
    const verifyData = await verifyResp.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { success: false, message: "Неверная капча." },
        { status: 400, headers: corsHeaders }
      );
    }
    // =========================

    console.log('Enhanced WARP API Request received:', { 
      selectedServices: selectedServices?.length || 0, 
      siteMode, 
      deviceType, 
      endpoint: endpoint ? 'provided' : 'missing',
      configFormat,
      captchaSuccess: verifyData.success
    });

    // Валидация формата конфигурации
    const supportedFormats: ConfigFormat[] = [
      'wireguard', 'throne', 'clash', 'nekoray', 'husi', 'karing'
    ];

    if (configFormat && !supportedFormats.includes(configFormat)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Неподдерживаемый формат конфигурации: ${configFormat}. Поддерживаемые форматы: ${supportedFormats.join(', ')}` 
        },
        { 
          status: 400,
          headers: corsHeaders
        }
      );
    }

    // Создание экземпляра расширенного сервиса
    const warpService = new EnhancedWarpService();

    // Генерация конфигурации
    const result = await warpService.generateConfig({
      selectedServices: selectedServices || [],
      siteMode: siteMode || 'all',
      deviceType: deviceType || 'computer',
      endpoint: endpoint || 'engage.cloudflareclient.com:4500',
      configFormat: configFormat
    });

    // Добавляем имя файла если его нет
    if (!result.fileName) {
      result.fileName = getFileName(result.configFormat);
    }

    console.log(`${result.configFormat} configuration generated successfully`);

    return NextResponse.json(
      { 
        success: true, 
        content: result 
      },
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("Enhanced WARP API Error:", error);

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

export async function GET() {
  // Информационный endpoint для получения поддерживаемых форматов
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const warpService = new EnhancedWarpService();
    const supportedFormats = warpService.getSupportedFormats();

    return NextResponse.json(
      {
        success: true,
        data: {
          supportedFormats,
          formatDetails: {
            wireguard: {
              name: 'WireGuard',
              extension: 'conf',
              description: 'Стандартный формат WireGuard',
              supportsQR: true
            },
            throne: {
              name: 'Throne',
              extension: 'txt',
              description: 'URL формат для Throne клиента',
              supportsQR: true
            },
            clash: {
              name: 'Clash',
              extension: 'yaml',
              description: 'Конфигурация для Clash Meta',
              supportsQR: false
            },
            nekoray: {
              name: 'NekoRay/Exclave',
              extension: 'json',
              description: 'JSON для NekoRay/Exclave',
              supportsQR: false
            },
            husi: {
              name: 'Husi',
              extension: 'json',
              description: 'JSON конфигурация для Husi',
              supportsQR: false
            },
            karing: {
              name: 'Karing/Hiddify',
              extension: 'json',
              description: 'Конфигурация для Karing и Hiddify',
              supportsQR: false
            }
          }
        }
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Enhanced WARP API Info Error:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка получения информации о форматах"
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}