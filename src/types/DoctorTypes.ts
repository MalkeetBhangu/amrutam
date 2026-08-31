export interface DoctorSlot {
    time: string
    status: 'available' | 'booked' | string
}

export interface Doctor {
    id: string
    name: string
    image: string
    specialization: string
    category: string
    experience: number
    rating: number
    reviewCount: number
    languages: string[]
    consultationFee: number
    about: string
    location: string
    availableToday: boolean
    verified: boolean
    consultationDuration: number
    hasBooking?: boolean
}

export interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage?: boolean
}

export interface GetDoctorsResponse {
    success: boolean
    data: Doctor[]
    upcomingConsultation: BookingItem | null
    pagination?: PaginationInfo
}

export interface SlotItem {
    id: string
    startTime: string
    endTime: string
    available: boolean
}

export interface DateSlotGroup {
    date: string
    slots: SlotItem[]
}

export interface BookingItem {
    doctorId: string
    doctorName?: string
    doctorImage?: string
    specialization?: string
    date: string
    slot: {
        id: string
        startTime: string
        endTime: string
        available?: boolean
        booked?: boolean
        status?: string
    }
}

export interface DoctorSlotsRangeData {
    userId: string
    doctorId: string
    doctorName: string
    from?: string
    to?: string
    date?: string
    dates?: DateSlotGroup[]
    slots?: SlotItem[]
    bookings?: BookingItem[]
    hasBooking?: boolean
}

export interface GetDoctorSlotsRangeResponse {
    success: boolean
    data: DoctorSlotsRangeData
}

