import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface ClearCartPayload {
    userId?: string
}

export const clearCart = async (payload?: ClearCartPayload) => {
    const url = `${BASE_URL}/cart/clear`
    const bodyData = {
        userId: payload?.userId,
    }

    console.log('Clear cart API URL:', url, 'Payload:', bodyData)

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
        throw new Error('Failed to clear cart')
    }

    const text = await response.text()
    try {
        const data = JSON.parse(text)
        if (data.success === false) {
            throw new Error(data.message || 'Failed to clear cart')
        }
        return data
    } catch (e: any) {
        if (e.message && e.message !== 'Failed to clear cart' && !e.message.includes('JSON Parse error') && !e.message.includes('Unexpected token')) {
            throw e
        }
        return { success: true, message: 'Cart cleared' }
    }
}

export const useClearCart = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: clearCart,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
        },
        onError: (error: any) => {
            console.error('Error clearing cart:', error)
            Alert.alert('Error', error?.message || 'Failed to clear cart. Please try again.')
        },
    })
}

export default useClearCart
