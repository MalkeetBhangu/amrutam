import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface RemoveFromCartPayload {
    userId?: string
    productId: string
}

export const removeFromCart = async (payload: RemoveFromCartPayload) => {
    const url = `${BASE_URL}/cart/remove`
    const bodyData = {
        userId: payload.userId || 'guest',
        productId: payload.productId,
    }

    console.log('Remove from cart API URL:', url, 'Payload:', bodyData)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })

    const data = await response.json()
    console.log('Remove from cart response:', data)
    return data
}

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: removeFromCart,
        onSuccess: (data) => {
            console.log('Successfully removed item from cart:', data)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
        },
        onError: (error) => {
            console.error('Error removing item from cart:', error)
        },
    })
}

export default useRemoveFromCart
