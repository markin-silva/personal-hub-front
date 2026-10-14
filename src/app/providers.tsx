import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // We instantiate QueryClient inside useState to prevent it from being recreated
  // during accidental re-renders of the root component.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Data remains "fresh" for 5 minutes
            retry: 1, // Only retry once on network failure
            refetchOnWindowFocus: false, // Disable automatic refetch when switching tabs
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
