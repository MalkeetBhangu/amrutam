import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react'
import { StyleSheet, View, Modal, Pressable, ScrollView } from 'react-native'
import { cross as CrossIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import Button from 'src/components/sharedComponents/Button'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import useGetFilterListing from 'src/apis/useGetFilterListing'
import FeeRangeSlider from './FeeRangeSlider'
import { useUserState } from '@src/store/UseUserStore'

export interface FilterState {
    expertise: string[]
    languages: string[]
    gender: string
    maxFee: number
}

export interface DoctorFilterModalRef {
    open: () => void
    close: () => void
}

export interface DoctorFilterModalProps {
    activeFilters?: FilterState
    onApplyFilters: (filters: FilterState | undefined) => void
}

const DoctorFilterModal = forwardRef<DoctorFilterModalRef, DoctorFilterModalProps>(
    ({ activeFilters, onApplyFilters }, ref) => {
        const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
        const [visible, setVisible] = useState(false)
        const t = getTexts(languageCode)
        const filterTranslations = t.doctors?.filterModal || {}
        const { data: filterListingData } = useGetFilterListing('doctors')
        const [selectedExpertise, setSelectedExpertise] = useState<string[]>(activeFilters?.expertise || [])
        const [selectedLanguages, setSelectedLanguages] = useState<string[]>(activeFilters?.languages || [])
        const [selectedGender, setSelectedGender] = useState<string>(activeFilters?.gender || '')
        const [maxFee, setMaxFee] = useState<number>(activeFilters?.maxFee || 2000)

        useImperativeHandle(ref, () => ({
            open: () => setVisible(true),
            close: () => setVisible(false),
        }))

        useEffect(() => {
            if (visible) {
                setSelectedExpertise(activeFilters?.expertise || [])
                setSelectedLanguages(activeFilters?.languages || [])
                setSelectedGender(activeFilters?.gender || '')
                setMaxFee(activeFilters?.maxFee || 2000)
            }
        }, [visible, activeFilters])

        const toggleExpertise = useCallback((item: string) => setSelectedExpertise((prev) => prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]), [])

        const toggleLanguage = useCallback((item: string) => setSelectedLanguages((prev) => prev.includes(item) ? prev.filter((l) => l !== item) : [...prev, item]), [])

        const handleClose = useCallback(() => setVisible(false), [])

        const handleClearAll = useCallback(() => {
            setSelectedExpertise([])
            setSelectedLanguages([])
            setSelectedGender('')
            setMaxFee(2000)
            onApplyFilters(undefined)
            setVisible(false)
        }, [onApplyFilters])

        const handleApply = useCallback(() => {
            const isEmpty = selectedExpertise.length === 0 && selectedLanguages.length === 0 && !selectedGender && maxFee >= 2000
            if (isEmpty) onApplyFilters(undefined)
            else onApplyFilters({ expertise: selectedExpertise, languages: selectedLanguages, gender: selectedGender, maxFee })
            setVisible(false)
        }, [selectedExpertise, selectedLanguages, selectedGender, maxFee, onApplyFilters])

        return (
            <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
                <View style={styles.overlay}>
                    <Pressable style={styles.backdropPressable} onPress={handleClose} />

                    <View style={styles.sheetContainer}>
                        <View style={styles.handleContainer}>
                            <View style={styles.handlePill} />
                        </View>

                        <View style={styles.headerRow}>
                            <Pressable onPress={handleClose} style={styles.closeButton} hitSlop={8}>
                                <CrossIcon width={getHeight(18)} height={getHeight(18)} />
                            </Pressable>
                            <TextView text={filterTranslations.title} style={styles.headerTitle} />
                            <Pressable onPress={handleClearAll} hitSlop={8}>
                                <TextView text={filterTranslations.clearAll} style={styles.clearAllText} />
                            </Pressable>
                        </View>

                        <View style={styles.divider} />

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" >
                            <View style={styles.sectionContainer}>
                                <TextView text={filterTranslations.expertise} style={styles.sectionTitle} />
                                <View style={styles.chipRow}>
                                    {filterListingData?.data?.expertise?.map((item) => {
                                        const isSelected = selectedExpertise.includes(item)
                                        return (
                                            <Pressable key={item} onPress={() => toggleExpertise(item)} style={[styles.chip, isSelected && styles.selectedChip]}>
                                                <TextView text={item} style={[styles.chipText, isSelected && styles.selectedChipText]} />
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <TextView text={filterTranslations.language} style={styles.sectionTitle} />
                                <View style={styles.chipRow}>
                                    {filterListingData?.data?.languages?.map((item) => {
                                        const isSelected = selectedLanguages.includes(item)
                                        return (
                                            <Pressable key={item} onPress={() => toggleLanguage(item)} style={[styles.chip, isSelected && styles.selectedChip]}>
                                                <TextView text={item} style={[styles.chipText, isSelected && styles.selectedChipText]} />
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            <View style={styles.sectionContainer}>
                                <TextView text={filterTranslations.gender} style={styles.sectionTitle} />
                                <View style={styles.chipRow}>
                                    {filterListingData?.data?.gender?.map((item) => {
                                        const isSelected = selectedGender === item
                                        return (
                                            <Pressable key={item} onPress={() => setSelectedGender(isSelected ? '' : item)} style={[styles.chip, isSelected && styles.selectedChip]}>
                                                <TextView text={item} style={[styles.chipText, isSelected && styles.selectedChipText]} />
                                            </Pressable>
                                        )
                                    })}
                                </View>
                            </View>

                            <FeeRangeSlider maxFee={maxFee} onFeeChange={setMaxFee} />
                        </ScrollView>

                        <View style={styles.divider} />

                        <View style={styles.bottomBar}>
                            <Button
                                title={filterTranslations.apply}
                                onPress={handleApply}
                                variant="primary"
                                borderRadius={getHeight(16)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        )
    })


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.modalOverlayBg,
        justifyContent: 'flex-end',
    },
    backdropPressable: {
        ...StyleSheet.absoluteFill,
    },
    sheetContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: getHeight(24),
        borderTopRightRadius: getHeight(24),
        paddingTop: 10,
        paddingBottom: 24,
        maxHeight: '85%',
    },
    handleContainer: {
        alignItems: 'center',
        paddingVertical: 6,
    },
    handlePill: {
        width: 44,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.handlePillBg,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: getHeight(16),
        color: colors.textDark,
    },
    clearAllText: {
        fontSize: getHeight(14),
        color: colors.darkGreen,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dividerBg,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexGrow: 1,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: getHeight(15),
        color: colors.textDark,
        marginBottom: 12,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: getHeight(24),
        borderWidth: 1,
        borderColor: colors.chipBorder,
        backgroundColor: colors.white,
    },
    selectedChip: {
        backgroundColor: colors.darkGreen,
        borderColor: colors.darkGreen,
    },
    chipText: {
        fontSize: getHeight(10),
        color: colors.textDark,
    },
    selectedChipText: {
        color: colors.white,
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
})

export default React.memo(DoctorFilterModal)
