import React, { useState, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { search as SearchIcon, filter as FilterIcon } from 'assets'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import TextInput from '@src/components/sharedComponents/TextInput'
import TextView from '@src/components/sharedComponents/TextView'
import HeaderRow from '@src/components/sharedComponents/HeaderRow'

import UpcomingConsultationCard from './UpcomingConsultationCard'
import { useUserState } from '@src/store/UseUserStore'

export interface DoctorHeaderProps {
    onFilterPress?: () => void
    searchQuery?: string
    onSearchChange?: (text: string) => void
    upcomingBooking?: any
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ onFilterPress, searchQuery: externalSearchQuery, onSearchChange, upcomingBooking, }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const [internalSearchQuery, setInternalSearchQuery] = useState('')
    const searchQuery = externalSearchQuery ?? internalSearchQuery
    const handleSearchChange = useCallback((text: string) => {
        if (onSearchChange) {
            onSearchChange(text)
        } else {
            setInternalSearchQuery(text)
        }
    }, [onSearchChange])

    return (
        <View style={styles.headerContainer}>
            <HeaderRow title={t.doctors.logoText.toUpperCase()} style={styles.headerRowStyle} />

            {upcomingBooking && <UpcomingConsultationCard booking={upcomingBooking} />}

            <View style={styles.titleSection}>
                <TextView style={styles.titleText} text={t.doctors.findDoctorTitle} />
                <TextView style={styles.subtitleText} text={t.doctors.findDoctorSubtitle} />
            </View>

            <TextInput
                containerStyle={styles.searchContainer}
                inputContainerStyle={styles.searchBarContainer}
                inputStyle={styles.searchInput}
                leftIcon={<SearchIcon width={getHeight(18)} height={getHeight(18)} fill={colors.iconGray} color={colors.iconGray} />}
                rightIcon={<FilterIcon width={getHeight(18)} height={getHeight(20)} fill={colors.darkGreen} color={colors.darkGreen} />}
                onRightIconPress={onFilterPress}
                placeholder={t.doctors.searchPlaceholder}
                placeholderTextColor={colors.placeholderColor}
                value={searchQuery}
                onChangeText={handleSearchChange}
                autoCapitalize="none"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.screenBackground,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    headerRowStyle: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
    },
    titleSection: {
        marginTop: 20,
    },
    titleText: {
        fontSize: getHeight(22),
        color: colors.textDark,
        lineHeight: getHeight(28),
    },
    subtitleText: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        marginTop: 6,
        lineHeight: getHeight(20),
    },
    searchContainer: {
        marginBottom: 0,
        marginTop: 18,
    },
    searchBarContainer: {
        backgroundColor: colors.searchBg,
        borderRadius: getHeight(16),
        height: getHeight(50),
        paddingHorizontal: 14,
    },
    searchInput: {
        fontSize: getHeight(13.5),
        color: colors.textDark,
    },
})

export default React.memo(DoctorHeader)
