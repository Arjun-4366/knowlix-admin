"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query"

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
  )

  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}
