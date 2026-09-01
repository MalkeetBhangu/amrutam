import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import useCancelBooking from '@src/apis/useCancelBooking'
import useGetBookings from '@src/apis/useGetBookings'
import { Screens } from '@src/constants/Screens'
import { ParamsList } from '@src/navigation/useNavigation'
import { useUserState } from '@src/store/UseUserStore'
import { backArrow as BackArrowIcon, calender as CalendarIcon, meet as MeetIcon } from 'assets'
import React, { useCallback } from 'react'
import { Alert, FlatList, Image, Pressable, StyleSheet, View } from 'react-native'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'
import { BookingItem } from 'src/types/DoctorTypes'
import { formatDateDisplay, formatTimeDisplay } from '../doctorDetails/DoctorHelper'

const Bookings: React.FC = () => {
    const { userData: { userId, languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['userId', 'languageCode'])
    const t = getTexts(languageCode)
    const bookingTranslations = t.doctors?.bookings || {}
    const navigation = useNavigation<StackNavigationProp<ParamsList, Screens.DOCTORS>>()
    const { data: bookingsData } = useGetBookings(userId)
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()

    const handleBackPress = useCallback(() => { navigation.goBack() }, [navigation])

    const handleGoToDoctors = useCallback(() => { navigation.navigate(Screens.DOCTORS) }, [navigation])

    const handleCancelBookingPrompt = useCallback(
        (booking: BookingItem | any) => {
            Alert.alert(
                bookingTranslations.cancelBooking,
                bookingTranslations.cancelConfirm,
                [
                    { text: bookingTranslations.cancel, style: 'cancel' },
                    {
                        text: bookingTranslations.ok,
                        style: 'destructive',
                        onPress: () => {
                            const targetDoctorId = booking?.doctorId
                            const targetDate = booking?.date || ''
                            const targetSlotId = booking?.slot?.id || ''

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
                                            Alert.alert(
                                                bookingTranslations.errorTitle,
                                                data.message || bookingTranslations.errorMessage
                                            )
                                            return
                                        }
                                        Alert.alert(
                                            bookingTranslations.successTitle,
                                            bookingTranslations.cancelSuccess
                                        )
                                    },
                                    onError: (err: any) => {
                                        Alert.alert(
                                            bookingTranslations.errorTitle,
                                            err?.message || bookingTranslations.errorMessage
                                        )
                                    },
                                }
                            )
                        },
                    },
                ]
            )
        },
        [bookingTranslations, cancelBooking, userId]
    )

    const keyExtractor = useCallback((item: BookingItem | any) => item?.slot?.id, [])

    const renderHeader = useCallback(
        () => (
            <View style={styles.headerContainer}>
                <Pressable onPress={handleBackPress} style={styles.backButton} hitSlop={10}>
                    <BackArrowIcon width={getHeight(20)} height={getHeight(20)} color={colors.textDark} />
                </Pressable>

                <View style={styles.titleSection}>
                    <TextView style={styles.titleText} text={bookingTranslations.title} />
                    <TextView style={styles.subtitleText} text={bookingTranslations.subtitle} />
                </View>
            </View>
        ),
        [bookingTranslations.subtitle, bookingTranslations.title, handleBackPress]
    )

    const renderFooter = useCallback(
        () => (
            <View style={styles.needConsultationCard}>
                <View style={styles.calendarIconCircle}>
                    <CalendarIcon width={getHeight(22)} height={getHeight(22)} color={colors.darkGreen} />
                </View>
                <TextView text={bookingTranslations.needConsultationTitle} style={styles.needConsultationTitle} />
                <TextView
                    text={bookingTranslations.needConsultationSubtitle}
                    style={styles.needConsultationSubtitle}
                />
                <Pressable style={styles.findDoctorButton} onPress={handleGoToDoctors}>
                    <TextView text={bookingTranslations.findDoctor} style={styles.findDoctorButtonText} />
                </Pressable>
            </View>
        ),
        [bookingTranslations.findDoctor, bookingTranslations.needConsultationSubtitle, bookingTranslations.needConsultationTitle, handleGoToDoctors]
    )

    const renderBookingCard = useCallback(({ item }: { item: BookingItem | any }) => {
        const doctorName = item?.doctorName
        const specialty = item?.specialization
        const avatarUri = item?.doctor?.image || DEFAULT_AVATAR
        const dateStr = item?.date || ''
        const startTime = item?.slot?.startTime || item?.startTime || ''
        const endTime = item?.slot?.endTime || item?.endTime || ''
        const dateFormatted = formatDateDisplay(dateStr)
        const timeFormatted = formatTimeDisplay(startTime, endTime)

        return (
            <View style={styles.bookingCard}>
                <View style={styles.doctorHeaderRow}>
                    <Image source={{ uri: avatarUri }} style={styles.doctorAvatar} resizeMode="cover" />
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
                            {timeFormatted && <TextView text={timeFormatted} style={styles.slotTimeText} />}
                        </View>
                    </View>
                    <View style={styles.iconCircle}>
                        <MeetIcon width={getHeight(18)} height={getHeight(18)} color={colors.darkGreen} />
                    </View>
                </View>

                <Pressable disabled={isCancelling} onPress={() => handleCancelBookingPrompt(item)} style={styles.cancelButton} >
                    <TextView text={bookingTranslations.cancel} style={styles.cancelButtonText} />
                </Pressable>
            </View>
        )
    },
        [bookingTranslations.cancel, handleCancelBookingPrompt, isCancelling]
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={bookingsData?.data?.bookings ?? []}
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
        backgroundColor: colors.slotTimeBoxBg,
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
        backgroundColor: colors.iconCircleBg,
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
        backgroundColor: colors.needConsultationBg,
        borderRadius: getHeight(20),
        padding: 24,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.dashedBorder,
        borderStyle: 'dashed',
    },
    calendarIconCircle: {
        width: getHeight(52),
        height: getHeight(52),
        borderRadius: getHeight(26),
        backgroundColor: colors.bookingIconBg,
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

export default React.memo(Bookings)