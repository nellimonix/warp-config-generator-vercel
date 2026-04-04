export interface EndpointOption {
  id: string;
  label: string;
  value: string;
  /** If set, clicking this option opens a link instead of using the endpoint */
  externalUrl?: string;
  flag?: string;
}

export const ENDPOINTS: EndpointOption[] = [
  {
    id: 'default',
    label: 'По умолчанию',
    value: 'engage.cloudflareclient.com:4500',
  },
  {
    id: 'default2',
    label: 'Альтернативный',
    value: 'engage.cloudflareclient.com:2408',
  },
  {
    id: 'custom',
    label: 'Указать свой адрес',
    value: '',
  },
  // Fake server endpoints — redirect to Telegram
  {
    id: 'server-de',
    label: 'Германия',
    value: '',
    externalUrl: 'tg://resolve?domain=findllimonix&post=69',
    flag: 'DE',
  },
  {
    id: 'server-nl',
    label: 'Нидерланды',
    value: '',
    externalUrl: 'tg://resolve?domain=findllimonix&post=69',
    flag: 'NL',
  },
  {
    id: 'server-fi',
    label: 'Финляндия',
    value: '',
    externalUrl: 'tg://resolve?domain=findllimonix&post=69',
    flag: 'FI',
  },
];

export function getEndpointValue(id: string, customValue?: string): string {
  if (id === 'custom') return customValue || 'engage.cloudflareclient.com:4500';
  const ep = ENDPOINTS.find((e) => e.id === id);
  return ep?.value || 'engage.cloudflareclient.com:4500';
}

export function isExternalEndpoint(id: string): string | null {
  const ep = ENDPOINTS.find((e) => e.id === id);
  return ep?.externalUrl ?? null;
}
