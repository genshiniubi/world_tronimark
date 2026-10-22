import { createContext, useContext, type ReactNode } from 'react';
import type { BootstrapResponse } from '@codelab/shared';

const SiteContext = createContext<BootstrapResponse | null>(null);

export function SiteProvider({
  value,
  children,
}: {
  value: BootstrapResponse;
  children: ReactNode;
}) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): BootstrapResponse {
  const value = useContext(SiteContext);
  if (!value) throw new Error('SiteProvider is missing');
  return value;
}
