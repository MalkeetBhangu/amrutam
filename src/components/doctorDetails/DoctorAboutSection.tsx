import React from 'react'
import { StyleSheet, View } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'

import { useUserState } from '@src/store/UseUserStore'

export interface DoctorAboutSectionProps {
    aboutText?: string
}

const DoctorAboutSection: React.FC<DoctorAboutSectionProps> = ({ aboutText }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const detailsText = t.doctors.details

    if (!aboutText) return null

    return (
        <View style={styles.sectionContainer}>
            <TextView text={detailsText.about} style={styles.sectionTitle} />
            <TextView text={aboutText} style={styles.aboutBody} />
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
    },
    aboutBody: {
        fontSize: getHeight(13.5),
        color: colors.textSecondary,
        lineHeight: getHeight(22),
        marginTop: 10,
    },
})

export default React.memo(DoctorAboutSection)
