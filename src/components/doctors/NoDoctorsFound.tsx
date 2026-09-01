import React from 'react'
import { StyleSheet, View } from 'react-native'
import { filterClearIcon as FilterClearIcon, noDoctor as NoDoctorIllustration } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import Button from 'src/components/sharedComponents/Button'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { useUserState } from '@src/store/UseUserStore'

export interface NoDoctorsFoundProps {
    onClearFilters?: () => void
    onGoBack?: () => void
}

const NoDoctorsFound: React.FC<NoDoctorsFoundProps> = ({ onClearFilters, onGoBack }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const noResultsTranslations = t.doctors?.noResults || {}

    return (
        <View style={styles.container}>
            <View style={styles.illustrationContainer}>
                <NoDoctorIllustration width={getHeight(140)} height={getHeight(140)} />
            </View>
            <TextView text={noResultsTranslations.title} style={styles.titleText} />
            <TextView text={noResultsTranslations.subtitle} style={styles.subtitleText} />
            <View style={styles.buttonGroup}>
                {onClearFilters && <Button title={noResultsTranslations.clearAllFilters} onPress={onClearFilters} variant="primary" leftIcon={<FilterClearIcon width={getHeight(18)} height={getHeight(18)} />} />}
                {onGoBack && <Button title={noResultsTranslations.goBack} onPress={onGoBack} variant="outline" />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 30,
        paddingBottom: 40,
    },
    illustrationContainer: {
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: getHeight(20),
        color: colors.textDark,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitleText: {
        fontSize: getHeight(13.5),
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: getHeight(21),
        marginBottom: 28,
    },
    buttonGroup: {
        width: '100%',
        gap: 12,
    },
})

export default React.memo(NoDoctorsFound)
