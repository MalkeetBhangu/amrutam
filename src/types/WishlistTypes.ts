import { ProductItem } from './ProductTypes'

export interface WishlistItem extends ProductItem {
    addedAt?: string
}

export interface WishlistData {
    userId?: string
    items?: WishlistItem[]
    totalItems?: number
}

export interface GetWishlistResponse {
    success: boolean
    message?: string
    data?: WishlistData
}
