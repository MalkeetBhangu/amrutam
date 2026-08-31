import React from 'react'
import { StyleSheet, View, Image, TextInput, Pressable } from 'react-native'
import { logo, search as SearchIcon, filter as FilterIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'

export interface ShopHeaderProps {
    searchQuery: string
    onChangeSearchQuery: (text: string) => void
    onOpenFilter?: () => void
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ searchQuery, onChangeSearchQuery, onOpenFilter, }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const shopTexts = t.shop

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.logoRow}>
                    <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                    <TextView text={shopTexts?.logoText?.toUpperCase()} style={styles.brandTitle} />
                </View>
                <View style={styles.rightHeaderRow}>
                    <TextView text={shopTexts?.pageTitle} style={styles.pageTitle} />
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatarImage} />
                    </View>
                </View>
            </View>
            <TextView text={shopTexts?.mainTitle} style={styles.mainTitle} />

            <View style={styles.searchRow}>
                <View style={styles.searchInputContainer}>
                    <SearchIcon width={getHeight(18)} height={getHeight(18)} color={colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={shopTexts?.searchPlaceholder}
                        placeholderTextColor={colors.placeholderColor}
                        value={searchQuery}
                        onChangeText={onChangeSearchQuery}
                    />
                </View>

                <Pressable style={styles.filterButton} onPress={onOpenFilter}>
                    <FilterIcon width={getHeight(18)} height={getHeight(18)} color={colors.textDark} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: getHeight(28),
        height: getHeight(28),
        marginRight: 8,
    },
    brandTitle: {
        fontSize: getHeight(16),
        fontWeight: '800',
        color: colors.darkGreen,
        letterSpacing: 1.1,
    },
    rightHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.textDark,
        marginRight: 10,
    },
    avatarWrapper: {
        width: getHeight(36),
        height: getHeight(36),
        borderRadius: getHeight(18),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.avatarBorder,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    mainTitle: {
        fontSize: getHeight(24),
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 16,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.searchBg,
        borderRadius: getHeight(14),
        paddingHorizontal: 14,
        height: getHeight(46),
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: getHeight(14),
        color: colors.textDark,
        paddingVertical: 0,
    },
    filterButton: {
        width: getHeight(46),
        height: getHeight(46),
        borderRadius: getHeight(14),
        backgroundColor: colors.searchBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default React.memo(ShopHeader)
