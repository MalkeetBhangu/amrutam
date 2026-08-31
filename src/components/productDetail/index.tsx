import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native'
import useAddToCart from '@src/apis/useAddToCart'
import useAddToWishlist from '@src/apis/useAddToWishlist'
import useGetWishlist from '@src/apis/useGetWishlist'
import useRemoveFromWishlist from '@src/apis/useRemoveFromWishlist'
import { useUserState } from '@src/store/UseUserStore'
import {
    churna as ChurnaImg,
    heartFilled as HeartFilledIcon,
    heartIcon as HeartIcon,
    minus as MinusIcon,
    plus as PlusIcon,
    share as ShareIcon,
    star as StarIcon,
    whiteBack as WhiteBackIcon,
} from 'assets'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    View
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE, DEFAULT_TAGS } from 'src/constants/Constants'
import { Screens } from 'src/constants/Screens'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'
import { ProductItem } from 'src/types/ProductTypes'


const ProductDetail: React.FC = () => {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const insets = useSafeAreaInsets()
    const isFocused = useIsFocused()
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE, userId } } = useUserState(['languageCode', 'userId'])
    const t = getTexts(languageCode)
    const detailTexts = t?.productDetail || {}
    const product: ProductItem = route.params?.product
    const { mutate: addToCartMutate } = useAddToCart()
    const { mutate: addToWishlistMutate } = useAddToWishlist()
    const { mutate: removeFromWishlistMutate } = useRemoveFromWishlist()
    const { data: wishlistData } = useGetWishlist(userId)
    const isInitiallyWishlisted = useMemo(() => { return wishlistData?.data?.items?.some((i: any) => (i.productId || i.id) === product.id) }, [wishlistData, product.id])
    const [isWishlisted, setIsWishlisted] = useState(isInitiallyWishlisted)
    const [quantity, setQuantity] = useState(1)
    const [imgError, setImgError] = useState(false)

    useEffect(() => { setIsWishlisted(isInitiallyWishlisted) }, [isInitiallyWishlisted])

    const handleBackPress = useCallback(() => { navigation.goBack() }, [navigation])
    const handleSharePress = useCallback(async () => {
        try {
            await Share.share({
                title: product.name,
                message: `Check out ${product.name} on Amrutam! Only ₹${product.price}\n\nhttps://amrutam.co.in`,
            })
        } catch (err) {
            console.error('Error sharing product:', err)
        }
    }, [product.name, product.price])

    const handleWishlistToggle = useCallback(() => {
        const nextState = !isWishlisted
        setIsWishlisted(nextState)
        if (nextState) addToWishlistMutate({ userId: userId, productId: product.id })
        else removeFromWishlistMutate({ userId: userId, productId: product.id })

    }, [isWishlisted, addToWishlistMutate, removeFromWishlistMutate, product.id])

    const handleIncrement = useCallback(() => { setQuantity((prev) => Math.min(prev + 1, product.stock || 20)) }, [product.stock])
    const handleDecrement = useCallback(() => { setQuantity((prev) => Math.max(prev - 1, 1)) }, [])

    const handleAddToCart = useCallback(() => {
        addToCartMutate({ userId: userId, productId: product.id, quantity, })
        Alert.alert(detailTexts.addedToCart ? '' : 'Success', detailTexts.addedToCart || '')
    }, [addToCartMutate, product.id, quantity, detailTexts.addedToCart])

    const handleBuyNow = useCallback(() => {
        addToCartMutate({ userId: userId, productId: product.id, quantity, })
        navigation.navigate(Screens.CART)
    }, [addToCartMutate, product.id, quantity, navigation])

    const currentPrice = Number(product.price || product.discountPrice || 599)
    const originalPrice = Math.round(currentPrice * 1.33)
    const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 25
    const imageSource = imgError || !product?.image ? ChurnaImg : { uri: product.image }
    const ratingVal = product.rating != null ? Number(product.rating).toFixed(1) : '4.8'
    const reviewsCount = product.reviewsCount || 1842
    const stockCount = product.stock || 128
    const tagsList = product.tags && product.tags.length > 0 ? product.tags : DEFAULT_TAGS
    const sizeText = product.size || product.weight
    const categoryText = (product.category || 'Hair').toUpperCase()

    return (
        <View style={styles.screenContainer}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkGreen }}>
                {isFocused && (<StatusBar barStyle="light-content" backgroundColor={colors.darkGreen} />)}
                <View style={styles.topNavBar}>
                    <Pressable onPress={handleBackPress} style={styles.navIconButton} hitSlop={10}>
                        <WhiteBackIcon width={getHeight(22)} height={getHeight(22)} />
                    </Pressable>
                    <TextView text={detailTexts.title} style={styles.navTitleText} />
                    <Pressable onPress={handleSharePress} style={styles.navIconButton} hitSlop={10}>
                        <ShareIcon width={getHeight(20)} height={getHeight(20)} stroke={colors.white} color={colors.white} />
                    </Pressable>
                </View>
            </SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} >
                <View style={styles.imageCardContainer}>
                    <Image source={imageSource} style={styles.heroImage} resizeMode="cover" onError={() => setImgError(true)} />
                    <View style={styles.badgeContainer}>
                        <TextView text={product.badge || detailTexts.bestseller} style={styles.badgeText} />
                    </View>
                    <Pressable style={[styles.heartButton, isWishlisted && styles.heartButtonActive]} onPress={handleWishlistToggle} hitSlop={8} >
                        {isWishlisted ? (
                            <HeartFilledIcon width={getHeight(20)} height={getHeight(20)} color={colors.heartActiveRed} />
                        ) : (
                            <HeartIcon width={getHeight(20)} height={getHeight(20)} color={colors.textDark} />
                        )}
                    </Pressable>
                </View>
                <View style={styles.metaContainer}>
                    <View style={styles.brandRow}>
                        <TextView text={`AMRUTAM · ${categoryText}`} style={styles.brandCategoryText} />
                        <TextView text={sizeText} style={styles.sizeText} />
                    </View>
                    <TextView text={product.name} style={styles.productTitleText} />
                    <TextView text={product.subtitle} style={styles.subtitleText} />
                    <View style={styles.ratingRow}>
                        <StarIcon width={getHeight(16)} height={getHeight(16)} color={colors.darkGreen} />
                        <TextView text={ratingVal} style={styles.ratingScoreText} />
                        <TextView text={`(${reviewsCount.toLocaleString()} ${detailTexts.reviews || ''})`} style={styles.reviewsCountText} />
                    </View>

                    <View style={styles.priceRow}>
                        <TextView text={`₹${currentPrice}`} style={styles.currentPriceText} />
                        <TextView text={`₹${originalPrice}`} style={styles.originalPriceText} />
                        <TextView text={`${discountPercent}% ${detailTexts.off || ''}`} style={styles.discountText} />
                    </View>

                    <TextView text={`${detailTexts.inStock} · ${stockCount} ${detailTexts.left || ''}`} style={styles.stockStatusText} />
                    <View style={styles.tagsRow}>
                        {tagsList.map((tag, index) => (
                            <View key={index} style={styles.tagPill}>
                                <TextView text={tag} style={styles.tagText} />
                            </View>
                        ))}
                    </View>
                    <View style={styles.aboutSection}>
                        <TextView text={detailTexts.aboutProduct} style={styles.aboutTitleText} />
                        <TextView text={product.description || detailTexts.defaultAbout} style={styles.aboutBodyText} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.quantityRow}>
                        <TextView text={detailTexts.quantity} style={styles.quantityLabelText} />
                        <View style={styles.stepperContainer}>
                            <Pressable onPress={handleDecrement} style={styles.stepperButton} hitSlop={8}>
                                <MinusIcon width={getHeight(14)} height={getHeight(14)} color={colors.textDark} />
                            </Pressable>
                            <TextView text={String(quantity)} style={styles.quantityValueText} />
                            <Pressable onPress={handleIncrement} style={styles.stepperButton} hitSlop={8}>
                                <PlusIcon width={getHeight(14)} height={getHeight(14)} color={colors.textDark} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={[styles.bottomFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
                    <TextView text={detailTexts.addToCart} style={styles.addToCartButtonText} />
                </Pressable>

                <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
                    <TextView text={detailTexts.buyNow} style={styles.buyNowButtonText} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: colors.white,
    },
    topNavBar: {
        backgroundColor: colors.darkGreen,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 14,
    },
    navIconButton: {
        width: getHeight(36),
        height: getHeight(36),
        alignItems: 'center',
        justifyContent: 'center',
    },
    navTitleText: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    imageCardContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        height: getHeight(360),
        borderRadius: getHeight(24),
        overflow: 'hidden',
        backgroundColor: colors.infoBoxBg,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: colors.badgeRed,
        borderRadius: getHeight(14),
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    badgeText: {
        color: colors.white,
        fontSize: getHeight(12),
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    heartButton: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: getHeight(38),
        height: getHeight(38),
        borderRadius: getHeight(19),
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    heartButtonActive: {
        backgroundColor: colors.white,
    },
    metaContainer: {
        paddingHorizontal: 18,
        marginTop: 16,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    brandCategoryText: {
        fontSize: getHeight(13),
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    sizeText: {
        fontSize: getHeight(14),
        fontWeight: '500',
        color: colors.textSecondary,
    },
    productTitleText: {
        fontSize: getHeight(22),
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 4,
        lineHeight: getHeight(28),
    },
    subtitleText: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        marginBottom: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    ratingScoreText: {
        fontSize: getHeight(15),
        fontWeight: '700',
        color: colors.textDark,
        marginLeft: 6,
    },
    reviewsCountText: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        marginLeft: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    currentPriceText: {
        fontSize: getHeight(26),
        fontWeight: '700',
        color: colors.textDark,
    },
    originalPriceText: {
        fontSize: getHeight(16),
        color: colors.placeholderColor,
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    discountText: {
        fontSize: getHeight(16),
        fontWeight: '600',
        color: colors.primaryGreen,
        marginLeft: 8,
    },
    stockStatusText: {
        fontSize: getHeight(13),
        fontWeight: '500',
        color: colors.darkGreen,
        marginBottom: 16,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tagPill: {
        backgroundColor: colors.pillBg,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: getHeight(14),
        marginRight: 10,
        marginBottom: 8,
    },
    tagText: {
        color: colors.darkGreen,
        fontSize: getHeight(13),
        fontWeight: '600',
    },
    aboutSection: {
        marginBottom: 16,
    },
    aboutTitleText: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 8,
    },
    aboutBodyText: {
        fontSize: getHeight(14),
        lineHeight: getHeight(22),
        color: colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dividerBg,
        marginBottom: 18,
    },
    quantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    quantityLabelText: {
        fontSize: getHeight(16),
        fontWeight: '600',
        color: colors.textDark,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: colors.chipBorder,
        borderRadius: getHeight(20),
        paddingHorizontal: 12,
        paddingVertical: 6,
        width: getHeight(130),
    },
    stepperButton: {
        width: getHeight(28),
        height: getHeight(28),
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityValueText: {
        fontSize: getHeight(15),
        fontWeight: '700',
        color: colors.textDark,
    },
    bottomFooter: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderColor: colors.dividerBg,
        paddingHorizontal: 16,
        paddingTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 8,
    },
    addToCartButton: {
        flex: 1,
        height: getHeight(50),
        borderRadius: getHeight(14),
        borderWidth: 1.5,
        borderColor: colors.textDark,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartButtonText: {
        color: colors.textDark,
        fontSize: getHeight(15),
        fontWeight: '700',
    },
    buyNowButton: {
        flex: 1,
        height: getHeight(50),
        borderRadius: getHeight(14),
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyNowButtonText: {
        color: colors.white,
        fontSize: getHeight(15),
        fontWeight: '700',
    },
})

export default ProductDetail