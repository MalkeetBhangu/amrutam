export interface ProductItem {
    id: string
    name: string
    subtitle?: string
    slug?: string
    category?: string
    form?: string
    brand?: string
    variant?: string
    price: number
    discountPrice?: number
    discountPercent?: number
    rating?: number
    reviewsCount?: number
    stock?: number
    inStock?: boolean
    badge?: string
    tags?: string[]
    size?: string
    weight?: string
    description?: string
    isWishlisted?: boolean
    image?: string | null
    createdAt?: string
}

export interface GetProductsResponse {
    success: boolean
    data: ProductItem[]
    totalProducts?: number
    totalPages?: number
    currentPage?: number
}
