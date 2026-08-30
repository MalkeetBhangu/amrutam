import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface RemoveFromWishlistPayload {
    userId?: string
    productId: string
}

export const removeFromWishlist = async (payload: RemoveFromWishlistPayload) => {
    const url = `${BASE_URL}/wishlist/remove`
    const bodyData = {
        userId: payload.userId || 'guest',
        productId: payload.productId,
    }

    console.log('Remove from wishlist API URL:', url, 'Payload:', bodyData)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })

    const data = await response.json()
    console.log('Remove from wishlist response:', data)
    return data
}

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: removeFromWishlist,
        onSuccess: (data) => {
            console.log('Successfully removed item from wishlist:', data)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
        },
        onError: (error) => {
            console.error('Error removing item from wishlist:', error)
        },
    })
}

export default useRemoveFromWishlist
