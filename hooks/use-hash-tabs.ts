'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const HASH_BY_TAB: Record<string, string> = {
  generator: '',
  applications: 'apps',
  ultimate: 'ultimate',
  about: 'about',
  support: 'support',
  formats: 'formats',
};

function parseHash(value: string): { tab: string; targetId?: string } {
  const hash = decodeURIComponent(value.replace(/^#/, '')).toLowerCase();
  if (hash.startsWith('clients-')) return { tab: 'applications', targetId: hash };
  const tab = Object.keys(HASH_BY_TAB).find((key) => HASH_BY_TAB[key] === hash);
  return { tab: tab || 'generator' };
}

function scrollToTarget(targetId?: string) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }));
}

export function useHashTabs(availableTabs: readonly string[]) {
  const available = useMemo(() => new Set(availableTabs), [availableTabs]);
  const [activeTab, setActiveTab] = useState('generator');

  const syncFromHash = useCallback(() => {
    const parsed = parseHash(window.location.hash);
    const tab = available.has(parsed.tab) ? parsed.tab : 'generator';
    setActiveTab(tab);
    scrollToTarget(tab === 'applications' ? parsed.targetId : undefined);
  }, [available]);

  useEffect(() => {
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [syncFromHash]);

  const navigateToTab = useCallback((tab: string) => {
    const nextTab = available.has(tab) ? tab : 'generator';
    const hash = HASH_BY_TAB[nextTab];
    if (hash) {
      const nextHash = `#${hash}`;
      if (window.location.hash !== nextHash) window.location.hash = nextHash;
    } else if (window.location.hash) {
      window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    setActiveTab(nextTab);
    scrollToTarget();
  }, [available]);

  return { activeTab, navigateToTab };
}
