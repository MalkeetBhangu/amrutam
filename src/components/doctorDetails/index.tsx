import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Screens } from '@src/constants/Screens'
import { ParamsList } from '@src/navigation/useNavigation'
import React, { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import colors from 'src/tokens/Colors'
import DoctorAboutSection from './DoctorAboutSection'
import DoctorBookingsSection from './DoctorBookingsSection'
import DoctorDetailsFooter from './DoctorDetailsFooter'
import DoctorDetailsHeader from './DoctorDetailsHeader'
import DoctorHeroSection from './DoctorHeroSection'
import DoctorSlotsSection from './DoctorSlotsSection'
import DoctorSpecialtiesSection from './DoctorSpecialtiesSection'

const DoctorDetails: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<ParamsList>>()
    const route = useRoute<RouteProp<ParamsList, Screens.DOCTOR_DETAILS>>()
    const doctorParam = route.params?.doctor ?? ({} as any)
    const [hasBooking, setHasBooking] = useState<boolean | null>(null)
    const handleBackPress = useCallback(() => navigation.goBack(), [navigation])
    const handleBookingSuccess = useCallback(() => setHasBooking(true), [])
    const handleCancelSuccess = useCallback(() => setHasBooking(false), [])


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DoctorDetailsHeader />
                <DoctorHeroSection doctor={doctorParam} />
                <DoctorAboutSection aboutText={doctorParam?.about ?? ''} />
                <DoctorSpecialtiesSection specialties={doctorParam?.specialization ?? ''} />
                {hasBooking ? (
                    <DoctorBookingsSection doctorId={doctorParam.id} onCancelSuccess={handleCancelSuccess} />
                ) : (
                    <DoctorSlotsSection doctor={doctorParam} onBookingSuccess={handleBookingSuccess} />
                )}
            </ScrollView>
            {hasBooking && (<DoctorDetailsFooter consultationFee={doctorParam.consultationFee} onBookPress={handleBackPress} hasBookings={true} />)}
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