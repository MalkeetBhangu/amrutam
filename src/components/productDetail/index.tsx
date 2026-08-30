import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Pressable,
    Share,
    Alert,
    Dimensions,
    StatusBar,
} from 'react-native'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'
import {
    whiteBack as WhiteBackIcon,
    share as ShareIcon,
    heartIcon as HeartIcon,
    heartFilled as HeartFilledIcon,
    star as StarIcon,
    plus as PlusIcon,
    minus as MinusIcon,
} from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { Screens } from 'src/constants/Screens'
import { ProductItem } from 'src/types/ProductTypes'
import useAddToCart from '@src/apis/useAddToCart'
import useAddToWishlist from '@src/apis/useAddToWishlist'
import useRemoveFromWishlist from '@src/apis/useRemoveFromWishlist'
import useGetWishlist from '@src/apis/useGetWishlist'

const DEFAULT_PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1608248597263-00079e9653a9?w=800',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=800',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800',
]

const DEFAULT_TAGS = ['Organic', 'Ayurvedic', 'Vegan']

const ProductDetail: React.FC = () => {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const insets = useSafeAreaInsets()
    const isFocused = useIsFocused()

    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const detailTexts = (t as any)?.productDetail || {}

    // Product passed from route params, or fallback mock
    const product: ProductItem = route.params?.product || {
        id: '1',
        name: 'Kuntal Care Hair Spa',
        subtitle: 'Revitalizing Herbal',
        category: 'Hair',
        price: 599,
        discountPrice: 599,
        rating: 4.8,
        reviewsCount: 1842,
        stock: 128,
        badge: 'Bestseller',
        image: 'https://images.unsplash.com/photo-1608248597263-00079e9653a9?w=800',
        tags: ['Organic', 'Ayurvedic', 'Vegan'],
        size: '200ml',
    }

    const { mutate: addToCartMutate } = useAddToCart()
    const { mutate: addToWishlistMutate } = useAddToWishlist()
    const { mutate: removeFromWishlistMutate } = useRemoveFromWishlist()
    const { data: wishlistData } = useGetWishlist('guest')

    const isInitiallyWishlisted = useMemo(() => {
        const raw: any = wishlistData
        let items: any[] = []
        if (Array.isArray(raw?.data?.items)) items = raw.data.items
        else if (Array.isArray(raw?.data)) items = raw.data
        else if (Array.isArray(raw?.items)) items = raw.items
        else if (Array.isArray(raw)) items = raw

        return items.some((i: any) => (i.productId || i.id) === product.id)
    }, [wishlistData, product.id])

    const [isWishlisted, setIsWishlisted] = useState(isInitiallyWishlisted)
    const [quantity, setQuantity] = useState(1)
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        setIsWishlisted(isInitiallyWishlisted)
    }, [isInitiallyWishlisted])

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

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
        if (nextState) {
            addToWishlistMutate({ userId: 'guest', productId: product.id })
        } else {
            removeFromWishlistMutate({ userId: 'guest', productId: product.id })
        }
    }, [isWishlisted, addToWishlistMutate, removeFromWishlistMutate, product.id])

    const handleIncrement = useCallback(() => {
        setQuantity((prev) => Math.min(prev + 1, product.stock || 20))
    }, [product.stock])

    const handleDecrement = useCallback(() => {
        setQuantity((prev) => Math.max(prev - 1, 1))
    }, [])

    const handleAddToCart = useCallback(() => {
        addToCartMutate({
            userId: 'guest',
            productId: product.id,
            quantity,
        })
        Alert.alert('Success', detailTexts.addedToCart || 'Added to cart successfully!')
    }, [addToCartMutate, product.id, quantity, detailTexts.addedToCart])

    const handleBuyNow = useCallback(() => {
        addToCartMutate({
            userId: 'guest',
            productId: product.id,
            quantity,
        })
        navigation.navigate(Screens.CART)
    }, [addToCartMutate, product.id, quantity, navigation])

    // Price Calculations
    const currentPrice = Number(product.price || product.discountPrice || 599)
    const originalPrice = Math.round(currentPrice * 1.33) // e.g. 799 for 599
    const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100) || 25

    // Image URL resolution
    const fallbackUri = DEFAULT_PRODUCT_IMAGES[
        Math.abs(product.id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0) % DEFAULT_PRODUCT_IMAGES.length
    ]

    const resolveImageUrl = (urlStr?: string | null): string => {
        if (!urlStr || typeof urlStr !== 'string' || urlStr.trim() === '') {
            return fallbackUri
        }
        const trimmed = urlStr.trim()
        if (
            trimmed.includes('example.com') ||
            trimmed.includes('via.placeholder.com') ||
            trimmed.includes('placeholder.com') ||
            trimmed.includes('invalid-url')
        ) {
            return fallbackUri
        }
        if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
            const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || ''
            const match = baseUrl.match(/^https?:\/\/[^\/]+/)
            const host = match ? match[0] : 'http://10.0.2.2:3000'
            return trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, host)
        }
        return trimmed
    }

    const resolvedUri = resolveImageUrl(product.image)
    const imageSource = !imgError ? { uri: resolvedUri } : { uri: fallbackUri }

    const ratingVal = product.rating != null ? Number(product.rating).toFixed(1) : '4.8'
    const reviewsCount = product.reviewsCount || 1842
    const stockCount = product.stock || 128
    const tagsList = product.tags && product.tags.length > 0 ? product.tags : DEFAULT_TAGS
    const sizeText = product.size || product.weight || '200ml'
    const categoryText = (product.category || 'Hair').toUpperCase()

    return (
        <View style={styles.screenContainer}>
            {/* Top Green Notch & Header for iOS and Android */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.darkGreen }}>
                {isFocused && (
                    <StatusBar
                        barStyle="light-content"
                        backgroundColor={colors.darkGreen}
                    />
                )}
                <View style={styles.topNavBar}>
                    <Pressable onPress={handleBackPress} style={styles.navIconButton} hitSlop={10}>
                        <WhiteBackIcon width={getHeight(22)} height={getHeight(22)} />
                    </Pressable>
                    <TextView text={detailTexts.title || 'Product details'} style={styles.navTitleText} />
                    <Pressable onPress={handleSharePress} style={styles.navIconButton} hitSlop={10}>
                        <ShareIcon width={getHeight(20)} height={getHeight(20)} stroke={colors.white} color={colors.white} />
                    </Pressable>
                </View>
            </SafeAreaView>

            {/* Scrollable Main Content */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero Product Image Card */}
                <View style={styles.imageCardContainer}>
                    <Image
                        source={imageSource}
                        style={styles.heroImage}
                        resizeMode="cover"
                        onError={() => setImgError(true)}
                    />

                    {/* Bestseller Badge */}
                    <View style={styles.badgeContainer}>
                        <TextView
                            text={product.badge || detailTexts.bestseller || 'Bestseller'}
                            style={styles.badgeText}
                        />
                    </View>

                    {/* Wishlist Heart Button */}
                    <Pressable
                        style={[styles.heartButton, isWishlisted && styles.heartButtonActive]}
                        onPress={handleWishlistToggle}
                        hitSlop={8}
                    >
                        {isWishlisted ? (
                            <HeartFilledIcon
                                width={getHeight(20)}
                                height={getHeight(20)}
                                color="#C62828"
                            />
                        ) : (
                            <HeartIcon
                                width={getHeight(20)}
                                height={getHeight(20)}
                                color="#101828"
                            />
                        )}
                    </Pressable>
                </View>

                {/* Product Meta Section */}
                <View style={styles.metaContainer}>
                    {/* Brand/Category & Size Row */}
                    <View style={styles.brandRow}>
                        <TextView
                            text={`AMRUTAM · ${categoryText}`}
                            style={styles.brandCategoryText}
                        />
                        <TextView text={sizeText} style={styles.sizeText} />
                    </View>

                    {/* Product Name */}
                    <TextView text={product.name} style={styles.productTitleText} />

                    {/* Subtitle */}
                    <TextView
                        text={product.subtitle || 'Revitalizing Herbal'}
                        style={styles.subtitleText}
                    />

                    {/* Rating Row */}
                    <View style={styles.ratingRow}>
                        <StarIcon width={getHeight(16)} height={getHeight(16)} color="#FDB022" />
                        <TextView text={ratingVal} style={styles.ratingScoreText} />
                        <TextView
                            text={`(${reviewsCount.toLocaleString()} ${detailTexts.reviews || 'reviews'})`}
                            style={styles.reviewsCountText}
                        />
                    </View>

                    {/* Price & Discount Row */}
                    <View style={styles.priceRow}>
                        <TextView text={`₹${currentPrice}`} style={styles.currentPriceText} />
                        <TextView text={`₹${originalPrice}`} style={styles.originalPriceText} />
                        <TextView text={`${discountPercent}% ${detailTexts.off || 'off'}`} style={styles.discountText} />
                    </View>

                    {/* Stock Status */}
                    <TextView
                        text={`${detailTexts.inStock || 'In stock'} · ${stockCount} ${detailTexts.left || 'left'}`}
                        style={styles.stockStatusText}
                    />

                    {/* Highlight Tags */}
                    <View style={styles.tagsRow}>
                        {tagsList.map((tag, index) => (
                            <View key={index} style={styles.tagPill}>
                                <TextView text={tag} style={styles.tagText} />
                            </View>
                        ))}
                    </View>

                    {/* About This Product */}
                    <View style={styles.aboutSection}>
                        <TextView
                            text={detailTexts.aboutProduct || 'About this product'}
                            style={styles.aboutTitleText}
                        />
                        <TextView
                            text={product.description || detailTexts.defaultAbout || 'A traditional herbal formulation from Amrutam, crafted to support revitalizing herbal care as part of your daily Ayurvedic routine.'}
                            style={styles.aboutBodyText}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Quantity Stepper Row */}
                    <View style={styles.quantityRow}>
                        <TextView
                            text={detailTexts.quantity || 'Quantity'}
                            style={styles.quantityLabelText}
                        />

                        <View style={styles.stepperContainer}>
                            <Pressable
                                onPress={handleDecrement}
                                style={styles.stepperButton}
                                hitSlop={8}
                            >
                                <MinusIcon width={getHeight(14)} height={getHeight(14)} color="#101828" />
                            </Pressable>

                            <TextView text={String(quantity)} style={styles.quantityValueText} />

                            <Pressable
                                onPress={handleIncrement}
                                style={styles.stepperButton}
                                hitSlop={8}
                            >
                                <PlusIcon width={getHeight(14)} height={getHeight(14)} color="#101828" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Fixed Action Footer */}
            <View style={[styles.bottomFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <Pressable style={styles.addToCartButton} onPress={handleAddToCart}>
                    <TextView
                        text={detailTexts.addToCart || 'Add to cart'}
                        style={styles.addToCartButtonText}
                    />
                </Pressable>

                <Pressable style={styles.buyNowButton} onPress={handleBuyNow}>
                    <TextView
                        text={detailTexts.buyNow || 'Buy now'}
                        style={styles.buyNowButtonText}
                    />
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
        backgroundColor: '#F5F5F5',
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
        backgroundColor: '#C62828',
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
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
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
        color: '#667085',
        letterSpacing: 0.5,
    },
    sizeText: {
        fontSize: getHeight(14),
        fontWeight: '500',
        color: '#667085',
    },
    productTitleText: {
        fontSize: getHeight(22),
        fontWeight: '700',
        color: '#101828',
        marginBottom: 4,
        lineHeight: getHeight(28),
    },
    subtitleText: {
        fontSize: getHeight(14),
        color: '#475467',
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
        color: '#101828',
        marginLeft: 6,
    },
    reviewsCountText: {
        fontSize: getHeight(14),
        color: '#667085',
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
        color: '#101828',
    },
    originalPriceText: {
        fontSize: getHeight(16),
        color: '#98A2B3',
        textDecorationLine: 'line-through',
        marginLeft: 8,
    },
    discountText: {
        fontSize: getHeight(16),
        fontWeight: '600',
        color: '#00A843',
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
        backgroundColor: '#EDF2FE',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: getHeight(14),
        marginRight: 10,
        marginBottom: 8,
    },
    tagText: {
        color: '#3538CD',
        fontSize: getHeight(13),
        fontWeight: '600',
    },
    aboutSection: {
        marginBottom: 16,
    },
    aboutTitleText: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: '#101828',
        marginBottom: 8,
    },
    aboutBodyText: {
        fontSize: getHeight(14),
        lineHeight: getHeight(22),
        color: '#475467',
    },
    divider: {
        height: 1,
        backgroundColor: '#EAECF0',
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
        color: '#101828',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#D0D5DD',
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
        color: '#101828',
    },
    bottomFooter: {
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderColor: '#EAECF0',
        paddingHorizontal: 16,
        paddingTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        shadowColor: '#000',
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
        borderColor: '#101828',
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartButtonText: {
        color: '#101828',
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