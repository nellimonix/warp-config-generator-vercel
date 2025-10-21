/**
 * Расширенный построитель конфигураций WARP с поддержкой различных форматов
 */

import type { DeviceType, WarpConfigParams, DNSConfig } from '../types';

export type ConfigFormat = 'wireguard' | 'throne' | 'clash' | 'nekoray' | 'husi' | 'karing';

export interface ExtendedWarpConfigParams extends WarpConfigParams {
  configFormat: ConfigFormat;
  reserved?: string; // для некоторых форматов
}

export class EnhancedWarpConfigBuilder {
  private static readonly DEFAULT_DNS: DNSConfig = {
    primary: ['1.1.1.1', '2606:4700:4700::1111'],
    secondary: ['1.0.0.1', '2606:4700:4700::1001'],
  };

  private static readonly DEFAULT_MTU = 1280;

  private static readonly DEVICE_PROFILES = {
    computer: {
      jc: 4,
      jmin: 40,
      jmax: 70,
    },
    phone: {
      jc: 120,
      jmin: 23,
      jmax: 911,
    },
    awg15: {
      jc: 120,
      jmin: 23,
      jmax: 911,
    },
  } as const;

  /**
   * Главная функция построения конфигурации
   */
  public static build(params: ExtendedWarpConfigParams): string {
    switch (params.configFormat) {
      case 'wireguard':
        return EnhancedWarpConfigBuilder.buildWireGuardConfig(params);
      case 'throne':
        return EnhancedWarpConfigBuilder.buildThroneConfig(params);
      case 'clash':
        return EnhancedWarpConfigBuilder.buildClashConfig(params);
      case 'nekoray':
        return EnhancedWarpConfigBuilder.buildNekoRayConfig(params);
      case 'husi':
        return EnhancedWarpConfigBuilder.buildHusiConfig(params);
      case 'karing':
        return EnhancedWarpConfigBuilder.buildKaringConfig(params);
      default:
        throw new Error(`Unsupported config format: ${params.configFormat}`);
    }
  }

  /**
   * Конфигурация для QR кода (упрощенная)
   */
  public static buildForQR(params: ExtendedWarpConfigParams): string {
    if (params.configFormat === 'throne') {
      // Throne использует специальный URL формат для QR
      return EnhancedWarpConfigBuilder.buildThroneConfig(params);
    }
    
    const fullConfig = EnhancedWarpConfigBuilder.build(params);
    return EnhancedWarpConfigBuilder.removeMTULine(fullConfig);
  }

  /**
   * Стандартная WireGuard конфигурация
   */
  private static buildWireGuardConfig(params: ExtendedWarpConfigParams): string {
    const interfaceSection = EnhancedWarpConfigBuilder.buildInterfaceSection(params);
    const peerSection = EnhancedWarpConfigBuilder.buildPeerSection(params);
    
    return `${interfaceSection}\n\n${peerSection}`;
  }

  /**
   * Конфигурация для Throne
   */
  private static buildThroneConfig(params: ExtendedWarpConfigParams): string {
    const { privateKey, clientIPv4, clientIPv6, endpoint, deviceType } = params;
    const profile = EnhancedWarpConfigBuilder.DEVICE_PROFILES[deviceType];
    
    // Убираем = из конца приватного ключа если есть
    const cleanPrivateKey = privateKey.replace(/=$/, '');
    
    // Парсим reserved из base64 в формат dash-separated
    const reserved = params.reserved || '';
    const reservedFormatted = EnhancedWarpConfigBuilder.formatReservedForThrone(reserved);

    return `wg://${endpoint}?private_key=${cleanPrivateKey}%3D&peer_public_key=bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo%3D&pre_shared_key=&reserved=${reservedFormatted}&persistent_keepalive=0&mtu=1280&use_system_interface=false&local_address=${clientIPv4}/32-${clientIPv6}/128&workers=0&enable_amnezia=true&junk_packet_count=${profile.jc}&junk_packet_min_size=${profile.jmin}&junk_packet_max_size=${profile.jmax}&init_packet_junk_size=0&response_packet_junk_size=0&init_packet_magic_header=1&response_packet_magic_header=2&underload_packet_magic_header=3&transport_packet_magic_header=4#WARP`;
  }

