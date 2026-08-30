import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "./ApiConstants"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface CompleteBookingPayload {
    doctorId: string
    date: string
    slotId: string
}

const fetchCompleteBooking = async (payload: CompleteBookingPayload) => {
    const url = `${BASE_URL}/bookings/complete`
    console.log('Completing booking URL:', url, 'Payload:', payload)

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            doctorId: payload.doctorId,
            date: payload.date,
            slotId: payload.slotId,
        }),
    })
    const data = await response.json()
    console.log('Complete booking response:', JSON.stringify(data, null, 2))
    return data
}

export const checkIfBookingTimePassed = (dateStr?: string, slot?: any): boolean => {
    if (!dateStr) return false

    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    // If date is before today (e.g. yesterday)
    if (dateStr < todayStr) {
        return true
    }

    // If date is today, check if current time is past slot start time
    if (dateStr === todayStr) {
        let timeStr = ''
        if (typeof slot === 'string') {
            timeStr = slot
        } else if (slot && typeof slot === 'object') {
            timeStr = slot.startTime || slot.time || slot.endTime || slot.id || slot.slotId || ''
        }

        if (!timeStr) return false

        let slotHours = 0
        let slotMinutes = 0

        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            const [timePart, modifier] = timeStr.trim().split(' ')
            if (timePart) {
                const [h, m] = timePart.split(':').map(Number)
                slotHours = h || 0
                slotMinutes = m || 0
                if (modifier === 'PM' && slotHours < 12) slotHours += 12
                if (modifier === 'AM' && slotHours === 12) slotHours = 0
            }
        } else if (timeStr.includes(':')) {
            const parts = timeStr.trim().split(':')
            slotHours = parseInt(parts[0], 10) || 0
            slotMinutes = parseInt(parts[1], 10) || 0
        } else {
            // Fallback for slot IDs like 'doctor_0001-20260830-1630' or '1630'
            const parts = timeStr.split('-')
            const lastPart = parts[parts.length - 1]
            if (lastPart && lastPart.length === 4 && !isNaN(Number(lastPart))) {
                slotHours = parseInt(lastPart.slice(0, 2), 10) || 0
                slotMinutes = parseInt(lastPart.slice(2), 10) || 0
            }
        }

        const currentHours = now.getHours()
        const currentMinutes = now.getMinutes()

        if (currentHours > slotHours || (currentHours === slotHours && currentMinutes >= slotMinutes)) {
            return true
        }
    }

    return false
}

const useCompleteBooking = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CompleteBookingPayload) => fetchCompleteBooking(payload),
        mutationKey: ['COMPLETE_BOOKING'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS_SLOTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKINGS] })
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.BOOKINGS] })
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
            queryClient.refetchQueries({ queryKey: [QUERY_KEYS.DOCTORS_SLOTS] })
        },
    })
}

export default useCompleteBooking
