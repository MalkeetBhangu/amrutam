import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "./ApiConstants"
import { GetDoctorSlotsRangeResponse } from "@src/types/DoctorTypes"

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

const getSlots = async ({ queryKey }: any): Promise<GetDoctorSlotsRangeResponse> => {
    const [_, doctorId, fromDate, toDate] = queryKey
    const url = `${BASE_URL}/doctors/${doctorId}/slots/range?from=${fromDate}&to=${toDate}`

    const response = await fetch(url)
    const data = await response.json()
    console.log("khskdhfkjhsdkf", JSON.stringify(data))

    return data
}

const useGetDoctorSlots = (doctorId: string, fromDate: string, toDate: string) => {

    return useQuery({
        queryKey: [QUERY_KEYS.DOCTORS_SLOTS, doctorId, fromDate, toDate],
        queryFn: getSlots,
        staleTime: 1000 * 60 * 60,
    })


}

export default useGetDoctorSlots