  /**
   * Конфигурация для Clash
   */
  private static buildClashConfig(params: ExtendedWarpConfigParams): string {
    const { privateKey, publicKey, clientIPv4, clientIPv6, endpoint } = params;
    const reserved = params.reserved || '';
    const reservedFormatted = EnhancedWarpConfigBuilder.formatReservedArray(reserved);

    // Парсим endpoint для получения server и port
    const [server, port] = endpoint.split(':');

    return `proxies:
- name: "WARP"
  type: wireguard
  private-key: ${privateKey}
  server: ${server}
  port: ${port || '500'}
  ip: ${clientIPv4}
  public-key: ${publicKey}
  allowed-ips: ['0.0.0.0/0']
  reserved: [${reservedFormatted}]
  udp: true
  mtu: 1280
  remote-dns-resolve: true
  dns: [1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001]
  amnezia-wg-option:
   jc: 120
   jmin: 23
   jmax: 911
   s1: 0
   s2: 0
   h1: 1
   h2: 2
   h4: 3
   h3: 4

proxy-groups:
- name: Cloudflare
  type: select
  icon: https://www.vectorlogo.zone/logos/cloudflare/cloudflare-icon.svg
  proxies:
    - WARP
  url: 'http://speed.cloudflare.com/'
  interval: 300`;
  }

  /**
   * Конфигурация для NekoRay/Exclave
   */
  private static buildNekoRayConfig(params: ExtendedWarpConfigParams): string {
    const { privateKey, publicKey, clientIPv4, clientIPv6, endpoint } = params;
    const reserved = params.reserved || '';
    const reservedFormatted = EnhancedWarpConfigBuilder.formatReservedArray(reserved);

    // Парсим endpoint для получения server и port
    const [server, port] = endpoint.split(':');

    return JSON.stringify({
      mtu: 1280,
      reserved: reservedFormatted.split(', ').map(Number),
      private_key: privateKey,
      type: "wireguard",
      local_address: [`${clientIPv4}/32`, `${clientIPv6}/128`],
      peer_public_key: publicKey,
      server: server,
      server_port: parseInt(port || '500', 10)
    }, null, 2);
  }

  /**
   * Конфигурация для Husi
   */
  private static buildHusiConfig(params: ExtendedWarpConfigParams): string {
    const { privateKey, publicKey, clientIPv4, clientIPv6, endpoint, allowedIPs } = params;
    const reserved = params.reserved || '';
    const reservedFormatted = EnhancedWarpConfigBuilder.formatReservedArray(reserved);

    // Парсим endpoint для получения server и port
    const [server, port] = endpoint.split(':');

    return JSON.stringify({
      type: "wireguard",
      tag: "proxy",
      mtu: 1280,
      address: [`${clientIPv4}/32`, `${clientIPv6}/128`],
      private_key: privateKey,
      listen_port: 0,
      peers: [
        {
          address: server,
          port: parseInt(port || '500', 10),
          public_key: publicKey,
          pre_shared_key: "",
          allowed_ips: allowedIPs.split(', '),
          persistent_keepalive_interval: 600,
          reserved: reservedFormatted
        }
      ],
      detour: "direct"
    }, null, 2);
  }

  /**
   * Конфигурация для Karing/Hiddify
   */
  private static buildKaringConfig(params: ExtendedWarpConfigParams): string {
    const { privateKey, publicKey, clientIPv4, clientIPv6, endpoint } = params;
    const reserved = params.reserved || '';
    const reservedFormatted = EnhancedWarpConfigBuilder.formatReservedArray(reserved);

    // Парсим endpoint для получения server и port
    const [server, port] = endpoint.split(':');

    return JSON.stringify({
      outbounds: [
        {
          tag: "WARP",
          reserved: reservedFormatted.split(', ').map(Number),
          mtu: 1280,
          fake_packets: "5-10",
          fake_packets_size: "40-100",
          fake_packets_delay: "20-250",
          fake_packets_mode: "m4",
          private_key: privateKey,
          type: "wireguard",
          local_address: [`${clientIPv4}/32`, `${clientIPv6}/128`],
          peer_public_key: publicKey,
          server: server || "engage.cloudflareclient.com",
          server_port: parseInt(port || '500', 10)
        }
      ]
    }, null, 2);
  }

