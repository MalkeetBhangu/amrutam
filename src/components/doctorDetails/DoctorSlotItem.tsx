import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { SlotItem } from '@src/types/DoctorTypes'
import { isSlotTimePassed } from './DoctorHelper'

export interface DoctorSlotItemProps {
    slot: SlotItem
    selectedDate?: string
    isSelected: boolean
    onSelectSlot: (slotId: string) => void
}

const DoctorSlotItem: React.FC<DoctorSlotItemProps> = ({ slot, selectedDate, isSelected, onSelectSlot, }) => {
    const slotTime = slot?.startTime ?? ''
    const slotStatus = (slot as any)?.status ?? 'available'
    const timePassed = isSlotTimePassed(slotTime, selectedDate)
    const isDisabled = slotStatus === 'disabled' || slotStatus === 'booked' || slot?.available === false || timePassed
    const slotId = slot?.id

    return (
        <Pressable
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

const styles = StyleSheet.create({
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

export default React.memo(DoctorSlotItem)
