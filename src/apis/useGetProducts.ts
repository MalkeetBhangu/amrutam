import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from './ApiConstants'
import { GetProductsResponse, ProductItem } from 'src/types/ProductTypes'

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export interface FetchProductsParams {
    pageParam?: number
    limit?: number
    category?: string
    categories?: string[]
    search?: string
    sortBy?: string
    minPrice?: number
    maxPrice?: number
}

export const fetchProducts = async (filters: FetchProductsParams): Promise<GetProductsResponse> => {
    const page = filters.pageParam || 1
    const limit = filters.limit || 20
    let url = `${BASE_URL}/products?page=${page}&limit=${limit}`

    if (filters.category && filters.category !== 'All') {
        url += `&category=${encodeURIComponent(filters.category)}`
    }
    if (filters.categories && filters.categories.length > 0) {
        url += `&categories=${encodeURIComponent(filters.categories.join(','))}`
    }
    if (filters.search && filters.search.trim()) {
        url += `&search=${encodeURIComponent(filters.search.trim())}`
    }
    if (filters.sortBy) {
        url += `&sortBy=${encodeURIComponent(filters.sortBy)}`
    }
    if (filters.minPrice !== undefined) {
        url += `&minPrice=${filters.minPrice}`
    }
    if (filters.maxPrice !== undefined) {
        url += `&maxPrice=${filters.maxPrice}`
    }

    console.log('Fetching products URL:', url)

    const response = await fetch(url)
    const data = await response.json()
    return data
}

export interface UseGetProductsOptions {
    limit?: number
    category?: string
    categories?: string[]
    search?: string
    sortBy?: string
    minPrice?: number
    maxPrice?: number
}

export const useGetProducts = (filters?: UseGetProductsOptions) => {
    const queryResult = useInfiniteQuery<GetProductsResponse, Error, ProductItem[]>({
        queryKey: [
            QUERY_KEYS.PRODUCTS,
            {
                category: filters?.category || '',
                categories: filters?.categories || [],
                search: filters?.search || '',
                sortBy: filters?.sortBy || 'popularity',
                minPrice: filters?.minPrice ?? 0,
                maxPrice: filters?.maxPrice ?? 5000,
                limit: filters?.limit || 20,
            },
        ],
        queryFn: ({ pageParam = 1 }) =>
            fetchProducts({
                pageParam: pageParam as number,
                limit: filters?.limit || 20,
                category: filters?.category,
                categories: filters?.categories,
                search: filters?.search,
                sortBy: filters?.sortBy,
                minPrice: filters?.minPrice,
                maxPrice: filters?.maxPrice,
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
        select: (data) => {
            let items = data.pages.flatMap((page) => page.data || [])

            // Apply search filter fallback
            if (filters?.search && filters.search.trim()) {
                const q = filters.search.trim().toLowerCase()
                items = items.filter(item => {
                    const name = (item.name || '').toLowerCase()
                    const subtitle = (item.subtitle || '').toLowerCase()
                    const category = (item.category || '').toLowerCase()
                    const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : ''
                    return name.includes(q) || subtitle.includes(q) || category.includes(q) || tags.includes(q)
                })
            }

            // Apply categories filter
            if (filters?.categories && filters.categories.length > 0) {
                const selectedCats = filters.categories.map(c => c.toLowerCase().trim())
                items = items.filter(item => {
                    const itemCat = (item.category || '').toLowerCase()
                    const itemTags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : ''
                    const itemSubtitle = (item.subtitle || '').toLowerCase()
                    const itemCombined = `${itemCat} ${itemTags} ${itemSubtitle}`

                    return selectedCats.some(c => {
                        if (!c) return false
                        const firstWord = c.split(' ')[0]
                        return itemCombined.includes(c) || (firstWord && firstWord.length > 2 && itemCombined.includes(firstWord))
                    })
                })
            } else if (filters?.category && filters.category !== 'All') {
                const cat = filters.category.toLowerCase().trim()
                items = items.filter(item => {
                    const itemCat = (item.category || '').toLowerCase()
                    return itemCat.includes(cat) || cat.includes(itemCat)
                })
            }

            // Helper to get exact displayed numerical price matching ProductCard
            const getDisplayedPrice = (item: ProductItem): number => {
                const raw = item.price ?? item.discountPrice ?? 0
                if (typeof raw === 'number') return raw
                const num = parseFloat(String(raw).replace(/[^0-9.]/g, ''))
                return isNaN(num) ? 0 : num
            }

            // Apply price range filter
            if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
                const min = filters?.minPrice ?? 0
                const max = filters?.maxPrice ?? 5000
                items = items.filter(item => {
                    const price = getDisplayedPrice(item)
                    if (max >= 5000) {
                        return price >= min
                    }
                    return price >= min && price <= max
                })
            }

            // Apply sort
            if (filters?.sortBy) {
                items = [...items].sort((a, b) => {
                    const priceA = getDisplayedPrice(a)
                    const priceB = getDisplayedPrice(b)
                    const ratingA = Number(a.rating || 0)
                    const ratingB = Number(b.rating || 0)

                    switch (filters.sortBy) {
                        case 'price_low_high':
                            return priceA - priceB
                        case 'price_high_low':
                            return priceB - priceA
                        case 'rating':
                            return ratingB - ratingA
                        case 'popularity':
                        default:
                            return ratingB - ratingA
                    }
                })
            }

            return items
        },
        staleTime: 1000 * 60 * 10,
    })

    return {
        ...queryResult,
        products: queryResult.data || [],
    }
}

export default useGetProducts
