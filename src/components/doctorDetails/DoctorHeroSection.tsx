import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { star as StarIcon, clockIcon as ClockIcon, verified as VerifiedIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'

export interface DoctorHeroSectionProps {
    imageSource: any
    isVerified: boolean
    doctorName?: string
    specialtyText?: string
    ratingVal?: string | null
    reviewsCountText?: string | number | null
    experienceYears?: number | string | null
}

const DoctorHeroSection: React.FC<DoctorHeroSectionProps> = ({
    imageSource,
    isVerified,
    doctorName,
    specialtyText,
    ratingVal,
    reviewsCountText,
    experienceYears,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const detailsText = t.doctors.details

    return (
        <View style={styles.heroSection}>
            <View style={styles.avatarContainer}>
                <Image source={imageSource} style={styles.doctorAvatar} resizeMode="cover" />
                {isVerified && (
                    <View style={styles.badgeWrapper}>
                        <VerifiedIcon width={getHeight(24)} height={getHeight(24)} />
                    </View>
                )}
            </View>

            {Boolean(doctorName) && <TextView text={doctorName} style={styles.doctorName} />}
            {Boolean(specialtyText) && <TextView text={specialtyText} style={styles.specialtyText} />}

            {/* Stats Badges */}
            <View style={styles.badgesRow}>
                {ratingVal != null && (
                    <View style={styles.badgePill}>
                        <StarIcon width={getHeight(13)} height={getHeight(13)} fill={colors.darkGreen} color={colors.darkGreen} />
                        <TextView text={` ${ratingVal}`} style={styles.badgeBoldText} />
                        {reviewsCountText != null && (
                            <TextView text={` (${reviewsCountText} ${detailsText.reviews})`} style={styles.badgeSubText} />
                        )}
                    </View>
                )}

                {experienceYears != null && (
                    <View style={styles.badgePill}>
                        <ClockIcon width={getHeight(13)} height={getHeight(13)} />
                        <TextView text={` ${experienceYears} ${detailsText.yrs}`} style={styles.badgeBoldText} />
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
