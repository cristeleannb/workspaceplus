import React from 'react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';

import {useStores} from '@/stores';
import {delay} from '@/utils';
import {useOneSignal} from '@/hooks/useOneSignal';

interface ReactQueryProvider {
  children?: React.ReactNode;
  enableDevTools?: boolean;
}

const ReactQueryProvider = (props: ReactQueryProvider) => {
  const {enableDevTools = false, children} = props;

  const {authStore} = useStores();
  const {removeExternalUserId} = useOneSignal();

  const logout = async () => {
    authStore.setToken(null);
    removeExternalUserId();
    await delay(1200);
    queryClient.clear();
    authStore.logout();
  };

  const retry = (failureCount: number, error: any) => {
    const reqError: any = error;
    if (reqError && reqError.status === 401) {
      logout();
      return false;
    }
    if (failureCount < 2) {
      return true;
    }
    return false;
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: retry,
      },
      mutations: {
        retry: retry,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {enableDevTools && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
