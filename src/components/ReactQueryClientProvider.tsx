'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react' 
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => { 
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { 
        staleTime: 1000 * 60 * 5, 
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
      }
    }
  }))
  
  const [persister, setPersister] = useState<any>(null)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
      })
      setPersister(localStoragePersister)
    }
  }, [])
  
  if (!persister) { 
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  } 

  return (
    <PersistQueryClientProvider client={queryClient}  persistOptions={{persister}}>
      {children}
    </PersistQueryClientProvider>
  )
}