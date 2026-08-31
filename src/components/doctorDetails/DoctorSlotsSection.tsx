import React, { useState, useMemo, useCallback } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'
import useGetDoctorSlots from '@src/apis/useGetDoctorSlots'
import useBookSlot from '@src/apis/useBookSlot'
import { BookingItem, Doctor } from '@src/types/DoctorTypes'
import DoctorCalendar from './DoctorCalendar'
import DoctorSlotItem from './DoctorSlotItem'
import DoctorDetailsFooter from './DoctorDetailsFooter'

export interface DoctorSlotsSectionProps {
    doctor: Doctor
    onBookingSuccess?: () => void
}

const DoctorSlotsSection: React.FC<DoctorSlotsSectionProps> = ({ doctor, onBookingSuccess }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE, userId } } = useUserState(['languageCode', 'userId'])
    const t = getTexts(languageCode)
    const detailsText = t.doctors.details
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0])
    const [selectedSlot, setSelectedSlot] = useState<string>('')
    const fromDate = '2026-08-30'
    const toDate = '2026-09-12'
    const { data: slotsData } = useGetDoctorSlots(doctor.id, fromDate, toDate)
    const { mutate: bookSlot, isPending: isBooking } = useBookSlot(doctor.id, selectedDate, selectedSlot)

    const handleSelectDate = useCallback((date: string) => {
        setSelectedDate(date)
        setSelectedSlot('')
    }, [])

    const handleBookPress = useCallback(() => {
        if (!selectedSlot) return
        bookSlot(
            { userId: userId ?? '', doctorId: doctor.id, date: selectedDate, slotId: selectedSlot },
            {
                onSuccess: (data) => {
                    console
                    onBookingSuccess?.()
                },
                onError: (error: any) => {
                    Alert.alert(
                        detailsText.errorTitle,
                        error?.message || detailsText.errorMessage
                    )
                },
            }
        )
    }, [bookSlot, detailsText.errorMessage, detailsText.errorTitle, doctor.id, onBookingSuccess, selectedDate, selectedSlot, userId])

    const datesList = useMemo(() => {
        if (slotsData?.data?.dates && slotsData.data.dates.length > 0) return slotsData.data.dates.map((d) => d.date)
        return []
    }, [slotsData])

    const apiSlots = useMemo(() => {
        if (slotsData?.data?.dates) {
            const dateGroup = slotsData.data.dates.find((d) => d.date === selectedDate)
            if (dateGroup?.slots) return dateGroup.slots
        }
        return []
    }, [slotsData, selectedDate])

    return (
        <View>
            <DoctorCalendar datesList={datesList} selectedDate={selectedDate} onSelectDate={handleSelectDate} />

            {apiSlots && apiSlots.length > 0 && (
                <View style={styles.sectionContainer}>
                    <TextView text={detailsText.availableSlots} style={styles.sectionTitle} />
                    <View style={styles.slotsGrid}>
                        {apiSlots.map((slot) => (
                            <DoctorSlotItem key={slot.id} slot={slot} selectedDate={selectedDate} isSelected={selectedSlot === slot.id} onSelectSlot={setSelectedSlot} />
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.footerWrapper}>
                <DoctorDetailsFooter consultationFee={doctor.consultationFee} disabled={!selectedSlot || isBooking} onBookPress={handleBookPress} />
            </View>
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
    footerWrapper: {
        marginTop: 24,
    },
})

export default React.memo(DoctorSlotsSection)
