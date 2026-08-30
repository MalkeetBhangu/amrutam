import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { useQueryClient } from '@tanstack/react-query'
import DoctorHeader from './DoctorHeader'
import DoctorCard from './DoctorCard'
import DoctorCardSkeleton from './DoctorCardSkeleton'
import NoDoctorsFound from './NoDoctorsFound'
import DoctorFilterModal, { FilterState } from './DoctorFilterModal'
import colors from 'src/tokens/Colors'
import { useGetDoctors } from '@src/apis/useGetDoctors'
import useGetBookings from '@src/apis/useGetBookings'
import useCompleteBooking, { checkIfBookingTimePassed } from '@src/apis/useCompleteBooking'
import { QUERY_KEYS } from '@src/apis/ApiConstants'

const Doctors = () => {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
    const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(undefined)
    const [allExpertiseOptions, setAllExpertiseOptions] = useState<string[]>([])
    const [allLanguageOptions, setAllLanguageOptions] = useState<string[]>([])

    const { data: bookingsData } = useGetBookings()
    const { mutate: completeBooking } = useCompleteBooking()

    const allBookingsList = useMemo(() => {
        if (Array.isArray(bookingsData?.data?.bookings)) return bookingsData.data.bookings
        if (Array.isArray(bookingsData?.bookings)) return bookingsData.bookings
        if (Array.isArray(bookingsData?.data)) return bookingsData.data
        if (Array.isArray(bookingsData)) return bookingsData
        return []
    }, [bookingsData])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 400)
        return () => clearTimeout(handler)
    }, [searchQuery])

    const apiFilters = useMemo(
        () => ({
            search: debouncedSearchQuery,
            expertise: activeFilters?.expertise,
            gender: activeFilters?.gender,
            language: activeFilters?.languages,
            maxConsultationFee: activeFilters?.maxFee,
        }),
        [debouncedSearchQuery, activeFilters]
    )

    const { doctors, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, refetch } = useGetDoctors(apiFilters)

    const firstUpcomingBooking = useMemo(() => {
        if (!bookingsData) return null

        let list: any[] = []
        if (Array.isArray(bookingsData?.data?.bookings)) {
            list = bookingsData.data.bookings
        } else if (Array.isArray(bookingsData?.bookings)) {
            list = bookingsData.bookings
        } else if (Array.isArray(bookingsData?.data)) {
            list = bookingsData.data
        } else if (Array.isArray(bookingsData)) {
            list = bookingsData
        } else if (bookingsData?.data && typeof bookingsData.data === 'object') {
            list = [bookingsData.data]
        }

        const activeBooking = list.find((b: any) => {
            if (!b) return false
            const isCancelledOrCompleted =
                b.status === 'cancelled' ||
                b.status === 'completed' ||
                b.booked === false ||
                b.slot?.booked === false ||
                b.slot?.status === 'cancelled' ||
                b.slot?.status === 'completed' ||
                checkIfBookingTimePassed(b.date, b.slot)

            if (isCancelledOrCompleted) {
                return false
            }
            return Boolean(b.doctorId || b.doctorName || b.doctor || b.slot)
        })

        if (!activeBooking) return null

        const matchedDoctor: any = Array.isArray(doctors)
            ? doctors.find((d: any) => d.id === activeBooking.doctorId || d._id === activeBooking.doctorId)
            : null

        if (matchedDoctor) {
            return {
                ...activeBooking,
                doctor: matchedDoctor,
                specialization:
                    activeBooking.specialization ||
                    activeBooking.specialty ||
                    matchedDoctor.specialization ||
                    matchedDoctor.specialty ||
                    matchedDoctor.category,
            }
        }

        return activeBooking
    }, [bookingsData, doctors])

    useEffect(() => {
        if (bookingsData) {
            let list: any[] = []
            if (Array.isArray(bookingsData?.data?.bookings)) list = bookingsData.data.bookings
            else if (Array.isArray(bookingsData?.bookings)) list = bookingsData.bookings
            else if (Array.isArray(bookingsData?.data)) list = bookingsData.data

            list.forEach((b: any) => {
                if (b && b.status !== 'completed' && b.status !== 'cancelled' && checkIfBookingTimePassed(b.date, b.slot)) {
                    console.log('Auto-completing past booking:', b)
                    completeBooking({
                        doctorId: b.doctorId || b.doctor?.id || '',
                        date: b.date || '',
                        slotId: b.slot?.id || b.slotId || '',
                    })
                }
            })
        }
    }, [bookingsData, completeBooking])

    useEffect(() => {
        if (doctors && doctors.length > 0) {
            setAllExpertiseOptions((prev) => {
                const set = new Set(prev)
                doctors.forEach((d: any) => {
                    const spec = d?.specialization || d?.specialty || d?.category
                    if (spec) set.add(spec)
                })
                return Array.from(set)
            })

            setAllLanguageOptions((prev) => {
                const set = new Set(prev)
                doctors.forEach((d: any) => {
                    if (Array.isArray(d?.languages)) {
                        d.languages.forEach((lang: string) => {
                            if (lang) set.add(lang)
                        })
                    } else if (typeof d?.languages === 'string' && d.languages) {
                        set.add(d.languages)
                    }
                })
                return Array.from(set)
            })
        }
    }, [doctors])


    const handleOpenFilter = useCallback(() => {
        setIsFilterModalVisible(true)
    }, [])

    const handleCloseFilter = useCallback(() => {
        setIsFilterModalVisible(false)
    }, [])

    const handleApplyFilters = useCallback((filters: FilterState) => {
        const isEmpty =
            (!filters.expertise || filters.expertise.length === 0) &&
            (!filters.languages || filters.languages.length === 0) &&
            (!filters.gender || filters.gender.trim() === '') &&
            (filters.maxFee === undefined || filters.maxFee >= 2000)

        if (isEmpty) setActiveFilters(undefined)
        else setActiveFilters(filters)
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
        refetch()
    }, [queryClient, refetch])

    const handleClearAllFilters = useCallback(() => {
        setSearchQuery('')
        setActiveFilters(undefined)
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
        refetch()
    }, [queryClient, refetch])

    const handleGoBack = useCallback(() => {
        setSearchQuery('')
        setActiveFilters(undefined)
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DOCTORS] })
        refetch()
    }, [queryClient, refetch])

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const keyExtractor = useCallback((item: any, index: number) => item.id || item._id || String(index), [])

    const renderItem = useCallback(({ item }: { item: any }) => (
        <DoctorCard doctor={item} />
    ), [])

    const renderFooter = useCallback(() => {
        if (!isFetchingNextPage) return null
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.darkGreen} />
            </View>
        )
    }, [isFetchingNextPage])

    const showSkeleton = isLoading || (isFetching && doctors.length === 0)

    return (
        <View style={styles.container}>
            <FlatList
                data={showSkeleton ? [1, 2, 3] : doctors}
                keyExtractor={showSkeleton ? (item) => String(item) : keyExtractor}
                renderItem={showSkeleton ? () => <DoctorCardSkeleton /> : renderItem}
                ListHeaderComponent={<DoctorHeader onFilterPress={handleOpenFilter} searchQuery={searchQuery} onSearchChange={setSearchQuery} upcomingBooking={firstUpcomingBooking} allBookings={allBookingsList} />}
                ListEmptyComponent={showSkeleton ? null : <NoDoctorsFound onClearFilters={handleClearAllFilters} onGoBack={handleGoBack} />}
                ListFooterComponent={showSkeleton || doctors.length === 0 ? null : renderFooter}
                onEndReached={showSkeleton || doctors.length === 0 ? undefined : handleLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={6}
                maxToRenderPerBatch={10}
                windowSize={10}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <DoctorFilterModal
                visible={isFilterModalVisible}
                onClose={handleCloseFilter}
                onApply={handleApplyFilters}
                initialFilters={activeFilters}
                expertiseOptions={allExpertiseOptions}
                languageOptions={allLanguageOptions}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    footerLoader: {
        paddingBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default Doctors