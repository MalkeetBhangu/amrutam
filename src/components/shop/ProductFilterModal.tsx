import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Modal,
    Pressable,
    ScrollView,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native'
import { cross as CrossIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import PriceRangeSlider from './PriceRangeSlider'

export interface FilterState {
    sortBy: string
    categories: string[]
    minPrice: number
    maxPrice: number
}

export interface ProductFilterModalProps {
    visible: boolean
    onClose: () => void
    initialFilters?: FilterState
    availableCategories?: string[]
    onApplyFilters: (filters: FilterState) => void
}

const DEFAULT_CATEGORIES = [
    'Hair Care',
    'Skin Care',
    'Immunity',
    'Digestion',
    'Wellness',
    'Ayurvedic Oils',
    'Malts & Powders',
    'Personal Care',
    'Juices & Syrups',
    'Bundles & Kits',
]

const DEFAULT_FILTERS: FilterState = {
    sortBy: 'popularity',
    categories: [],
    minPrice: 0,
    maxPrice: 5000,
}

const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
    visible,
    onClose,
    initialFilters = DEFAULT_FILTERS,
    availableCategories,
    onApplyFilters,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const filterTranslations = (t as any)?.shop?.filterModal || {}

    const sortOptions = useMemo(
        () => [
            { id: 'popularity', label: filterTranslations.popularity },
            { id: 'price_low_high', label: filterTranslations.priceLowToHigh },
            { id: 'price_high_low', label: filterTranslations.priceHighToLow },
            { id: 'rating', label: filterTranslations.rating },
        ],
        [filterTranslations]
    )

    const categoryOptions = useMemo(() => {
        const list = availableCategories && availableCategories.length > 0 ? availableCategories : DEFAULT_CATEGORIES
        return list.map((cat) => ({ id: cat, label: cat }))
    }, [availableCategories])

    const [sortBy, setSortBy] = useState<string>(initialFilters.sortBy || 'popularity')
    const [categories, setCategories] = useState<string[]>(initialFilters.categories || [])
    const [minPrice, setMinPrice] = useState<number>(initialFilters.minPrice ?? 0)
    const [maxPrice, setMaxPrice] = useState<number>(initialFilters.maxPrice ?? 5000)

    useEffect(() => {
        if (visible) {
            setSortBy(initialFilters.sortBy || 'popularity')
            setCategories(initialFilters.categories || [])
            setMinPrice(initialFilters.minPrice ?? 0)
            setMaxPrice(initialFilters.maxPrice ?? 5000)
        }
    }, [visible, initialFilters])

    const handleClearAll = useCallback(() => {
        setSortBy('popularity')
        setCategories([])
        setMinPrice(0)
        setMaxPrice(5000)
    }, [])

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
        onApplyFilters({
            sortBy,
            categories,
            minPrice,
            maxPrice,
        })
        onClose()
    }, [sortBy, categories, minPrice, maxPrice, onApplyFilters, onClose])

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlayContainer}>
                {/* Backdrop press to dismiss */}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                {/* Bottom Sheet Card */}
                <View style={styles.sheetContainer}>
                    {/* Pull Handle */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handlePill} />
                    </View>

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <Pressable onPress={onClose} style={styles.closeButton} hitSlop={10}>
                            <CrossIcon width={getHeight(18)} height={getHeight(18)} color={colors.textDark} />
                        </Pressable>
                        <TextView text={filterTranslations.title} style={styles.headerTitle} />
                        <Pressable onPress={handleClearAll} hitSlop={10}>
                            <TextView text={filterTranslations.clearAll} style={styles.clearAllText} />
                        </Pressable>
                    </View>

                    <View style={styles.headerDivider} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Section 1: Sort By */}
                        <View style={styles.section}>
                            <TextView text={filterTranslations.sortBy} style={styles.sectionTitle} />
                            <View style={styles.chipsWrap}>
                                {sortOptions.map((opt) => {
                                    const isSelected = sortBy === opt.id
                                    return (
                                        <Pressable
                                            key={opt.id}
                                            style={[
                                                styles.chip,
                                                isSelected ? styles.chipSelected : styles.chipUnselected,
                                            ]}
                                            onPress={() => setSortBy(opt.id)}
                                        >
                                            <TextView
                                                text={opt.label}
                                                style={[
                                                    styles.chipText,
                                                    isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                                                ]}
                                            />
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Section 2: Categories */}
                        <View style={styles.section}>
                            <TextView text={filterTranslations.categories} style={styles.sectionTitle} />
                            <View style={styles.chipsWrap}>
                                {categoryOptions.map((cat) => {
                                    const isSelected = categories.includes(cat.id)
                                    return (
                                        <Pressable
                                            key={cat.id}
                                            style={[
                                                styles.chip,
                                                isSelected ? styles.chipSelected : styles.chipUnselected,
                                            ]}
                                            onPress={() => handleToggleCategory(cat.id)}
                                        >
                                            <View style={styles.chipRow}>
                                                {isSelected && (
                                                    <TextView text="✓ " style={styles.checkmarkText} />
                                                )}
                                                <TextView
                                                    text={cat.label}
                                                    style={[
                                                        styles.chipText,
                                                        isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                                                    ]}
                                                />
                                            </View>
                                        </Pressable>
                                    )
                                })}
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Section 3: Price Range */}
                        <View style={styles.section}>
                            <View style={styles.priceHeaderRow}>
                                <TextView text={filterTranslations.priceRange} style={styles.sectionTitle} />
                                <TextView
                                    text={`₹${minPrice} - ₹${maxPrice >= 5000 ? '5000+' : maxPrice}`}
                                    style={styles.priceRangeValueText}
                                />
                            </View>

                            <PriceRangeSlider
                                min={0}
                                max={5000}
                                step={100}
                                minValue={minPrice}
                                maxValue={maxPrice}
                                onValueChange={handlePriceChange}
                            />
                        </View>
                    </ScrollView>

                    {/* Apply Filters Button */}
                    <View style={styles.footerContainer}>
                        <Pressable style={styles.applyButton} onPress={handleApply}>
                            <TextView text={filterTranslations.applyFilters} style={styles.applyButtonText} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlayContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.modalOverlayBg || 'rgba(0,0,0,0.45)',
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
        shadowColor: '#000',
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
        backgroundColor: colors.handlePillBg || '#D8DDD9',
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
        backgroundColor: colors.dividerBg || '#F0F0F0',
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
        color: '#4A4A4A',
        marginBottom: 12,
    },
    categorySearchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.searchBg || '#F2F4F3',
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
        backgroundColor: '#F3F0EA',
    },
    chipText: {
        fontSize: getHeight(10),
        fontWeight: '600',
    },
    chipTextSelected: {
        color: colors.white,
    },
    chipTextUnselected: {
        color: '#2C2C2C',
    },
    checkmarkText: {
        fontSize: getHeight(14),
        fontWeight: '700',
        color: colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dividerBg || '#F0F0F0',
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
