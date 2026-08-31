import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { emptyBasket as EmptyBasketIcon, bag as BagIcon } from 'assets'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { useUserState } from '@src/store/UseUserStore'

export interface EmptyCartProps {
    onShopNowPress?: () => void
}

const EmptyCart: React.FC<EmptyCartProps> = ({ onShopNowPress }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const textData = getTexts(languageCode)
    const cartTexts = textData.cart

    return (
        <View style={styles.container}>
            <View style={styles.illustrationWrapper}>
                <EmptyBasketIcon width={getHeight(230)} height={getHeight(230)} />
            </View>
            <TextView text={cartTexts.emptyCartTitle} style={styles.titleText} />
            <TextView text={cartTexts.emptyCartSubtitle} style={styles.subtitleText} />
            <Pressable style={styles.shopNowButton} onPress={onShopNowPress}>
                <BagIcon width={getHeight(18)} height={getHeight(18)} color={colors.white} />
                <TextView text={cartTexts.shopNow} style={styles.shopNowText} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 60,
    },
    illustrationWrapper: {
        width: getHeight(240),
        height: getHeight(240),
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    basketImage: {
        width: '100%',
        height: '100%',
        borderRadius: getHeight(20),
    },
    titleText: {
        fontSize: getHeight(22),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitleText: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: getHeight(21),
        marginBottom: 32,
        paddingHorizontal: 12,
    },
    shopNowButton: {
        width: '100%',
        height: getHeight(50),
        backgroundColor: colors.darkGreen,
        borderRadius: getHeight(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    shopNowText: {
        fontSize: getHeight(16),
        fontWeight: '600',
        color: colors.white,
        marginLeft: 10,
    },
})

export default React.memo(EmptyCart)
