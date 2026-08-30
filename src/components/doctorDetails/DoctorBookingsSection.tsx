import React from 'react'
import { StyleSheet, View, Pressable, Alert } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { records as CalendarIcon } from 'assets'
import { BookingItem } from '@src/types/DoctorTypes'

export interface DoctorBookingsSectionProps {
    bookings: BookingItem[]
    onCancelBooking: (booking: BookingItem) => void
    isCancelling?: boolean
}

const formatDateString = (dateStr: string): string => {
    if (!dateStr) return ''
    const parts = dateStr.split('-')
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1
        const day = parseInt(parts[2], 10)
        const d = new Date(year, month, day)
        if (!isNaN(d.getTime())) {
            const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' })
            const monthName = d.toLocaleDateString('en-US', { month: 'short' })
            return `${dayOfWeek}, ${day} ${monthName}`
        }
    }
    return dateStr
}

const formatTimeString = (timeStr: string): string => {
    if (!timeStr) return ''
    if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr

    const parts = timeStr.trim().split(':')
    if (parts.length >= 2) {
        let hours = parseInt(parts[0], 10)
        const minutes = parts[1]
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12 || 12
        return `${hours}:${minutes} ${ampm}`
    }
    return timeStr
}

const DoctorBookingsSection: React.FC<DoctorBookingsSectionProps> = ({
    bookings,
    onCancelBooking,
    isCancelling = false,
}) => {
    if (!bookings || bookings.length === 0) return null

    const handleCancelPress = (booking: BookingItem) => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    style: 'destructive',
                    onPress: () => onCancelBooking(booking),
                },
            ]
        )
    }

    return (
        <View style={styles.sectionContainer}>
            <TextView text="My Bookings" style={styles.sectionTitle} />

            {bookings.map((booking, index) => {
                const formattedDate = formatDateString(booking.date)
                const slotTime = booking.slot?.startTime || booking.slot?.endTime || ''
                const formattedTime = formatTimeString(slotTime)

                return (
                    <View key={booking.slot?.id || `${booking.date}-${index}`} style={styles.bookingCard}>
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
                            <TextView text="Cancel Booking" style={styles.cancelText} />
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
        backgroundColor: 'rgba(235, 245, 240, 1)',
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
        color: '#D32F2F',
    },
})

export default React.memo(DoctorBookingsSection)