  /**
   * Конфигурация для WARP in WARP
   */
  private static buildWarpInWarpConfig(params: ExtendedWarpConfigParams): string {
    // Для WARP in WARP нужны два отдельных соединения
    const { privateKey, publicKey, clientIPv4, clientIPv6, endpoint } = params;
    const reserved = params.reserved || '';
    const reservedFormatted = EnhancedWarpConfigBuilder.formatReservedArray(reserved);

    // Генерируем случайные номера для тегов
    const randomNumber = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
    const randomNumber2 = Math.floor(Math.random() * (99 - 10 + 1)) + 10;

    // Парсим endpoint для получения server и port
    const [server, port] = endpoint.split(':');

    return JSON.stringify({
      outbounds: [
        {
          tag: `WARP_${randomNumber}`,
          reserved: reservedFormatted.split(', ').map(Number),
          mtu: 1280,
          fake_packets: "5-10",
          fake_packets_size: "40-100",
          fake_packets_delay: "20-250",
          fake_packets_mode: "m4",
          private_key: privateKey,
          type: "wireguard",
          local_address: [`${clientIPv4}/32`, `${clientIPv6}/128`],
          peer_public_key: publicKey,
          server: server || "162.159.192.1",
          server_port: parseInt(port || '500', 10)
        },
        {
          type: "wireguard",
          tag: `WARPinWARP_${randomNumber2}`,
          detour: `WARP_${randomNumber}`,
          local_address: [`${clientIPv4}/32`, `${clientIPv6}/128`], // Используем те же адреса, в реальности нужны другие
          private_key: privateKey, // В реальности нужен другой ключ
          peer_public_key: publicKey,
          reserved: reservedFormatted.split(', ').map(Number),
          mtu: 1200,
          server: server || "162.159.192.1",
          server_port: 2408
        }
      ]
    }, null, 2);
  }

  /**
   * Построение секции [Interface] для WireGuard
   */
  private static buildInterfaceSection(params: ExtendedWarpConfigParams): string {
    const { privateKey, clientIPv4, clientIPv6, deviceType } = params;
    const profile = EnhancedWarpConfigBuilder.DEVICE_PROFILES[deviceType];
    const dns = EnhancedWarpConfigBuilder.formatDNS();

    const lines = [
      '[Interface]',
      `PrivateKey = ${privateKey}`,
      `Address = ${clientIPv4}, ${clientIPv6}`,
      `DNS = ${dns}`,
      `MTU = ${EnhancedWarpConfigBuilder.DEFAULT_MTU}`,
      'S1 = 0',
      'S2 = 0',
      `Jc = ${profile.jc}`,
      `Jmin = ${profile.jmin}`,
      `Jmax = ${profile.jmax}`,
      'H1 = 1',
      'H2 = 2',
      'H3 = 3',
      'H4 = 4',
    ];

    // Добавляем специальный параметр для AmneziaWG 1.5
    if (deviceType === 'awg15') {
      lines.push(EnhancedWarpConfigBuilder.getAmneziaWGParam());
    }

    return lines.join('\n');
  }

  /**
   * Построение секции [Peer] для WireGuard
   */
  private static buildPeerSection(params: ExtendedWarpConfigParams): string {
    const { publicKey, allowedIPs, endpoint } = params;

    return [
      '[Peer]',
      `PublicKey = ${publicKey}`,
      `AllowedIPs = ${allowedIPs}`,
      `Endpoint = ${endpoint}`,
    ].join('\n');
  }

  /**
   * Форматирование DNS серверов
   */
  private static formatDNS(): string {
    const { primary, secondary } = EnhancedWarpConfigBuilder.DEFAULT_DNS;
    return [...primary, ...secondary].join(', ');
  }

