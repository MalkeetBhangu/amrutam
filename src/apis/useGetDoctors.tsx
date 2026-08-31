import { useMemo } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { GetDoctorsResponse, Doctor, BookingItem } from 'src/types/DoctorTypes'
import { useUserState } from '@src/store/UseUserStore'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface FetchDoctorsParams {
    userId: string
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
    params.append('userId', filters.userId)
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
    console.log("j", JSON.stringify(data, null, 2))
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
    const { userData: { userId } } = useUserState(['userId'])
    const queryResult = useInfiniteQuery<GetDoctorsResponse, Error>({
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
                userId: userId || ''
            }),
        enabled: !!userId,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const pagination = lastPage?.pagination
            if (pagination && pagination.hasNextPage && pagination.page < pagination.totalPages) {
                return pagination.page + 1
            }
            return undefined
        },
        staleTime: 1000 * 60 * 60,
    })

    const doctors: Doctor[] = useMemo(
        () => queryResult.data?.pages.flatMap((page) => page.data || []) || [],
        [queryResult.data]
    )

    const upcomingConsultation: BookingItem | null =
        queryResult.data?.pages?.[0]?.upcomingConsultation ?? null

    return {
        ...queryResult,
        doctors,
        upcomingConsultation,
    }
}
