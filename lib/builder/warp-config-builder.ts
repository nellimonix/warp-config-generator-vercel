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
  dns: [1.1.1.1, 1.0.0.1]
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
    return 'I1 = <b 0xc2000000011419fa4bb3599f336777de79f81ca9a8d80d91eeec000044c635cef024a885dcb66d1420a91a8c427e87d6cf8e08b563932f449412cddf77d3e2594ea1c7a183c238a89e9adb7ffa57c133e55c59bec101634db90afb83f75b19fe703179e26a31902324c73f82d9354e1ed8da39af610afcb27e6590a44341a0828e5a3d2f0e0f7b0945d7bf3402feea0ee6332e19bdf48ffc387a97227aa97b205a485d282cd66d1c384bafd63dc42f822c4df2109db5b5646c458236ddcc01ae1c493482128bc0830c9e1233f0027a0d262f92b49d9d8abd9a9e0341f6e1214761043c021d7aa8c464b9d865f5fbe234e49626e00712031703a3e23ef82975f014ee1e1dc428521dc23ce7c6c13663b19906240b3efe403cf30559d798871557e4e60e86c29ea4504ed4d9bb8b549d0e8acd6c334c39bb8fb42ede68fb2aadf00cfc8bcc12df03602bbd4fe701d64a39f7ced112951a83b1dbbe6cd696dd3f15985c1b9fef72fa8d0319708b633cc4681910843ce753fac596ed9945d8b839aeff8d3bf0449197bd0bb22ab8efd5d63eb4a95db8d3ffc796ed5bcf2f4a136a8a36c7a0c65270d511aebac733e61d414050088a1c3d868fb52bc7e57d3d9fd132d78b740a6ecdc6c24936e92c28672dbe00928d89b891865f885aeb4c4996d50c2bbbb7a99ab5de02ac89b3308e57bcecf13f2da0333d1420e18b66b4c23d625d836b538fc0c221d6bd7f566a31fa292b85be96041d8e0bfe655d5dc1afed23eb8f2b3446561bbee7644325cc98d31cea38b865bdcc507e48c6ebdc7553be7bd6ab963d5a14615c4b81da7081c127c791224853e2d19bafdc0d9f3f3a6de898d14abb0e2bc849917e0a599ed4a541268ad0e60ea4d147dc33d17fa82f22aa505ccb53803a31d10a7ca2fea0b290a52ee92c7bf4aab7cea4e3c07b1989364eed87a3c6ba65188cd349d37ce4eefde9ec43bab4b4dc79e03469c2ad6b902e28e0bbbbf696781ad4edf424ffb35ce0236d373629008f142d04b5e08a124237e03e3149f4cdde92d7fae581a1ac332e26b2c9c1a6bdec5b3a9c7a2a870f7a0c25fc6ce245e029b686e346c6d862ad8df6d9b62474fbc31dbb914711f78074d4441f4e6e9edca3c52315a5c0653856e23f681558d669f4a4e6915bcf42b56ce36cb7dd3983b0b1d6fdf0f8efddb68e7ca0ae9dd4570fe6978fbb524109f6ec957ca61f1767ef74eb803b0f16abd0087cf2d01bc1db1c01d97ac81b3196c934586963fe7cf2d310e0739621e8bd00dc23fded18576d8c8f285d7bb5f43b547af3c76235de8b6f757f817683b2151600b11721219212bf27558edd439e73fce951f61d582320e5f4d6c315c71129b719277fc144bbe8ded25ab6d29b6e189c9bd9b16538faf60cc2aab3c3bb81fc2213657f2dd0ceb9b3b871e1423d8d3e8cc008721ef03b28e0ee7bb66b8f2a2ac01ef88df1f21ed49bf1ce435df31ac34485936172567488812429c269b49ee9e3d99652b51a7a614b7c460bf0d2d64d8349ded7345bedab1ea0a766a8470b1242f38d09f7855a32db39516c2bd4bcc538c52fa3a90c8714d4b006a15d9c7a7d04919a1cab48da7cce0d5de1f9e5f8936cffe469132991c6eb84c5191d1bcf69f70c58d9a7b66846440a9f0eef25ee6ab62715b50ca7bef0bc3013d4b62e1639b5028bdf757454356e9326a4c76dabfb497d451a3a1d2dbd46ec283d255799f72dfe878ae25892e25a2542d3ca9018394d8ca35b53ccd94947a8>';
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