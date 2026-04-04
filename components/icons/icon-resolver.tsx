'use client';

import { FaDiscord, FaYoutube, FaTwitter, FaFacebook } from 'react-icons/fa';
import { FaTelegram, FaSignalMessenger } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io';
import { RiInstagramFill, RiNetflixFill } from 'react-icons/ri';
import { SiPatreon, SiCanva, SiProtonvpn, SiModrinth } from 'react-icons/si';
import { TbBoxMultipleFilled } from 'react-icons/tb';
import {
  ViberIcon,
  NNMClubIcon,
  KinozalIcon,
  CopilotIcon,
  AnimeGoIcon,
  PornhubIcon,
  JutsuIcon,
  YummyAnimeIcon,
  XVideosIcon,
  PornoLabIcon,
  FicBookIcon,
  RuTrackerIcon,
} from '@/components/icons/custom-icons';
import type { IconType } from 'react-icons';

/**
 * Map of icon name (from service JSON) → React component.
 *
 * To add a new icon:
 * 1. If it's from react-icons: import it above, add to ICON_MAP
 * 2. If it's custom: add SVG to custom-icons.tsx, import here, add to ICON_MAP
 */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  // react-icons/fa
  FaDiscord,
  FaYoutube,
  FaTwitter,
  FaFacebook,
  // react-icons/fa6
  FaTelegram,
  FaSignalMessenger,
  // react-icons/io
  IoLogoWhatsapp,
  // react-icons/ri
  RiInstagramFill,
  RiNetflixFill,
  // react-icons/si
  SiPatreon,
  SiCanva,
  SiProtonvpn,
  SiModrinth,
  // react-icons/tb
  TbBoxMultipleFilled,
  // Custom icons
  ViberIcon,
  NNMClubIcon,
  KinozalIcon,
  CopilotIcon,
  AnimeGoIcon,
  PornhubIcon,
  JutsuIcon,
  YummyAnimeIcon,
  XVideosIcon,
  PornoLabIcon,
  FicBookIcon,
  RuTrackerIcon,
};

const FALLBACK = TbBoxMultipleFilled;

interface ServiceIconProps {
  icon: string;
  className?: string;
}

/**
 * Renders a service icon by name.
 * Automatically resolves react-icons and custom SVG icons.
 *
 * Usage: <ServiceIcon icon="FaDiscord" className="w-5 h-5" />
 */
export function ServiceIcon({ icon, className = 'w-5 h-5' }: ServiceIconProps) {
  const Component = ICON_MAP[icon] || FALLBACK;
  return <Component className={className} />;
}

/**
 * Check if an icon name has a registered component.
 */
export function hasIcon(icon: string): boolean {
  return icon in ICON_MAP;
}
