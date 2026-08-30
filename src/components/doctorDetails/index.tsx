import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { StyleSheet, View, ScrollView, Alert } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import { DEFAULT_AVATAR } from 'src/constants/Constants'
import DoctorDetailsHeader from './DoctorDetailsHeader'
import DoctorHeroSection from './DoctorHeroSection'
import DoctorAboutSection from './DoctorAboutSection'
import DoctorSpecialtiesSection from './DoctorSpecialtiesSection'
import DoctorCalendar from './DoctorCalendar'
import DoctorSlotsSection from './DoctorSlotsSection'
import DoctorBookingsSection from './DoctorBookingsSection'
import DoctorDetailsFooter from './DoctorDetailsFooter'
import useGetDoctorSlots from '@src/apis/useGetDoctorSlots'
import useBookSlot from '@src/apis/useBookSlot'
import useCancelBooking from '@src/apis/useCancelBooking'
import useCompleteBooking, { checkIfBookingTimePassed } from '@src/apis/useCompleteBooking'
import { BookingItem } from '@src/types/DoctorTypes'

const DoctorDetails: React.FC = () => {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const [isFavorite, setIsFavorite] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0])
    const [selectedSlot, setSelectedSlot] = useState<string>('')
    const [isCancelledLocally, setIsCancelledLocally] = useState(false)
    const [bookedSlotLocally, setBookedSlotLocally] = useState<BookingItem | null>(null)
    const [cancelledSlotId, setCancelledSlotId] = useState<string | null>(null)

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const handleFavoriteToggle = useCallback(() => {
        setIsFavorite((prev) => !prev)
    }, [])

    const doctorParam = route.params?.doctor || {}
    const fromDate = '2026-08-30'
    const toDate = '2026-09-12'
    const { data: slotsData } = useGetDoctorSlots(doctorParam.id, fromDate, toDate)
    const { mutate: bookSlot, isPending: isBooking } = useBookSlot(doctorParam.id, selectedDate, selectedSlot)
    const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking()
    const { mutate: completeBooking } = useCompleteBooking()

    const handleBookPress = useCallback(() => {
        if (!selectedSlot) return
        bookSlot(
            { doctorId: doctorParam.id, date: selectedDate, slotId: selectedSlot },
            {
                onSuccess: () => {
                    const slotTimePart = selectedSlot.includes('-')
                        ? selectedSlot.split('-').pop() || ''
                        : selectedSlot
                    const formattedTime =
                        slotTimePart.length === 4
                            ? `${slotTimePart.slice(0, 2)}:${slotTimePart.slice(2)}`
                            : slotTimePart

                    const newBooking: BookingItem = {
                        doctorId: doctorParam.id,
                        doctorName: doctorParam.name,
                        date: selectedDate,
                        slot: {
                            id: selectedSlot,
                            startTime: formattedTime || '15:00',
                            endTime: '',
                            available: false,
                            booked: true,
                            status: 'booked',
                        },
                    }
                    setBookedSlotLocally(newBooking)
                    setIsCancelledLocally(false)
                    setSelectedSlot('')
                    Alert.alert('Success', 'Appointment booked successfully!')
                },
                onError: (err: any) => {
                    Alert.alert('Error', err?.message || 'Failed to book slot. Please try again.')
                },
            }
        )
    }, [bookSlot, doctorParam.id, doctorParam.name, selectedDate, selectedSlot])

    const handleCancelBooking = useCallback(
        (booking: BookingItem) => {
            const targetDoctorId =
                booking?.doctorId ||
                doctorParam.id ||
                doctorParam._id ||
                slotsData?.data?.doctorId ||
                ''
            const targetDate =
                booking?.date ||
                slotsData?.data?.date ||
                selectedDate ||
                ''
            const targetSlotId =
                booking?.slot?.id ||
                (booking as any)?.slotId ||
                (booking as any)?.id ||
                ''

            console.log('handleCancelBooking payload:', { targetDoctorId, targetDate, targetSlotId, booking })

            cancelBooking(
                {
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
                        setCancelledSlotId(targetSlotId)
                        setBookedSlotLocally(null)
                        setIsCancelledLocally(true)
                        Alert.alert('Success', 'Booking cancelled successfully!')
                    },
                    onError: (err: any) => {
                        Alert.alert('Error', err?.message || 'Failed to cancel booking.')
                    },
                }
            )
        },
        [cancelBooking, doctorParam, slotsData, selectedDate]
    )

    const handleSelectDate = useCallback((date: string) => {
        setSelectedDate(date)
        setSelectedSlot('')
    }, [])
    const doctorName = doctorParam.name || ''
    const specialtyText = doctorParam.specialization || doctorParam.specialty || ''
    const isVerified = doctorParam.verified ?? doctorParam.isVerified ?? false

    const ratingVal = doctorParam.rating != null ? Number(doctorParam.rating).toFixed(1) : null
    const reviewsCountText =
        doctorParam.reviewCount || doctorParam.reviewsCount || doctorParam.reviews
    const experienceYears = doctorParam.experience ?? doctorParam.experienceYears
    const consultationFee = doctorParam.consultationFee

    const rawImage = doctorParam.image || doctorParam.imageUri
    const imageSource = useMemo(() => {
        if (!rawImage) return { uri: DEFAULT_AVATAR }
        return typeof rawImage === 'string' ? { uri: rawImage } : rawImage
    }, [rawImage])

    const aboutText = doctorParam.about

    const specialtiesList: string[] = useMemo(() => {
        if (Array.isArray(doctorParam.specialties) && doctorParam.specialties.length > 0) {
            return doctorParam.specialties
        }
        if (Array.isArray(doctorParam.expertise) && doctorParam.expertise.length > 0) {
            return doctorParam.expertise
        }
        if (doctorParam.specialization) {
            return [doctorParam.specialization]
        }
        return []
    }, [doctorParam])

    const apiSlots = useMemo(() => {
        let rawSlots: any[] = []
        if (slotsData?.data?.dates && slotsData.data.dates.length > 0) {
            const dateGroup = slotsData.data.dates.find((d) => d.date === selectedDate) || slotsData.data.dates[0]
            if (dateGroup?.slots) rawSlots = dateGroup.slots
        } else if (Array.isArray(doctorParam.slots)) {
            rawSlots = doctorParam.slots
        } else if (Array.isArray(doctorParam.availableSlots)) {
            rawSlots = doctorParam.availableSlots
        }

        return rawSlots.map((slot: any) => {
            if (cancelledSlotId && (slot.id === cancelledSlotId || slot.startTime === cancelledSlotId)) {
                return { ...slot, available: true, booked: false, status: 'available' }
            }
            if (bookedSlotLocally && slot.id === bookedSlotLocally.slot?.id) {
                return { ...slot, available: false, booked: true, status: 'booked' }
            }
            return slot
        })
    }, [slotsData, selectedDate, doctorParam, cancelledSlotId, bookedSlotLocally])

    const datesList = useMemo(() => {
        if (slotsData?.data?.dates && slotsData.data.dates.length > 0) {
            return slotsData.data.dates.map((d) => d.date)
        }
        if (Array.isArray(doctorParam.availableDates)) return doctorParam.availableDates
        if (Array.isArray(doctorParam.dates)) return doctorParam.dates
        return []
    }, [slotsData, doctorParam])

    const hasBooking = useMemo(() => {
        if (isCancelledLocally) return false
        if (bookedSlotLocally) return true

        const serverBookings = slotsData?.data?.bookings || doctorParam.bookings
        if (Array.isArray(serverBookings) && serverBookings.length > 0) {
            return serverBookings.some(
                (b: any) =>
                    b &&
                    b.status !== 'completed' &&
                    b.status !== 'cancelled' &&
                    b.slot?.status !== 'completed' &&
                    b.slot?.status !== 'cancelled'
            )
        }

        const serverHasBooking =
            slotsData?.data?.hasBooking !== undefined
                ? Boolean(slotsData.data.hasBooking)
                : slotsData?.data?.hasBookings !== undefined
                ? Boolean(slotsData.data.hasBookings)
                : Boolean(doctorParam.hasBooking ?? doctorParam.hasBookings)

        return serverHasBooking
    }, [isCancelledLocally, bookedSlotLocally, slotsData, doctorParam])

    const bookingsList: BookingItem[] = useMemo(() => {
        if (bookedSlotLocally) {
            return [bookedSlotLocally]
        }
        if (Array.isArray(slotsData?.data?.bookings) && slotsData.data.bookings.length > 0) {
            return slotsData.data.bookings
        }
        if (Array.isArray(doctorParam.bookings) && doctorParam.bookings.length > 0) {
            return doctorParam.bookings
        }
        if (hasBooking) {
            const bookedSlot = apiSlots.find((s: any) => s.booked || s.status === 'booked')
            return [
                {
                    doctorId: doctorParam.id,
                    doctorName: doctorParam.name,
                    date: slotsData?.data?.date || selectedDate,
                    slot: bookedSlot || {
                        id: 'booked-slot',
                        startTime: '11:00 AM',
                        endTime: '11:30 AM',
                        booked: true,
                        status: 'booked',
                    },
                },
            ]
        }
        return []
    }, [bookedSlotLocally, slotsData, doctorParam, hasBooking, apiSlots, selectedDate])

    useEffect(() => {
        if (!hasBooking) return

        const currentBooking = bookingsList[0]
        if (currentBooking && currentBooking.slot) {
            const bookingDate = currentBooking.date || slotsData?.data?.date || selectedDate
            const bookingSlot = currentBooking.slot
            const isAlreadyCompleted = bookingSlot.status === 'completed' || (currentBooking as any).status === 'completed'

            if (!isAlreadyCompleted && checkIfBookingTimePassed(bookingDate, bookingSlot)) {
                console.log('Booking time has passed, auto-completing booking in DoctorDetails:', { bookingDate, bookingSlot })
                setIsCancelledLocally(true)
                setBookedSlotLocally(null)
                completeBooking({
                    doctorId: doctorParam.id || currentBooking.doctorId || '',
                    date: bookingDate,
                    slotId: bookingSlot.id || (bookingSlot as any).slotId || '',
                })
            }
        }
    }, [hasBooking, bookingsList, slotsData, selectedDate, doctorParam.id, completeBooking])

    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DoctorDetailsHeader onBackPress={handleBackPress} isFavorite={isFavorite} onFavoriteToggle={handleFavoriteToggle} />
                <DoctorHeroSection imageSource={imageSource} isVerified={isVerified} doctorName={doctorName} specialtyText={specialtyText} ratingVal={ratingVal} reviewsCountText={reviewsCountText} experienceYears={experienceYears} />
                <DoctorAboutSection aboutText={aboutText} />
                <DoctorSpecialtiesSection specialtiesList={specialtiesList} />
                {hasBooking ? (
                    <DoctorBookingsSection bookings={bookingsList} onCancelBooking={handleCancelBooking} isCancelling={isCancelling} />
                ) : (
                    <>
                        <DoctorCalendar datesList={datesList} selectedDate={selectedDate} onSelectDate={handleSelectDate} />
                        <DoctorSlotsSection apiSlots={apiSlots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} selectedDate={selectedDate} />
                    </>
                )}
            </ScrollView>
            <DoctorDetailsFooter
                consultationFee={consultationFee}
                disabled={hasBooking ? false : (!selectedSlot || isBooking)}
                onBookPress={hasBooking ? handleBackPress : handleBookPress}
                hasBookings={hasBooking}
                buttonText={hasBooking ? "← Go back to My Bookings" : undefined}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
})

export default React.memo(DoctorDetails)