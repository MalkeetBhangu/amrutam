
import { GetDoctorSlotsRangeResponse } from "@src/types/DoctorTypes"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./ApiConstants"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface BookSlotPayload {
    doctorId: string
    date: string
    slotId: string
}

const fetchBookSlot = async (payload: BookSlotPayload) => {
    const url = `${BASE_URL}/doctors/slots/book`
    console.log('Booking slot URL:', url, 'Payload:', payload)

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })
    const data = await response.json()
    return data
}

const useBookSlot = (defaultDoctorId?: string, defaultDate?: string, defaultSlotId?: string) => {
    const queryClient = useQueryClient()
    const queryResult = useMutation<GetDoctorSlotsRangeResponse, Error, BookSlotPayload | void>({
        mutationFn: (payload?: BookSlotPayload | void) => {
            const finalPayload: BookSlotPayload = {
                doctorId: payload?.doctorId || defaultDoctorId || '',
                date: payload?.date || defaultDate || '',
                slotId: payload?.slotId || defaultSlotId || '',
            }
            return fetchBookSlot(finalPayload)
        },
        mutationKey: [QUERY_KEYS.BOOK_SLOTS, defaultDoctorId, defaultDate, defaultSlotId],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS_SLOTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] })
        },
    })
    return queryResult
}

export default useBookSlot