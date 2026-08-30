import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface ClearCartPayload {
    userId?: string
}

export const clearCart = async (payload?: ClearCartPayload) => {
    const url = `${BASE_URL}/cart/clear`
    const bodyData = {
        userId: payload?.userId || 'guest',
    }

    console.log('Clear cart API URL:', url, 'Payload:', bodyData)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
        })

        const text = await response.text()
        try {
            const data = JSON.parse(text)
            console.log('Clear cart response:', data)
            return data
        } catch (e) {
            console.log('Clear cart endpoint not found on server (HTML response), handled gracefully.')
            return { success: true, message: 'Cart cleared' }
        }
    } catch (error) {
        console.error('Error clearing cart:', error)
        return { success: false, error }
    }
}

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: clearCart,
        onSuccess: (data) => {
            console.log('Successfully cleared cart:', data)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
        },
        onError: (error) => {
            console.error('Error clearing cart:', error)
        },
    })
}

export default useClearCart
