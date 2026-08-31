import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface UpdateCartQuantityPayload {
    userId?: string
    productId: string
    quantity: number
}

export const updateCartQuantity = async (payload: UpdateCartQuantityPayload) => {
    const url = `${BASE_URL}/cart/update`
    const bodyData = {
        userId: payload.userId,
        productId: payload.productId,
        quantity: payload.quantity,
    }

    console.log('Update cart quantity API URL:', url, 'Payload:', bodyData)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
        throw new Error('Failed to update cart quantity')
    }

    const data = await response.json()
    console.log('Update cart quantity response:', data)

    if (data.success === false) {
        throw new Error(data.message || 'Failed to update cart quantity')
    }

    return data
}

export const useUpdateCartQuantity = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: updateCartQuantity,
        onSuccess: (data) => {
            console.log('Successfully updated cart quantity:', data)
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
        },
        onError: (error: any) => {
            console.error('Error updating cart quantity:', error)
            Alert.alert('Error', error?.message || 'Failed to update cart quantity. Please try again.')
        },
    })
}

export default useUpdateCartQuantity
