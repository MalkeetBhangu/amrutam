import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface AddToCartPayload {
    userId?: string
    productId: string
    quantity?: number
}

export const addToCart = async (payload: AddToCartPayload) => {
    const url = `${BASE_URL}/cart/add`
    const bodyData = {
        userId: payload.userId,
        productId: payload.productId,
        quantity: payload.quantity || 1,
    }

    console.log('Add to cart API URL:', url, 'Payload:', bodyData)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
        throw new Error('Failed to add item to cart')
    }

    const data = await response.json()
    console.log('Add to cart response:', data)

    if (data.success === false) {
        throw new Error(data.message || 'Failed to add item to cart')
    }

    return data
}

export const useAddToCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addToCart,
        onSuccess: (data) => {
            console.log('Successfully added item to cart:', data)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
        },
        onError: (error: any) => {
            console.error('Error adding item to cart:', error)
            Alert.alert('Error', error?.message || 'Failed to add item to cart. Please try again.')
        },
    })
}

export default useAddToCart
