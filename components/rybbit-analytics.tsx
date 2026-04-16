import Script from 'next/script';

export default function AnalyticsLoader() {
  const siteId = process.env.NEXT_PUBLIC_RYBBIT_ANALYTICS_SITE_ID;

  if (!siteId) {
    return null;
  }

  return (
    <Script src="https://anltcs.llimonix.dev/api/script.js" data-site-id={siteId} strategy="afterInteractive" />
  );
}