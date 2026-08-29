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
import { QUERY_KEYS } from '@src/apis/ApiConstants'

const Doctors = () => {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)
    const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(undefined)
    const [allExpertiseOptions, setAllExpertiseOptions] = useState<string[]>([])
    const [allLanguageOptions, setAllLanguageOptions] = useState<string[]>([])

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

    const handleBookSlot = useCallback((doctor: any) => {
        console.log('Book slot pressed for:', doctor?.name)
    }, [])

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
        <DoctorCard doctor={item} onBookSlotPress={handleBookSlot} />
    ), [handleBookSlot])

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
                ListHeaderComponent={<DoctorHeader onFilterPress={handleOpenFilter} searchQuery={searchQuery} onSearchChange={setSearchQuery} />}
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