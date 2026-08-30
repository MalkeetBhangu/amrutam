import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { GetCartResponse } from 'src/types/CartTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const fetchCart = async (userId = 'guest'): Promise<GetCartResponse> => {
    const url = `${BASE_URL}/cart?userId=${encodeURIComponent(userId)}`
    console.log('Fetching cart URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    console.log('Fetching cart response:', JSON.stringify(data, null, 2))

    return data
}

export const useGetCart = (userId = 'guest') => {
    return useQuery({
        queryKey: [QUERY_KEYS.CART, userId],
        queryFn: () => fetchCart(userId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    })
}

export default useGetCart
