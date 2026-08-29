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
    slots: DoctorSlot[]
}

export interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
}

export interface GetDoctorsResponse {
    success: boolean
    data: Doctor[]
    pagination?: PaginationInfo
}
