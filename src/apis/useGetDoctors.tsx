import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { GetDoctorsResponse, Doctor } from 'src/types/DoctorTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface FetchDoctorsParams {
    pageParam?: number
    search?: string
    expertise?: string[]
    gender?: string
    language?: string[]
    minConsultationFee?: number
    maxConsultationFee?: number
}

export const buildDoctorsQueryParams = (filters: FetchDoctorsParams): URLSearchParams => {
    const params = new URLSearchParams()
    params.append('page', String(filters.pageParam || 1))
    params.append('limit', '20')

    if (filters.search && filters.search.trim()) {
        params.append('search', filters.search.trim())
    }
    if (filters.expertise && filters.expertise.length > 0) {
        params.append('expertise', filters.expertise.join(','))
    }
    if (filters.gender && filters.gender.trim()) {
        params.append('gender', filters.gender.trim())
    }
    if (filters.language && filters.language.length > 0) {
        params.append('language', filters.language.join(','))
    }
    if (filters.minConsultationFee !== undefined && filters.minConsultationFee > 0) {
        params.append('minConsultationFee', String(filters.minConsultationFee))
    }
    if (filters.maxConsultationFee !== undefined && filters.maxConsultationFee < 2000) {
        params.append('maxConsultationFee', String(filters.maxConsultationFee))
    }

    return params
}

export const fetchDoctors = async (filterParams: FetchDoctorsParams): Promise<GetDoctorsResponse> => {
    const params = buildDoctorsQueryParams(filterParams)
    const url = `${BASE_URL}/doctors?${params.toString()}`
    console.log('Fetching doctors URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    return data
}

export interface UseGetDoctorsOptions {
    search?: string
    expertise?: string[]
    gender?: string
    language?: string[]
    minConsultationFee?: number
    maxConsultationFee?: number
}

export const useGetDoctors = (filters?: UseGetDoctorsOptions) => {
    const queryResult = useInfiniteQuery<GetDoctorsResponse, Error, Doctor[]>({
        queryKey: [
            QUERY_KEYS.DOCTORS,
            {
                search: filters?.search || '',
                expertise: filters?.expertise || [],
                gender: filters?.gender || '',
                language: filters?.language || [],
                minConsultationFee: filters?.minConsultationFee,
                maxConsultationFee: filters?.maxConsultationFee,
            },
        ],
        queryFn: ({ pageParam = 1 }) =>
            fetchDoctors({
                pageParam: pageParam as number,
                search: filters?.search,
                expertise: filters?.expertise,
                gender: filters?.gender,
                language: filters?.language,
                minConsultationFee: filters?.minConsultationFee,
                maxConsultationFee: filters?.maxConsultationFee,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage?.pagination
            if (pagination && pagination.hasNextPage && pagination.page < pagination.totalPages) {
                return pagination.page + 1
            }
            return undefined
        },
        select: (data) => data.pages.flatMap((page) => page.data || []),
        staleTime: 1000 * 60 * 60,
    })

    return {
        ...queryResult,
        doctors: queryResult.data || [],
    }
}
