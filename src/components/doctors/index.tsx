import React, { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import { useGetDoctors } from '@src/apis/useGetDoctors'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import colors from 'src/tokens/Colors'
import DoctorCard from './DoctorCard'
import DoctorCardSkeleton from './DoctorCardSkeleton'
import type { FilterState, DoctorFilterModalRef } from './DoctorFilterModal'
import DoctorHeader from './DoctorHeader'
import NoDoctorsFound from './NoDoctorsFound'

const DoctorFilterModal = lazy(() => import('./DoctorFilterModal'))

const Doctors = () => {
    const filterModalRef = useRef<DoctorFilterModalRef>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(undefined)

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

    const { doctors, upcomingConsultation, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useGetDoctors(apiFilters)

    const handleOpenFilter = useCallback(() => filterModalRef.current?.open(), [])
    const handleResetFilters = useCallback(() => {
        setSearchQuery('')
        setActiveFilters(undefined)
    }, [])

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const showSkeleton = isLoading || (isFetching && doctors.length === 0)

    const keyExtractor = useCallback((item: any, index: number) => String(item?.id || index), [])

    const renderItem = useCallback(
        ({ item }: { item: any }) => (showSkeleton ? <DoctorCardSkeleton /> : <DoctorCard doctor={item} />),
        [showSkeleton]
    )

    const renderFooter = useCallback(() => {
        if (!isFetchingNextPage) return null
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.darkGreen} />
            </View>
        )
    }, [isFetchingNextPage])

    return (
        <View style={styles.container}>
            <FlatList
                data={(showSkeleton ? [1, 2, 3] : doctors) as any}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={<DoctorHeader onFilterPress={handleOpenFilter} searchQuery={searchQuery} onSearchChange={setSearchQuery} upcomingBooking={upcomingConsultation} />}
                ListEmptyComponent={showSkeleton ? null : <NoDoctorsFound onClearFilters={handleResetFilters} onGoBack={handleResetFilters} />}
                ListFooterComponent={showSkeleton || doctors.length === 0 ? null : renderFooter}
                onEndReached={showSkeleton || doctors.length === 0 ? undefined : handleLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={6}
                maxToRenderPerBatch={10}
                windowSize={10}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <Suspense fallback={null}>
                <DoctorFilterModal ref={filterModalRef} activeFilters={activeFilters} onApplyFilters={setActiveFilters} />
            </Suspense>
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

export default React.memo(Doctors)