import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./ApiConstants"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface CancelBookingPayload {
    doctorId: string
    slotId: string
    date?: string
}

const fetchCancelBooking = async (payload: CancelBookingPayload) => {
    const url = `${BASE_URL}/doctors/slots/cancel`
    const bodyObj = {
        doctorId: payload.doctorId || '',
        date: payload.date || '',
        slotId: payload.slotId || '',
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyObj),
    })
    const data = await response.json()
    return data
}

const useCancelBooking = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CancelBookingPayload) => fetchCancelBooking(payload),
        mutationKey: ['CANCEL_BOOKING'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS_SLOTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] })
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.BOOKINGS] })
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
        },
    })
}

export default useCancelBooking
