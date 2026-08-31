import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { emptyBasket as EmptyBasketIcon, arrowRight as ArrowRightIcon } from 'assets'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'

export interface EmptyWishlistProps {
    onExploreShopPress?: () => void
}

const EmptyWishlist: React.FC<EmptyWishlistProps> = ({ onExploreShopPress }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const textData = getTexts(languageCode)
    const wishlistTexts = textData.wishlist

    return (
        <View style={styles.container}>
            <View style={styles.illustrationWrapper}>
                <EmptyBasketIcon width={getHeight(200)} height={getHeight(200)} />
            </View>
            <TextView text={wishlistTexts.emptyTitle} style={styles.titleText} />
            <TextView text={wishlistTexts.emptySubtitle} style={styles.subtitleText} />
            <Pressable style={styles.exploreButton} onPress={onExploreShopPress} hitSlop={6}>
                <TextView text={wishlistTexts.exploreShop} style={styles.exploreText} />
                <ArrowRightIcon width={getHeight(16)} height={getHeight(16)} color={colors.white} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 40,
        paddingBottom: 60,
    },
    illustrationWrapper: {
        width: getHeight(220),
        height: getHeight(220),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    titleText: {
        fontSize: getHeight(20),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitleText: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: getHeight(22),
        marginBottom: 30,
    },
    exploreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.darkGreen,
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: getHeight(25),
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    exploreText: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.white,
        marginRight: 8,
    },
})

export default React.memo(EmptyWishlist)