  /**
   * Получение параметра для AmneziaWG 1.5
   */
  private static getAmneziaWGParam(): string {
    return 'I1 = <b 0xc10000000114367096bb0fb3f58f3a3fb8aaacd61d63a1c8a40e14f7374b8a62dccba6431716c3abf6f5afbcfb39bd008000047c32e268567c652e6f4db58bff759bc8c5aaca183b87cb4d22938fe7d8dca22a679a79e4d9ee62e4bbb3a380dd78d4e8e48f26b38a1d42d76b371a5a9a0444827a69d1ab5872a85749f65a4104e931740b4dc1e2dd77733fc7fac4f93011cd622f2bb47e85f71992e2d585f8dc765a7a12ddeb879746a267393ad023d267c4bd79f258703e27345155268bd3cc0506ebd72e2e3c6b5b0f005299cd94b67ddabe30389c4f9b5c2d512dcc298c14f14e9b7f931e1dc397926c31fbb7cebfc668349c218672501031ecce151d4cb03c4c660b6c6fe7754e75446cd7de09a8c81030c5f6fb377203f551864f3d83e27de7b86499736cbbb549b2f37f436db1cae0a4ea39930f0534aacdd1e3534bc87877e2afabe959ced261f228d6362e6fd277c88c312d966c8b9f67e4a92e757773db0b0862fb8108d1d8fa262a40a1b4171961f0704c8ba314da2482ac8ed9bd28d4b50f7432d89fd800c25a50c5e2f5c0710544fef5273401116aa0572366d8e49ad758fcb29e6a92912e644dbe227c247cb3417eabfab2db16796b2fba420de3b1dc94e8361f1f324a331ddaf1e626553138860757fd0bf687566108b77b70fb9f8f8962eca599c4a70ed373666961a8cb506b96756d9e28b94122b20f16b54f118c0e603ce0b831efea614ad836df6cf9affbdd09596412547496967da758cec9080295d853b0861670b71d9abde0d562b1a6de82782a5b0c14d297f27283a895abc889a5f6703f0e6eb95f67b2da45f150d0d8ab805612d570c2d5cb6997ac3a7756226c2f5c8982ffbd480c5004b0660a3c9468945efde90864019a2b519458724b55d766e16b0da25c0557c01f3c11ddeb024b62e303640e17fdd57dedb3aeb4a2c1b7c93059f9c1d7118d77caac1cd0f6556e46cbc991c1bb16970273dea833d01e5090d061a0c6d25af2415cd2878af97f6d0e7f1f936247b394ecb9bd484da6be936dee9b0b92dc90101a1b4295e97a9772f2263eb09431995aa173df4ca2abd687d87706f0f93eaa5e13cbe3b574fa3cfe94502ace25265778da6960d561381769c24e0cbd7aac73c16f95ae74ff7ec38124f7c722b9cb151d4b6841343f29be8f35145e1b27021056820fed77003df8554b4155716c8cf6049ef5e318481460a8ce3be7c7bfac695255be84dc491c19e9dedc449dd3471728cd2a3ee51324ccb3eef121e3e08f8e18f0006ea8957371d9f2f739f0b89e4db11e5c6430ada61572e589519fbad4498b460ce6e4407fc2d8f2dd4293a50a0cb8fcaaf35cd9a8cc097e3603fbfa08d9036f52b3e7fcce11b83ad28a4ac12dba0395a0cc871cefd1a2856fffb3f28d82ce35cf80579974778bab13d9b3578d8c75a2d196087a2cd439aff2bb33f2db24ac175fff4ed91d36a4cdbfaf3f83074f03894ea40f17034629890da3efdbb41141b38368ab532209b69f057ddc559c19bc8ae62bf3fd564c9a35d9a83d14a95834a92bae6d9a29ae5e8ece07910d16433e4c6230c9bd7d68b47de0de9843988af6dc88b5301820443bd4d0537778bf6b4c1dd067fcf14b81015f2a67c7f2a28f9cb7e0684d3cb4b1c24d9b343122a086611b489532f1c3a26779da1706c6759d96d8ab>';
  }

  /**
   * Форматирование reserved для Throne (dash-separated)
   */
  private static formatReservedForThrone(reserved: string): string {
    if (!reserved) return '0-0-0';
    
    try {
      // Если reserved это base64, декодируем
      const buffer = Buffer.from(reserved, 'base64');
      const bytes = Array.from(buffer);
      return bytes.join('-');
    } catch {
      // Если не получилось декодировать, возвращаем дефолт
      return '0-0-0';
    }
  }

  /**
   * Форматирование reserved как массив чисел
   */
  private static formatReservedArray(reserved: string): string {
    if (!reserved) return '0, 0, 0';
    
    try {
      // Если reserved это base64, декодируем
      const buffer = Buffer.from(reserved, 'base64');
      const bytes = Array.from(buffer);
      return bytes.join(', ');
    } catch {
      // Если не получилось декодировать, возвращаем дефолт
      return '0, 0, 0';
    }
  }

  /**
   * Удаление строки MTU из конфигурации
   */
  private static removeMTULine(config: string): string {
    return config.replace(/^MTU = \d+\n?/gm, '');
  }

  /**
   * Получение списка поддерживаемых форматов
   */
  public static getSupportedFormats(): ConfigFormat[] {
    return ['wireguard', 'throne', 'clash', 'nekoray', 'husi', 'karing'];
  }

  /**
   * Получение человекочитаемого названия формата
   */
  public static getFormatDisplayName(format: ConfigFormat): string {
    const names: Record<ConfigFormat, string> = {
      wireguard: 'AmneziaWG',
      throne: 'Throne',
      clash: 'Clash',
      nekoray: 'NekoRay/Exclave',
      husi: 'Husi',
      karing: 'Karing/Hiddify'
    };
    return names[format];
  }

  /**
   * Проверка, нужны ли дополнительные параметры для формата
   */
  public static requiresReserved(format: ConfigFormat): boolean {
    return ['throne', 'clash', 'nekoray', 'husi', 'karing'].includes(format);
  }
}