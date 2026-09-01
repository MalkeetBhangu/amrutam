import React from 'react'
import { StyleSheet, View, TextInput, Pressable } from 'react-native'
import { search as SearchIcon, filter as FilterIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import HeaderRow from 'src/components/sharedComponents/HeaderRow'
import { getHeight } from 'src/libs/StyleHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
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
            <HeaderRow title={shopTexts?.logoText?.toUpperCase()} rightText={shopTexts?.pageTitle} style={styles.headerRowStyle} />
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
    headerRowStyle: {
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 16,
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
