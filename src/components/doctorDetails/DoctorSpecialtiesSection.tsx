import React from 'react'
import { StyleSheet, View } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'

export interface DoctorSpecialtiesSectionProps {
    specialties: string
}

const DoctorSpecialtiesSection: React.FC<DoctorSpecialtiesSectionProps> = ({ specialties }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const detailsText = t.doctors.details


    return (
        <View style={styles.sectionContainer}>
            <TextView text={detailsText.specialtiesAndExpertise} style={styles.sectionTitle} />
            <View style={styles.chipsContainer}>
                <View style={styles.chipPill}>
                    <TextView text={specialties} style={styles.chipText} />
                </View>
            </View>
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
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    chipPill: {
        backgroundColor: colors.chipBg,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: getHeight(12),
    },
    chipText: {
        fontSize: getHeight(13),
        color: colors.chipText,
        fontWeight: '500',
    },
})

export default React.memo(DoctorSpecialtiesSection)
