export interface CartItem {
    id: string
    productId?: string
    name: string
    variant?: string
    size?: string
    price: number
    quantity: number
    image?: string | null
}

export interface CartSummary {
    subtotal: number
    deliveryFee: number
    taxes: number
    total: number
    totalItems: number
}

export interface GetCartResponse {
    success: boolean
    data: {
        items?: CartItem[]
        summary?: CartSummary
        userId?: string
        subtotal?: number
        deliveryFee?: number
        taxes?: number
        total?: number
    } | CartItem[] | any
}
