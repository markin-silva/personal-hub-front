import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  // Criamos o QueryClient dentro do useState para evitar que ele seja reinicializado
  // em possíveis re-renderizações acidentais do componente raiz.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Dados permanecem "frescos" por 5 minutos
            retry: 1, // Tenta novamente apenas 1 vez em caso de falha de rede
            refetchOnWindowFocus: false, // Desativa busca automática ao mudar de aba
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
