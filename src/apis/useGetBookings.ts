import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { BookingItem } from 'src/types/DoctorTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface GetBookingsResponse {
    success: boolean
    data?: BookingItem[] | any
    bookings?: BookingItem[]
}

export const fetchBookings = async ({ queryKey }: any): Promise<GetBookingsResponse> => {
    const [_, userId] = queryKey
    const url = `${BASE_URL}/bookings?userId=${userId}`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export const useGetBookings = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.BOOKINGS, userId],
        queryFn: fetchBookings,
        enabled: Boolean(userId),
        staleTime: 0,
    })
}

export default useGetBookings
