import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'

import { SlotItem } from '@src/types/DoctorTypes'

export interface DoctorSlotsSectionProps {
    apiSlots: (SlotItem | any)[]
    selectedSlot: string
    onSelectSlot: (slot: string) => void
    selectedDate?: string
}

const isSlotTimePassed = (slotTime: string, slotDate?: string): boolean => {
    if (!slotTime) return false

    const now = new Date()

    if (slotDate) {
        const parts = slotDate.split('-')
        if (parts.length === 3) {
            const slotYear = parseInt(parts[0], 10)
            const slotMonth = parseInt(parts[1], 10) - 1
            const slotDay = parseInt(parts[2], 10)

            const todayYear = now.getFullYear()
            const todayMonth = now.getMonth()
            const todayDay = now.getDate()

            const slotDateObj = new Date(slotYear, slotMonth, slotDay)
            const todayObj = new Date(todayYear, todayMonth, todayDay)

            if (slotDateObj < todayObj) {
                return true
            }
            if (slotDateObj > todayObj) {
                return false
            }
        }
    }

    let hours = 0
    let minutes = 0

    const cleanTime = slotTime.trim()
    const isPM = /PM/i.test(cleanTime)
    const isAM = /AM/i.test(cleanTime)

    const timeMatches = cleanTime.replace(/(AM|PM)/i, '').trim().split(':')
    if (timeMatches.length >= 2) {
        hours = parseInt(timeMatches[0], 10)
        minutes = parseInt(timeMatches[1], 10)

        if (isPM && hours < 12) {
            hours += 12
        } else if (isAM && hours === 12) {
            hours = 0
        }
    } else {
        return false
    }

    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()

    if (hours < currentHours) {
        return true
    } else if (hours === currentHours) {
        return minutes <= currentMinutes
    }

    return false
}

const DoctorSlotsSection: React.FC<DoctorSlotsSectionProps> = ({
    apiSlots,
    selectedSlot,
    onSelectSlot,
    selectedDate,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const detailsText = t.doctors.details

    if (!apiSlots || apiSlots.length === 0) return null

    const renderSlotItem = (slot: any, index: number) => {
        const slotTime = typeof slot === 'string' ? slot : slot?.startTime || slot?.time || ''
        const slotStatus = typeof slot === 'object' ? slot?.status : 'available'
        const timePassed = isSlotTimePassed(slotTime, selectedDate)
        const isDisabled =
            slotStatus === 'disabled' ||
            slotStatus === 'booked' ||
            slot?.isBooked ||
            slot?.available === false ||
            timePassed
        const slotId = slot?.id || slotTime
        const isSelected = selectedSlot === slotTime || selectedSlot === slotId

        return (
            <Pressable
                key={slot.id || `${slotTime}-${index}`}
                disabled={isDisabled}
                onPress={() => onSelectSlot(slotId)}
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
        <View style={styles.sectionContainer}>
            <TextView text={detailsText.availableSlots} style={styles.sectionTitle} />
            <View style={styles.slotsGrid}>{apiSlots.map(renderSlotItem)}</View>
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

export default React.memo(DoctorSlotsSection)
