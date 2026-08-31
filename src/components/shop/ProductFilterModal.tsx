import { cross as CrossIcon } from 'assets'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'
import useGetFilterListing from 'src/apis/useGetFilterListing'
import PriceRangeSlider from './PriceRangeSlider'

export interface FilterState {
    sortBy: string
    categories: string[]
    minPrice: number
    maxPrice: number
}

export interface ProductFilterModalRef {
    open: () => void
    close: () => void
}

export interface ProductFilterModalProps {
    activeFilters?: FilterState
    onApplyFilters: (filters: FilterState | undefined) => void
}

const ProductFilterModal = forwardRef<ProductFilterModalRef, ProductFilterModalProps>(
    ({ activeFilters, onApplyFilters }, ref) => {
        const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
        const [visible, setVisible] = useState(false)
        const t = getTexts(languageCode)
        const filterTranslations = t.shop?.filterModal || {}
        const { data: filterListingData } = useGetFilterListing('products')
        const apiData = filterListingData?.data
        const minPriceLimit = apiData?.priceRange?.min ?? 0
        const maxPriceLimit = apiData?.priceRange?.max ?? 2500
        const [sortBy, setSortBy] = useState<string>(activeFilters?.sortBy || '')
        const [categories, setCategories] = useState<string[]>(activeFilters?.categories || [])
        const [minPrice, setMinPrice] = useState<number>(activeFilters?.minPrice || minPriceLimit)
        const [maxPrice, setMaxPrice] = useState<number>(activeFilters?.maxPrice || maxPriceLimit)

        useImperativeHandle(ref, () => ({
            open: () => setVisible(true),
            close: () => setVisible(false),
        }))

        useEffect(() => {
            if (visible) {
                setSortBy(activeFilters?.sortBy || '')
                setCategories(activeFilters?.categories || [])
                setMinPrice(activeFilters?.minPrice ?? minPriceLimit)
                setMaxPrice(activeFilters?.maxPrice ?? maxPriceLimit)
            }
        }, [visible, activeFilters, minPriceLimit, maxPriceLimit])

        const handleClose = () => setVisible(false)

        const handleClearAll = useCallback(() => {
            setSortBy('')
            setCategories([])
            setMinPrice(minPriceLimit)
            setMaxPrice(maxPriceLimit)
            onApplyFilters(undefined)
            setVisible(false)
        }, [minPriceLimit, maxPriceLimit, onApplyFilters])

        const handleToggleCategory = useCallback((catId: string) => {
            setCategories((prev) => {
                if (prev.includes(catId)) {
                    return prev.filter((c) => c !== catId)
                } else {
                    return [...prev, catId]
                }
            })
        }, [])

        const handlePriceChange = useCallback((minVal: number, maxVal: number) => {
            setMinPrice(minVal)
            setMaxPrice(maxVal)
        }, [])

        const handleApply = useCallback(() => {
            onApplyFilters({ sortBy, categories, minPrice, maxPrice, })
            setVisible(false)
        }, [sortBy, categories, minPrice, maxPrice, minPriceLimit, maxPriceLimit, onApplyFilters])

        return (
            <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose} >
                <View style={styles.overlayContainer}>
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View style={styles.backdrop} />
                    </TouchableWithoutFeedback>
                    <View style={styles.sheetContainer}>
                        <View style={styles.handleContainer}>
                            <View style={styles.handlePill} />
                        </View>
                        <View style={styles.headerRow}>
                            <Pressable onPress={handleClose} style={styles.closeButton} hitSlop={10}>
                                <CrossIcon width={getHeight(18)} height={getHeight(18)} color={colors.textDark} />
                            </Pressable>
                            <TextView text={filterTranslations.title} style={styles.headerTitle} />
                            <Pressable onPress={handleClearAll} hitSlop={10}>
                                <TextView text={filterTranslations.clearAll} style={styles.clearAllText} />
                            </Pressable>
                        </View>

                        <View style={styles.headerDivider} />
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} >
                            <View style={styles.section}>
                                <TextView text={filterTranslations.sortBy} style={styles.sectionTitle} />
                                <View style={styles.chipsWrap}>
                                    {apiData?.sortBy?.map((opt) => {
                                        const isSelected = sortBy === opt.key
                                        return (
                                            <Pressable key={opt.key} style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected,]} onPress={() => setSortBy(opt.key)} >
                                                <TextView text={opt.label} style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected,]} />
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.section}>
                                <TextView text={filterTranslations.categories} style={styles.sectionTitle} />
                                <View style={styles.chipsWrap}>
                                    {apiData?.categories?.map((cat) => {
                                        const isSelected = categories.includes(cat)
                                        return (
                                            <Pressable key={cat} style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected,]} onPress={() => handleToggleCategory(cat)} >
                                                <View style={styles.chipRow}>
                                                    {isSelected && (<TextView text="✓ " style={styles.checkmarkText} />)}
                                                    <TextView text={cat} style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected,]} />
                                                </View>
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.section}>
                                <View style={styles.priceHeaderRow}>
                                    <TextView text={filterTranslations.priceRange} style={styles.sectionTitle} />
                                    <TextView text={`₹${minPrice} - ₹${maxPrice >= maxPriceLimit ? `${maxPriceLimit}+` : maxPrice}`} style={styles.priceRangeValueText} />
                                </View>

                                <PriceRangeSlider min={minPriceLimit} max={maxPriceLimit} step={100} minValue={minPrice} maxValue={maxPrice} onValueChange={handlePriceChange} />
                            </View>
                        </ScrollView>

                        <View style={styles.footerContainer}>
                            <Pressable style={styles.applyButton} onPress={handleApply}>
                                <TextView text={filterTranslations.applyFilters} style={styles.applyButtonText} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    })

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.modalOverlayBg,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sheetContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '85%',
        paddingBottom: 20,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    handlePill: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.handlePillBg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 14,
        paddingTop: 4,
    },
    closeButton: {
        width: 32,
        height: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: getHeight(18),
        fontWeight: '600',
        color: colors.textDark,
        textAlign: 'center',
    },
    clearAllText: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.darkGreen,
        textAlign: 'right',
        minWidth: 60,
    },
    headerDivider: {
        height: 1,
        backgroundColor: colors.dividerBg,
        marginBottom: 8,
    },
    scrollContent: {
        paddingHorizontal: 22,
        paddingBottom: 10,
    },
    section: {
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 12,
    },
    categorySearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.searchBg,
        borderRadius: getHeight(12),
        paddingHorizontal: 12,
        height: getHeight(40),
        marginBottom: 12,
    },
    categorySearchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: getHeight(13),
        color: colors.textDark,
        paddingVertical: 0,
    },
    noCategoriesText: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: getHeight(20),
        marginHorizontal: 4,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipSelected: {
        backgroundColor: colors.darkGreen,
    },
    chipUnselected: {
        backgroundColor: colors.pillBg,
    },
    chipText: {
        fontSize: getHeight(10),
        fontWeight: '600',
    },
    chipTextSelected: {
        color: colors.white,
    },
    chipTextUnselected: {
        color: colors.textDark,
    },
    checkmarkText: {
        fontSize: getHeight(14),
        fontWeight: '700',
        color: colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dividerBg,
        marginVertical: 6,
    },
    priceHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    priceRangeValueText: {
        fontSize: getHeight(15),
        fontWeight: '700',
        color: colors.darkGreen,
    },
    footerContainer: {
        paddingHorizontal: 22,
        paddingTop: 10,
    },
    applyButton: {
        backgroundColor: colors.darkGreen,
        height: getHeight(50),
        borderRadius: getHeight(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyButtonText: {
        color: colors.white,
        fontSize: getHeight(16),
        fontWeight: '700',
    },
})

export default React.memo(ProductFilterModal)
