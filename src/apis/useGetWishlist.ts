import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { GetWishlistResponse } from 'src/types/WishlistTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const fetchWishlist = async (userId = 'guest'): Promise<GetWishlistResponse> => {
    const url = `${BASE_URL}/wishlist?userId=${encodeURIComponent(userId)}`
    console.log('Fetching wishlist URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    console.log('Fetching wishlist response:', JSON.stringify(data, null, 2))

    return data
}

export const useGetWishlist = (userId = 'guest') => {
    return useQuery({
        queryKey: [QUERY_KEYS.WISHLIST, userId],
        queryFn: () => fetchWishlist(userId),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    })
}

export default useGetWishlist
