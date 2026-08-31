import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View, FlatList, Image, Pressable, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { logo, calender as CalendarIcon, meet as MeetIcon, backArrow as BackArrowIcon } from 'assets'
import { DEFAULT_AVATAR } from 'src/constants/Constants'
import { Screens } from '@src/constants/Screens'
import useGetBookings from '@src/apis/useGetBookings'
import useCancelBooking from '@src/apis/useCancelBooking'
import { BookingItem } from 'src/types/DoctorTypes'
import { useUserState } from '@src/store/UseUserStore'

const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return ''
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

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Tomorrow'

        const dayOfWeek = target.toLocaleDateString('en-US', { weekday: 'short' })
        const monthName = target.toLocaleDateString('en-US', { month: 'short' })
        return `${dayOfWeek}, ${day} ${monthName}`
    }
    return dateStr
}

const formatTimeDisplay = (startTime: string, endTime?: string): string => {
    if (!startTime) return ''

    const formatSingleTime = (t: string) => {
        if (!t) return ''
        if (t.includes('AM') || t.includes('PM')) return t
        const parts = t.trim().split(':')
        if (parts.length >= 2) {
            let hours = parseInt(parts[0], 10)
            const minutes = parts[1]
            const ampm = hours >= 12 ? 'PM' : 'AM'
            hours = hours % 12 || 12
            return `${hours}:${minutes} ${ampm}`
        }
        return t
    }

    const startFormatted = formatSingleTime(startTime)
    const endFormatted = endTime ? formatSingleTime(endTime) : ''

    if (startFormatted && endFormatted) {
        return `${startFormatted} – ${endFormatted}`
    }
    return startFormatted || endFormatted || ''
}

