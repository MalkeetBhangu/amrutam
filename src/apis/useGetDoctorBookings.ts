import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./ApiConstants"
import { GetDoctorBookingsResponse } from "@src/types/DoctorTypes"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

const getDoctorBookings = async ({ queryKey }: any): Promise<GetDoctorBookingsResponse> => {
    const [_, doctorId, userId] = queryKey
    const url = `${BASE_URL}/doctors/${doctorId}/bookings?userId=${userId}`

    const response = await fetch(url)
    const data = await response.json()
    console.log("Doctor bookings response:", JSON.stringify(data))

    return data
}

const useGetDoctorBookings = (doctorId: string, userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.DOCTOR_BOOKINGS, doctorId, userId],
        queryFn: getDoctorBookings,
        enabled: Boolean(doctorId && userId),
        staleTime: 0,
    })
}

export default useGetDoctorBookings
