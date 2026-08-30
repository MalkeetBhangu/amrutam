import React, { useState } from 'react'
import { View, StyleSheet, Image, Pressable } from 'react-native'
import { logo, search as SearchIcon, filter as FilterIcon } from 'assets'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import TextInput from '@src/components/sharedComponents/TextInput'
import TextView from '@src/components/sharedComponents/TextView'

import UpcomingConsultationCard from './UpcomingConsultationCard'

export interface DoctorHeaderProps {
    onFilterPress?: () => void
    searchQuery?: string
    onSearchChange?: (text: string) => void
    upcomingBooking?: any
    allBookings?: any[]
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({
    onFilterPress,
    searchQuery: externalSearchQuery,
    onSearchChange,
    upcomingBooking,
    allBookings,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const [internalSearchQuery, setInternalSearchQuery] = useState('')

    const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery
    const handleSearchChange = (text: string) => {
        if (onSearchChange) {
            onSearchChange(text)
        } else {
            setInternalSearchQuery(text)
        }
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.topRow}>
                <View style={styles.logoWrapper}>
                    <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                    <TextView style={styles.logoText} text={t.doctors.logoText.toUpperCase()} />
                </View>
                <Pressable onPress={() => { }} style={styles.avatarWrapper}>
                    <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatarImage} resizeMode="cover" />
                </Pressable>
            </View>

            {Boolean(upcomingBooking) && <UpcomingConsultationCard booking={upcomingBooking} allBookings={allBookings} />}

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

export default DoctorHeader
