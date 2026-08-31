import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface AddToWishlistPayload {
    userId?: string
    productId: string
}

export const addToWishlist = async (payload: AddToWishlistPayload) => {
    const url = `${BASE_URL}/wishlist/add`
    const bodyData = {
        userId: payload.userId,
        productId: payload.productId,
    }

    console.log('Add to wishlist API URL:', url, 'Payload:', bodyData)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
        throw new Error('Failed to add item to wishlist')
    }

    const data = await response.json()
    console.log('Add to wishlist response:', data)

    if (data.success === false) {
        throw new Error(data.message || 'Failed to add item to wishlist')
    }

    return data
}

export const useAddToWishlist = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addToWishlist,
        onSuccess: (data) => {
            console.log('Successfully added item to wishlist:', data)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WISHLIST] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
        },
        onError: (error: any) => {
            console.error('Error adding item to wishlist:', error)
            Alert.alert('Error', error?.message || 'Failed to add item to wishlist. Please try again.')
        },
    })
}

export default useAddToWishlist
