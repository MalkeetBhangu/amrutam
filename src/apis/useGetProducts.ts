import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { GetProductsResponse, ProductItem } from 'src/types/ProductTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface FetchProductsParams {
    pageParam?: number
    limit?: number
    category?: string
    search?: string
}

export const fetchProducts = async (filters: FetchProductsParams): Promise<GetProductsResponse> => {
    const page = filters.pageParam || 1
    const limit = filters.limit || 20
    let url = `${BASE_URL}/products?page=${page}&limit=${limit}`

    if (filters.category && filters.category !== 'All') {
        url += `&category=${encodeURIComponent(filters.category)}`
    }
    if (filters.search && filters.search.trim()) {
        url += `&search=${encodeURIComponent(filters.search.trim())}`
    }

    console.log('Fetching products URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    console.log('Fetching products response success:', data?.success, 'Count:', data?.data?.length || 0)

    return data
}

export interface UseGetProductsOptions {
    limit?: number
    category?: string
    search?: string
}

export const useGetProducts = (filters?: UseGetProductsOptions) => {
    const queryResult = useInfiniteQuery<GetProductsResponse, Error, ProductItem[]>({
        queryKey: [
            QUERY_KEYS.PRODUCTS,
            {
                category: filters?.category || '',
                search: filters?.search || '',
                limit: filters?.limit || 20,
            },
        ],
        queryFn: ({ pageParam = 1 }) =>
            fetchProducts({
                pageParam: pageParam as number,
                limit: filters?.limit || 20,
                category: filters?.category,
                search: filters?.search,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            const pagination = lastPage?.pagination
            if (pagination && pagination.hasNextPage && pagination.page < pagination.totalPages) {
                return pagination.page + 1
            }
            const currentPage = lastPage?.currentPage || lastPage?.page || 1
            const totalPages = lastPage?.totalPages || 1
            if (currentPage < totalPages) {
                return currentPage + 1
            }
            return undefined
        },
        select: (data) => data.pages.flatMap((page) => page.data || []),
        staleTime: 1000 * 60 * 10,
    })

    return {
        ...queryResult,
        products: queryResult.data || [],
    }
}

export default useGetProducts
