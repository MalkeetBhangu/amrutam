import React from 'react'
import { Pressable, StyleSheet, View, Image } from 'react-native'
import { star as StarIcon, briefcase as BriefcaseIcon, globe as GlobeIcon, verified as VerifiedIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import Button from 'src/components/sharedComponents/Button'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { useNavigation } from '@react-navigation/native'
import { Screens } from '@src/constants/Screens'

export interface DoctorCardProps {
    doctor: any
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const cardTranslations = (t.doctors as any)?.card || {}
    const navigation = useNavigation<any>()

    const handlePressDoctor = () => {
        navigation.navigate(Screens.DOCTOR_DETAILS, { doctor })
    }

    const rawImage = doctor?.image || doctor?.imageUri
    const imageSource = rawImage
        ? typeof rawImage === 'string'
            ? { uri: rawImage }
            : rawImage
        : { uri: DEFAULT_AVATAR }

    const isVerified = doctor?.verified ?? doctor?.isVerified ?? true
    const specialtyText = doctor?.specialization || doctor?.specialty || ''
    const experienceYears = doctor?.experience ?? doctor?.experienceYears ?? 0
    const ratingText = doctor?.rating != null ? Number(doctor.rating).toFixed(1) : '0.0'
    const languagesArray = Array.isArray(doctor?.languages) ? doctor.languages : (doctor?.languages ? [doctor.languages] : [])
    const languagesText = languagesArray.join(', ')

    const consultationFee = doctor?.consultationFee ?? 0
    const nextSlotText = doctor?.slots?.[0]?.time ? `${cardTranslations.today}, ${doctor.slots[0].time}` : (doctor?.nextSlot || '')

            const hasBooking = Boolean(doctor?.hasBooking ?? doctor?.hasBookings)
            const buttonTitle = hasBooking ? 'My bookings' : (cardTranslations.bookSlot || 'Book an Appointment')

            return (
                <Pressable style={styles.cardContainer} onPress={handlePressDoctor}>
                    <View style={styles.topSection}>
                        <View style={styles.avatarContainer}>
                            <Image source={imageSource} style={styles.avatarImage} resizeMode="cover" />
                            {isVerified && (
                                <View style={styles.badgeWrapper}>
                                    <VerifiedIcon width={getHeight(20)} height={getHeight(20)} />
                                </View>
                            )}
                        </View>

                        <View style={styles.infoColumn}>
                            <View style={styles.nameRow}>
                                <TextView text={doctor?.name || ''} style={styles.doctorName} numberOfLines={1} />
                                <View style={styles.ratingBadge}>
                                    <StarIcon width={getHeight(12)} height={getHeight(12)} />
                                    <TextView text={ratingText} style={styles.ratingText} />
                                </View>
                            </View>

                            <TextView text={specialtyText} style={styles.specialtyText} numberOfLines={1} />

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <BriefcaseIcon width={getHeight(14)} height={getHeight(14)} />
                                    <TextView text={`${experienceYears} ${cardTranslations.yearsExp}`} style={styles.metaText} />
                                </View>

                                <TextView text="•" style={styles.dotSeparator} />

                                <View style={styles.languagesContainer}>
                                    <GlobeIcon width={getHeight(14)} height={getHeight(14)} />
                                    <TextView text={languagesText} style={styles.languagesText} numberOfLines={2} />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.consultationContainer}>
                        <TextView text={cardTranslations.consultation || 'Consultation'} style={styles.boxLabel} />
                        <TextView text={`₹${consultationFee}`} style={styles.boxValueDark} />
                    </View>

                    <Button
                        title={buttonTitle}
                        onPress={handlePressDoctor}
                        variant="primary"
                        style={styles.bookButton}
                    />
                </Pressable>
            )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.white,
        borderRadius: getHeight(20),
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        elevation: 2,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarContainer: {
        position: 'relative',
        width: getHeight(80),
        height: getHeight(80),
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: getHeight(16),
    },
    badgeWrapper: {
        position: 'absolute',
        top: 2,
        right: 2,
    },
    infoColumn: {
        flex: 1,
        marginLeft: 14,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    doctorName: {
        fontSize: getHeight(15),
        color: colors.textDark,
        flex: 1,
        marginRight: 6,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.ratingBadgeBg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: getHeight(10),
    },
    ratingText: {
        fontSize: getHeight(10),
        color: colors.textDark,
        marginLeft: 4,
    },
    specialtyText: {
        fontSize: getHeight(12),
        color: colors.darkGreen,
        marginTop: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metaText: {
        fontSize: getHeight(10),
        color: colors.textSecondary,
        marginLeft: 5,
    },
    languagesText: {
        fontSize: getHeight(10),
        color: colors.textSecondary,
        marginLeft: 5,
        flex: 1,
    },
    dotSeparator: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        marginHorizontal: 6,
    },
    consultationContainer: {
        backgroundColor: colors.infoBoxBg,
        borderRadius: getHeight(14),
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginTop: 16,
        alignItems: 'center',
    },
    boxLabel: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        marginBottom: 4,
    },
    boxValueDark: {
        fontSize: getHeight(16),
        color: colors.textDark,
        fontWeight: '700',
    },
    bookButton: {
        marginTop: 14,
    },
})

export default React.memo(DoctorCard)
