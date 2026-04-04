import { SERVICES } from '@/config/services-loader';
import { HomeClient } from '@/components/home-client';

export default function Home() {
  return <HomeClient services={SERVICES} />;
}
