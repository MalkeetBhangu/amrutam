import React, { useMemo } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { star as StarIcon, clockIcon as ClockIcon, verified as VerifiedIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'
import { Doctor } from '@src/types/DoctorTypes'

export interface DoctorHeroSectionProps {
    doctor: Doctor

}

const DoctorHeroSection: React.FC<DoctorHeroSectionProps> = ({ doctor }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const detailsText = t.doctors.details
    const { rating, experience, verified, image, name, specialization, reviewCount } = doctor

    const imageSource = useMemo(() => {
        if (!image) return { uri: DEFAULT_AVATAR }
        return { uri: image }
    }, [image])

    return (
        <View style={styles.heroSection}>
            <View style={styles.avatarContainer}>
                <Image source={imageSource} style={styles.doctorAvatar} resizeMode="cover" />
                {verified && (
                    <View style={styles.badgeWrapper}>
                        <VerifiedIcon width={getHeight(24)} height={getHeight(24)} />
                    </View>
                )}
            </View>

            {name && <TextView text={name} style={styles.doctorName} />}
            {specialization && <TextView text={specialization} style={styles.specialtyText} />}

            <View style={styles.badgesRow}>
                {rating != null && (
                    <View style={styles.badgePill}>
                        <StarIcon width={getHeight(13)} height={getHeight(13)} fill={colors.darkGreen} color={colors.darkGreen} />
                        <TextView text={` ${rating.toString()}`} style={styles.badgeBoldText} />
                        {reviewCount != null && (
                            <TextView text={` (${reviewCount.toString()} ${detailsText.reviews})`} style={styles.badgeSubText} />
                        )}
                    </View>
                )}

                {experience != null && (
                    <View style={styles.badgePill}>
                        <ClockIcon width={getHeight(13)} height={getHeight(13)} />
                        <TextView text={` ${experience} ${detailsText.yrs}`} style={styles.badgeBoldText} />
                        <TextView text={` ${detailsText.exp}`} style={styles.badgeSubText} />
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    heroSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        width: getHeight(110),
        height: getHeight(110),
        borderRadius: getHeight(55),
        marginBottom: 16,
    },
    doctorAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: getHeight(55),
    },
    badgeWrapper: {
        position: 'absolute',
        bottom: 2,
        right: 2,
    },
    doctorName: {
        fontSize: getHeight(22),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
    },
    specialtyText: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    badgesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        gap: 10,
    },
    badgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.pillBg,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: getHeight(18),
    },
    badgeBoldText: {
        fontSize: getHeight(12),
        fontWeight: '700',
        color: colors.textDark,
    },
    badgeSubText: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
    },
})

export default React.memo(DoctorHeroSection)