const Bookings: React.FC = () => {
    const { userData: { userId } } = useUserState(['userId'])
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const routeBookings = route.params?.bookings

    const { data: bookingsData } = useGetBookings()
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const bookingsList: BookingItem[] = useMemo(() => {
        let rawList: any[] = []
        if (Array.isArray(bookingsData?.data?.bookings)) {
            rawList = bookingsData.data.bookings
        } else if (Array.isArray(bookingsData?.bookings)) {
            rawList = bookingsData.bookings
        } else if (Array.isArray(bookingsData?.data)) {
            rawList = bookingsData.data
        } else if (Array.isArray(routeBookings)) {
            rawList = routeBookings
        }

        return rawList.filter((b: any) => {
            if (!b) return false
            if (b.status === 'cancelled' || b.booked === false || b.slot?.status === 'cancelled' || b.slot?.booked === false) {
                return false
            }
            return true
        })
    }, [bookingsData, routeBookings])

    const handleGoToDoctors = useCallback(() => {
        navigation.navigate(Screens.DOCTORS)
    }, [navigation])

    const handleCancelBookingPrompt = useCallback(
        (booking: BookingItem | any) => {
            Alert.alert(
                'Cancel Booking',
                'Are you sure you want to cancel this booking?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'OK',
                        style: 'destructive',
                        onPress: () => {
                            const targetDoctorId =
                                booking?.doctorId ||
                                booking?.doctor?.id ||
                                booking?.doctor?._id ||
                                'doctor_0001'
                            const targetDate = booking?.date || ''
                            const targetSlotId = booking?.slot?.id || booking?.slotId || ''

                            cancelBooking(
                                {
                                    userId: userId ?? '',
                                    doctorId: targetDoctorId,
                                    slotId: targetSlotId,
                                    date: targetDate,
                                },
                                {
                                    onSuccess: (data: any) => {
                                        if (data && data.success === false) {
                                            Alert.alert('Error', data.message || 'Failed to cancel booking.')
                                            return
                                        }
                                        Alert.alert('Success', 'Booking cancelled successfully!')
                                    },
                                    onError: (err: any) => {
                                        Alert.alert('Error', err?.message || 'Failed to cancel booking.')
                                    },
                                }
                            )
                        },
                    },
                ]
            )
        },
        [cancelBooking]
    )

    const keyExtractor = useCallback(
        (item: BookingItem | any, index: number) => item?.slot?.id || `${item?.date}-${index}`,
        []
    )

    const renderHeader = useCallback(
        () => (
            <View style={styles.headerContainer}>
                <Pressable onPress={handleBackPress} style={styles.backButton} hitSlop={10}>
                    <BackArrowIcon width={getHeight(20)} height={getHeight(20)} color={colors.textDark} />
                </Pressable>

                <View style={styles.titleSection}>
                    <TextView style={styles.titleText} text="My Bookings" />
                    <TextView style={styles.subtitleText} text="Manage your upcoming Ayurvedic consultations." />
                </View>
            </View>
        ),
        [handleBackPress]
    )

    const renderFooter = useCallback(
        () => (
            <View style={styles.needConsultationCard}>
                <View style={styles.calendarIconCircle}>
                    <CalendarIcon width={getHeight(22)} height={getHeight(22)} color={colors.darkGreen} />
                </View>
                <TextView text="Need another consultation?" style={styles.needConsultationTitle} />
                <TextView
                    text="Book a new appointment with our Ayurvedic experts."
                    style={styles.needConsultationSubtitle}
                />
                <Pressable style={styles.findDoctorButton} onPress={handleGoToDoctors}>
                    <TextView text="Find a Doctor" style={styles.findDoctorButtonText} />
                </Pressable>
            </View>
        ),
        [handleGoToDoctors]
    )

    const renderBookingCard = useCallback(
        ({ item }: { item: BookingItem | any }) => {
            const doctorName = item?.doctorName || item?.doctor?.name || 'Dr. Rekha Sharma'
            const specialty =
                item?.specialization ||
                item?.specialty ||
                item?.doctor?.specialization ||
                item?.doctor?.specialty ||
                'Ayurvedic Specialist'
            const avatarUri = item?.doctorImage || item?.doctor?.image || DEFAULT_AVATAR

            const dateStr = item?.date || ''
            const startTime = item?.slot?.startTime || item?.startTime || ''
            const endTime = item?.slot?.endTime || item?.endTime || ''

            const dateFormatted = formatDateDisplay(dateStr)
            const timeFormatted = formatTimeDisplay(startTime, endTime)

            return (
                <View style={styles.bookingCard}>
                    <View style={styles.doctorHeaderRow}>
                        <Image
                            source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri}
                            style={styles.doctorAvatar}
                            resizeMode="cover"
                        />
                        <View style={styles.doctorDetailsColumn}>
                            <TextView text={doctorName} style={styles.doctorNameText} numberOfLines={1} />
                            <TextView text={specialty} style={styles.doctorSpecialtyText} numberOfLines={1} />
                        </View>
                    </View>

                    <View style={styles.slotTimeBox}>
                        <View style={styles.slotTimeLeft}>
                            <CalendarIcon width={getHeight(18)} height={getHeight(18)} color={colors.darkGreen} />
                            <View style={styles.slotTimeTextColumn}>
                                <TextView text={dateFormatted} style={styles.slotDateText} />
                                {Boolean(timeFormatted) && (
                                    <TextView text={timeFormatted} style={styles.slotTimeText} />
                                )}
                            </View>
                        </View>
                        <View style={styles.iconCircle}>
                            <MeetIcon width={getHeight(18)} height={getHeight(18)} color={colors.darkGreen} />
                        </View>
                    </View>

                    <Pressable
                        disabled={isCancelling}
                        onPress={() => handleCancelBookingPrompt(item)}
                        style={styles.cancelButton}
                    >
                        <TextView text="Cancel" style={styles.cancelButtonText} />
                    </Pressable>
                </View>
            )
        },
        [handleCancelBookingPrompt, isCancelling]
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={bookingsList}
                keyExtractor={keyExtractor}
                renderItem={renderBookingCard}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerContainer: {
        paddingTop: 12,
        paddingBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        height: getHeight(34),
        width: getHeight(34),
    },
    logoText: {
        fontSize: getHeight(18),
        color: colors.darkGreen,
        marginLeft: 8,
        letterSpacing: 1.2,
        fontWeight: '700',
    },
    avatarWrapper: {
        width: getHeight(40),
        height: getHeight(40),
        borderRadius: getHeight(20),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.avatarBorder,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    backButton: {
        width: getHeight(36),
        height: getHeight(36),
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 8,
    },
    titleSection: {
        marginTop: 6,
    },
    titleText: {
        fontSize: getHeight(22),
        fontWeight: '700',
        color: colors.textDark,
    },
    subtitleText: {
        fontSize: getHeight(13.5),
        color: colors.textSecondary,
        marginTop: 4,
    },
    bookingCard: {
        backgroundColor: colors.white,
        borderRadius: getHeight(16),
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: 16,
        marginBottom: 16,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    doctorHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorAvatar: {
        width: getHeight(56),
        height: getHeight(56),
        borderRadius: getHeight(28),
        backgroundColor: colors.avatarBorder,
    },
    doctorDetailsColumn: {
        flex: 1,
        marginLeft: 14,
    },
    doctorNameText: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.textDark,
    },
    doctorSpecialtyText: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        marginTop: 3,
    },
    slotTimeBox: {
        backgroundColor: '#F8F6F2',
        borderRadius: getHeight(12),
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
    },
    slotTimeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    slotTimeTextColumn: {
        marginLeft: 10,
    },
    slotDateText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.textDark,
    },
    slotTimeText: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        marginTop: 2,
    },
    iconCircle: {
        width: getHeight(36),
        height: getHeight(36),
        borderRadius: getHeight(18),
        backgroundColor: 'rgba(235, 245, 240, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoIconText: {
        fontSize: getHeight(14),
    },
    cancelButton: {
        height: getHeight(44),
        borderRadius: getHeight(12),
        borderWidth: 1,
        borderColor: colors.cardBorder,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
    },
    cancelButtonText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.textDark,
    },
    needConsultationCard: {
        backgroundColor: '#F6F5F0',
        borderRadius: getHeight(20),
        padding: 24,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(220, 218, 210, 0.6)',
        borderStyle: 'dashed',
    },
    calendarIconCircle: {
        width: getHeight(52),
        height: getHeight(52),
        borderRadius: getHeight(26),
        backgroundColor: 'rgba(235, 245, 240, 1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    needConsultationTitle: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.textDark,
        marginTop: 12,
    },
    needConsultationSubtitle: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: 4,
        lineHeight: getHeight(18),
    },
    findDoctorButton: {
        backgroundColor: colors.darkGreen,
        borderRadius: getHeight(20),
        paddingHorizontal: 28,
        paddingVertical: 10,
        marginTop: 16,
    },
    findDoctorButtonText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.white,
    },
})

export default Bookings