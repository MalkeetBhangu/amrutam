import React from 'react'
import { StyleSheet, View, Pressable, Alert } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { records as CalendarIcon } from 'assets'
import { BookingItem } from '@src/types/DoctorTypes'

import { useUserState } from '@src/store/UseUserStore'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import useGetDoctorBookings from '@src/apis/useGetDoctorBookings'
import useCancelBooking from '@src/apis/useCancelBooking'
import { formatDateString, formatTimeString } from './DoctorHelper'
import { DoctorBookingDetail } from '@src/types/DoctorTypes'

export interface DoctorBookingsSectionProps {
    doctorId: string
    onCancelSuccess?: () => void
}

const DoctorBookingsSection: React.FC<DoctorBookingsSectionProps> = ({ doctorId, onCancelSuccess, }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE, userId } } = useUserState(['languageCode', 'userId'])
    const t = getTexts(languageCode)
    const bookingTranslations = t.doctors?.bookings || {}
    const { data: bookingsResponse } = useGetDoctorBookings(doctorId, userId)
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
    const bookings: DoctorBookingDetail[] = bookingsResponse?.data?.bookings || []

    const handleCancelPress = (booking: DoctorBookingDetail) => {
        Alert.alert(
            bookingTranslations.cancelBooking,
            bookingTranslations.cancelConfirm,
            [
                { text: bookingTranslations.cancel, style: 'cancel' },
                {
                    text: bookingTranslations.ok,
                    style: 'destructive',
                    onPress: () => {
                        cancelBooking(
                            {
                                userId: userId ?? '',
                                doctorId: doctorId,
                                date: booking.date,
                                slotId: booking.id || '',
                            },
                            {
                                onSuccess: () => {
                                    onCancelSuccess?.()
                                },
                                onError: (error: any) => {
                                    Alert.alert(
                                        bookingTranslations.errorTitle,
                                        error?.message || bookingTranslations.errorMessage
                                    )
                                },
                            }
                        )
                    },
                },
            ]
        )
    }

    return (
        <View style={styles.sectionContainer}>
            <TextView text={bookingTranslations.title} style={styles.sectionTitle} />

            {bookings.map((booking, index) => {
                const formattedDate = formatDateString(booking.date)
                const slotTime = booking.startTime || booking.endTime || ''
                const formattedTime = formatTimeString(slotTime)

                return (
                    <View key={booking.id || `${booking.date}-${index}`} style={styles.bookingCard}>
                        <View style={styles.iconContainer}>
                            <CalendarIcon width={getHeight(22)} height={getHeight(22)} color={colors.darkGreen} />
                        </View>

                        <View style={styles.detailsColumn}>
                            <TextView text={formattedDate} style={styles.dateText} />
                            {Boolean(formattedTime) && (
                                <TextView text={formattedTime} style={styles.timeText} />
                            )}
                        </View>

                        <Pressable
                            disabled={isCancelling}
                            onPress={() => handleCancelPress(booking)}
                            style={styles.cancelButton}
                        >
                            <TextView text={bookingTranslations.cancelBooking} style={styles.cancelText} />
                        </Pressable>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 14,
    },
    bookingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: getHeight(16),
        padding: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        marginBottom: 12,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    iconContainer: {
        width: getHeight(48),
        height: getHeight(48),
        borderRadius: getHeight(14),
        backgroundColor: colors.bookingIconBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailsColumn: {
        flex: 1,
        marginLeft: 14,
    },
    dateText: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.textDark,
    },
    timeText: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        marginTop: 3,
    },
    cancelButton: {
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    cancelText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.cancelRed,
    },
})

export default React.memo(DoctorBookingsSection)
