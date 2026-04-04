/**
 * IP ranges API — re-exports from the auto-loaded services config.
 * All functions work with the in-memory map, zero file I/O.
 */
export {
  isServiceSupported,
  getServiceRanges,
  getCombinedRanges,
  resolveAllowedIPs,
} from '@/config/services-loader';
