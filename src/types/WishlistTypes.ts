import { ProductItem } from './ProductTypes'

export interface WishlistItem extends ProductItem {
    addedAt?: string
}

export interface GetWishlistResponse {
    success: boolean
    message?: string
    data?: WishlistItem[] | {
        userId?: string
        items?: WishlistItem[]
        totalItems?: number
    }
}
