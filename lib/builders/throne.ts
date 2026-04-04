import type { BuildParams } from '@/types';
import { DEVICE_PROFILES, WARP_PUBLIC_KEY } from './shared';
import { reservedToDashed } from '../crypto';

export function buildThrone(p: BuildParams): string {
  const prof = DEVICE_PROFILES[p.deviceType];
  const cleanKey = p.privateKey.replace(/=$/, '');
  const reserved = reservedToDashed(p.reserved);

  return `wg://${p.endpoint}?private_key=${cleanKey}%3D&peer_public_key=${encodeURIComponent(WARP_PUBLIC_KEY)}&pre_shared_key=&reserved=${reserved}&persistent_keepalive=0&mtu=1280&use_system_interface=false&local_address=${p.clientIPv4}/32-${p.clientIPv6}/128&workers=0&enable_amnezia=true&junk_packet_count=${prof.jc}&junk_packet_min_size=${prof.jmin}&junk_packet_max_size=${prof.jmax}&init_packet_junk_size=0&response_packet_junk_size=0&init_packet_magic_header=1&response_packet_magic_header=2&underload_packet_magic_header=3&transport_packet_magic_header=4#WARP`;
}
