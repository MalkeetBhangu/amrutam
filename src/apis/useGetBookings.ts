import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { BookingItem } from 'src/types/DoctorTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface GetBookingsResponse {
    success: boolean
    data?: BookingItem[] | any
    bookings?: BookingItem[]
}

export const fetchBookings = async (): Promise<GetBookingsResponse> => {
    const url = `${BASE_URL}/bookings`
    console.log('Fetching bookings URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    console.log('Fetching bookings response:', JSON.stringify(data, null, 2))

    return data
}

export const useGetBookings = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.BOOKINGS],
        queryFn: fetchBookings,
        staleTime: 0,
    })
}

export default useGetBookings
