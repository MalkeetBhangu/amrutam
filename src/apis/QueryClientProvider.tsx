import React from 'react'
import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
})

export const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Provider client={queryClient}>{children}</Provider>
}
