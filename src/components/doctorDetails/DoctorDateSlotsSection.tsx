import React from 'react'
import { StyleSheet, View, ScrollView, Pressable } from 'react-native'
import { chevronDown as ChevronDownIcon, sunIcon as SunIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'

export interface DoctorDateSlotsSectionProps {
    datesList: any[]
    selectedDate: string
    onSelectDate: (date: string) => void
    apiSlots: any[]
    morningSlots: any[]
    selectedSlot: string
    onSelectSlot: (slot: string) => void
}

const DoctorDateSlotsSection: React.FC<DoctorDateSlotsSectionProps> = ({
    datesList,
    selectedDate,
    onSelectDate,
    apiSlots,
    morningSlots,
    selectedSlot,
    onSelectSlot,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const detailsText = t.doctors.details

    const showHandlePill = datesList.length > 0 || apiSlots.length > 0

    if (!showHandlePill) return null

    const renderSlotItem = (slot: any, index: number) => {
        const slotTime = typeof slot === 'string' ? slot : slot?.time || ''
        const slotStatus = typeof slot === 'object' ? slot?.status : 'available'
        const isDisabled =
            slotStatus === 'disabled' ||
            slotStatus === 'booked' ||
            slot?.isBooked ||
            slot?.available === false
        const isSelected = selectedSlot === slotTime

        return (
            <Pressable
                key={slot.id || `${slotTime}-${index}`}
                disabled={isDisabled}
                onPress={() => onSelectSlot(slotTime)}
                style={[
                    styles.slotPill,
                    isDisabled
                        ? styles.slotDisabled
                        : isSelected
                            ? styles.slotSelected
                            : styles.slotUnselected,
                ]}
            >
                <TextView
                    text={slotTime}
                    style={[
                        styles.slotText,
                        isDisabled
                            ? styles.slotTextDisabled
                            : isSelected
                                ? styles.slotTextSelected
                                : styles.slotTextUnselected,
                    ]}
                />
            </Pressable>
        )
    }

    return (
        <View>
            {/* Top Sheet Pill Handle */}
            <View style={styles.handlePillWrapper}>
                <View style={styles.handlePill} />
            </View>

            {/* Select Date Section */}
            {datesList.length > 0 && (
                <View style={styles.sectionContainer}>
                    <View style={styles.dateHeaderRow}>
                        <TextView text={detailsText.selectDate} style={styles.sectionTitle} />
                        <Pressable style={styles.monthSelector}>
                            <TextView text={`${detailsText.october} `} style={styles.monthText} />
                            <ChevronDownIcon width={getHeight(12)} height={getHeight(12)} />
                        </Pressable>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.datesScrollContent}
                    >
                        {datesList.map((item: any, index: number) => {
                            const dayStr = typeof item === 'string' ? item : item.day || ''
                            const dateStr =
                                typeof item === 'string'
                                    ? item
                                    : item.date || item.id || String(index)
                            const itemKey = item.id || `${dateStr}-${index}`
                            const isSelected = selectedDate === dateStr
                            return (
                                <Pressable
                                    key={itemKey}
                                    onPress={() => onSelectDate(dateStr)}
                                    style={[
                                        styles.dateCard,
                                        isSelected ? styles.dateCardSelected : styles.dateCardUnselected,
                                    ]}
                                >
                                    {Boolean(dayStr) && (
                                        <TextView
                                            text={dayStr}
                                            style={[
                                                styles.dateDayText,
                                                isSelected
                                                    ? styles.dateDayTextSelected
                                                    : styles.dateDayTextUnselected,
                                            ]}
                                        />
                                    )}
                                    <TextView
                                        text={dateStr}
                                        style={[
                                            styles.dateNumText,
                                            isSelected
                                                ? styles.dateNumTextSelected
                                                : styles.dateNumTextUnselected,
                                        ]}
                                    />
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                </View>
            )}

            {/* Available Slots Section */}
            {apiSlots.length > 0 && (
                <View style={styles.sectionContainer}>
                    <TextView text={detailsText.availableSlots} style={styles.sectionTitle} />

                    {morningSlots.length > 0 ? (
                        <>
                            <View style={styles.slotCategoryHeader}>
                                <SunIcon width={getHeight(15)} height={getHeight(15)} />
                                <TextView text={` ${detailsText.morning}`} style={styles.slotCategoryTitle} />
                            </View>
                            <View style={styles.slotsGrid}>{morningSlots.map(renderSlotItem)}</View>
                        </>
                    ) : (
                        <View style={styles.slotsGrid}>{apiSlots.map(renderSlotItem)}</View>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
    },
    handlePillWrapper: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
    },
    handlePill: {
        width: 44,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.handlePillBg,
    },
    dateHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    monthText: {
        fontSize: getHeight(13),
        fontWeight: '600',
        color: colors.darkGreen,
    },
    datesScrollContent: {
        gap: 10,
        paddingVertical: 4,
    },
    dateCard: {
        width: getHeight(62),
        height: getHeight(74),
        borderRadius: getHeight(14),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    dateCardUnselected: {
        backgroundColor: colors.white,
        borderColor: colors.cardBorder,
    },
    dateCardSelected: {
        backgroundColor: colors.darkGreen,
        borderColor: colors.darkGreen,
    },
    dateDayText: {
        fontSize: getHeight(12),
        marginBottom: 4,
    },
    dateDayTextUnselected: {
        color: colors.textSecondary,
    },
    dateDayTextSelected: {
        color: colors.selectedSubText,
    },
    dateNumText: {
        fontSize: getHeight(18),
        fontWeight: '700',
    },
    dateNumTextUnselected: {
        color: colors.textDark,
    },
    dateNumTextSelected: {
        color: colors.white,
    },
    slotCategoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 12,
    },
    slotCategoryTitle: {
        fontSize: getHeight(13),
        fontWeight: '500',
        color: colors.textSecondary,
        marginLeft: 4,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 14,
    },
    slotPill: {
        width: '31%',
        height: getHeight(44),
        borderRadius: getHeight(12),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    slotUnselected: {
        backgroundColor: colors.white,
        borderColor: colors.cardBorder,
    },
    slotSelected: {
        backgroundColor: colors.darkGreen,
        borderColor: colors.darkGreen,
    },
    slotDisabled: {
        backgroundColor: colors.disabledPillBg,
        borderColor: colors.disabledPillBorder,
    },
    slotText: {
        fontSize: getHeight(13),
    },
    slotTextUnselected: {
        color: colors.textDark,
        fontWeight: '500',
    },
    slotTextSelected: {
        color: colors.white,
        fontWeight: '600',
    },
    slotTextDisabled: {
        color: colors.disabledPillText,
        fontWeight: '400',
    },
})

export default React.memo(DoctorDateSlotsSection)
