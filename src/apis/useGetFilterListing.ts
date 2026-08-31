import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface ConsultationFeeRange {
    min: number
    max: number
}

export interface DoctorFilterListingData {
    expertise: string[]
    languages: string[]
    gender: string[]
    consultationFeeRange: ConsultationFeeRange
}

export interface FilterListingResponse {
    success: boolean
    data: DoctorFilterListingData
}

export const fetchFilterListing = async (
    filterType: 'doctors' | 'products' = 'doctors'
): Promise<FilterListingResponse> => {
    const url = `${BASE_URL}/filter-listing?filterType=${filterType}`
    console.log('Fetching filter listing URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    console.log('Filter listing response:', JSON.stringify(data, null, 2))

    return data
}

export const useGetFilterListing = (filterType: 'doctors' | 'products' = 'doctors') => {
    return useQuery<FilterListingResponse, Error>({
        queryKey: [QUERY_KEYS.FILTER_LISTING, filterType],
        queryFn: () => fetchFilterListing(filterType),
        staleTime: 1000 * 60 * 60,
    })
}

export default useGetFilterListing
