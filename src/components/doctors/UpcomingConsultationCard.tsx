import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { calender as CalendarIcon } from 'assets'
import { Screens } from '@src/constants/Screens'
import { BookingItem } from 'src/types/DoctorTypes'
import { useUserState } from '@src/store/UseUserStore'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'

export interface UpcomingConsultationCardProps {
    booking: BookingItem | any
}

const formatBookingBadge = (dateStr: string, timeStr: string, todayText: string, tomorrowText: string): string => {
    let dateFormatted = ''
    if (dateStr) {
        const parts = dateStr.split('-')
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10)
            const month = parseInt(parts[1], 10) - 1
            const day = parseInt(parts[2], 10)

            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            const target = new Date(year, month, day)

            const diffTime = target.getTime() - today.getTime()
            const diffDays = Math.round(diffTime / (1000 * 3600 * 24))

            if (diffDays === 0) {
                dateFormatted = todayText
            } else if (diffDays === 1) {
                dateFormatted = tomorrowText
            } else {
                const dayOfWeek = target.toLocaleDateString('en-US', { weekday: 'short' })
                const monthName = target.toLocaleDateString('en-US', { month: 'short' })
                dateFormatted = `${dayOfWeek}, ${day} ${monthName}`
            }
        } else {
            dateFormatted = dateStr
        }
    }

    let timeFormatted = ''
    if (timeStr) {
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            timeFormatted = timeStr
        } else {
            const timeParts = timeStr.trim().split(':')
            if (timeParts.length >= 2) {
                let hours = parseInt(timeParts[0], 10)
                const minutes = timeParts[1]
                const ampm = hours >= 12 ? 'PM' : 'AM'
                hours = hours % 12 || 12
                timeFormatted = `${hours}:${minutes} ${ampm}`
            } else {
                timeFormatted = timeStr
            }
        }
    }

    if (dateFormatted && timeFormatted) {
        return `${dateFormatted}, ${timeFormatted}`
    }
    return dateFormatted || timeFormatted
}

const UpcomingConsultationCard: React.FC<UpcomingConsultationCardProps> = ({ booking }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const upcomingTranslations = t.doctors?.upcomingConsultation || {}
    const navigation = useNavigation<any>()

    if (!booking) return null

    if (
        booking.status === 'completed' ||
        booking.status === 'cancelled' ||
        booking.slot?.status === 'completed' ||
        booking.slot?.status === 'cancelled' ||
        booking.booked === false
    ) {
        return null
    }

    const doctorName = booking.doctorName || booking.doctor?.name || ''
    const specialtyText =
        booking.specialization ||
        booking.specialty ||
        booking.doctorSpecialization ||
        booking.doctorSpecialty ||
        booking.doctor?.specialization ||
        booking.doctor?.specialty ||
        booking.doctor?.expertise?.[0] ||
        booking.doctor?.category ||
        ''
    const dateStr = booking.date || ''
    const timeStr = booking.slot?.startTime || booking.slot?.time || booking.startTime || ''
    const badgeText = formatBookingBadge(
        dateStr,
        timeStr,
        upcomingTranslations.today,
        upcomingTranslations.tomorrow
    )

    const handleViewDetails = () => navigation.navigate(Screens.BOOKINGS)


    return (
        <View style={styles.sectionContainer}>
            <TextView text={upcomingTranslations.title} style={styles.sectionTitle} />

            <View style={styles.cardContainer}>
                <View style={styles.topRow}>
                    <View style={styles.doctorInfoColumn}>
                        <TextView text={doctorName} style={styles.doctorName} numberOfLines={1} />
                        <TextView text={specialtyText} style={styles.specialtyText} numberOfLines={1} />
                    </View>

                    {Boolean(badgeText) && (
                        <View style={styles.badgePill}>
                            <CalendarIcon width={getHeight(14)} height={getHeight(14)} color={colors.darkGreen} />
                            <TextView text={badgeText} style={styles.badgeText} />
                        </View>
                    )}
                </View>

                <Pressable style={styles.viewDetailsButton} onPress={handleViewDetails}>
                    <TextView text={upcomingTranslations.viewDetails} style={styles.buttonText} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 18,
        marginBottom: 6,
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 12,
    },
    cardContainer: {
        backgroundColor: colors.chipBg,
        borderRadius: getHeight(20),
        padding: 16,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    doctorInfoColumn: {
        flex: 1,
        marginRight: 10,
    },
    doctorName: {
        fontSize: getHeight(14),
        fontWeight: '700',
        color: colors.textDark,
    },
    specialtyText: {
        fontSize: getHeight(11),
        color: colors.textSecondary,
        marginTop: 3,
    },
    badgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: getHeight(20),
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    badgeText: {
        fontSize: getHeight(12.5),
        fontWeight: '600',
        color: colors.textDark,
        marginLeft: 6,
    },
    viewDetailsButton: {
        height: getHeight(48),
        backgroundColor: colors.darkGreen,
        borderRadius: getHeight(14),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    buttonText: {
        fontSize: getHeight(14.5),
        fontWeight: '600',
        color: colors.white,
    },
})

export default React.memo(UpcomingConsultationCard)
