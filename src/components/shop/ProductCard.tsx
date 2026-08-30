import React, { useState, useCallback } from 'react'
import { StyleSheet, View, Image, Pressable, Dimensions } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { star as StarIcon, heartIcon as HeartIcon, plus as PlusIcon, bag as BagIcon } from 'assets'
import { ProductItem } from 'src/types/ProductTypes'

export interface ProductCardProps {
    product: ProductItem
    isInCart?: boolean
    onAddToCart?: (product: ProductItem) => void
    onOpenCart?: () => void
    onPress?: (product: ProductItem) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 50) / 2

const DEFAULT_PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1608248597263-00079e9653a9?w=500',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=500',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
]

const ProductCard: React.FC<ProductCardProps> = ({ product, isInCart = false, onAddToCart, onOpenCart, onPress }) => {
    const [isWishlisted, setIsWishlisted] = useState(Boolean(product.isWishlisted))
    const [imgError, setImgError] = useState(false)

    const handleWishlistToggle = useCallback(() => {
        setIsWishlisted((prev) => !prev)
    }, [])

    const handleCardPress = useCallback(() => {
        if (onPress) onPress(product)
    }, [onPress, product])

    const handleAddPress = useCallback(() => {
        if (isInCart) {
            if (onOpenCart) onOpenCart()
        } else {
            if (onAddToCart) onAddToCart(product)
        }
    }, [isInCart, onOpenCart, onAddToCart, product])

    const fallbackUri = DEFAULT_PRODUCT_IMAGES[
        Math.abs(product.id?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0) % DEFAULT_PRODUCT_IMAGES.length
    ]

    const resolveImageUrl = (urlStr?: string | null): string => {
        if (!urlStr || typeof urlStr !== 'string' || urlStr.trim() === '') {
            return fallbackUri
        }

        const trimmed = urlStr.trim()

        // Filter out dummy non-loading URLs like example.com or via.placeholder.com
        if (
            trimmed.includes('example.com') ||
            trimmed.includes('via.placeholder.com') ||
            trimmed.includes('placeholder.com') ||
            trimmed.includes('invalid-url')
        ) {
            return fallbackUri
        }

        // Rewrite localhost / 127.0.0.1 for Android devices
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
    const subtitleText = product.subtitle || product.category || 'Ayurvedic Care'

    return (
        <Pressable style={styles.cardContainer} onPress={handleCardPress}>
            {/* Top Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={imageSource}
                    style={styles.productImage}
                    resizeMode="cover"
                    onError={() => setImgError(true)}
                />

                {/* Badge if available (e.g. BESTSELLER) */}
                {Boolean(product.badge) && (
                    <View style={styles.badgeContainer}>
                        <TextView text={product.badge?.toUpperCase() || ''} style={styles.badgeText} />
                    </View>
                )}

                {/* Wishlist Heart Icon Button */}
                <Pressable
                    style={[styles.heartButton, isWishlisted && styles.heartButtonActive]}
                    onPress={handleWishlistToggle}
                    hitSlop={8}
                >
                    <HeartIcon
                        width={getHeight(14)}
                        height={getHeight(14)}
                        color={isWishlisted ? '#E53935' : colors.textDark}
                    />
                </Pressable>
            </View>

            {/* Product Details Section */}
            <View style={styles.detailsContainer}>
                {/* Rating Row */}
                <View style={styles.ratingRow}>
                    <StarIcon width={getHeight(12)} height={getHeight(12)} color="#1E4D3B" />
                    <TextView text={ratingVal} style={styles.ratingText} />
                </View>

                {/* Product Name */}
                <TextView text={product.name} style={styles.productName} numberOfLines={2} />

                {/* Subtitle / Category */}
                <TextView text={subtitleText} style={styles.subtitleText} numberOfLines={1} />

                {/* Price & Add to Cart Action Row */}
                <View style={styles.bottomRow}>
                    <TextView text={`₹${product.price}`} style={styles.priceText} />

                    <Pressable
                        style={[styles.addButton, isInCart && styles.inCartButton]}
                        onPress={handleAddPress}
                        hitSlop={6}
                    >
                        {isInCart ? (
                            <BagIcon width={getHeight(14)} height={getHeight(14)} color={colors.white} />
                        ) : (
                            <PlusIcon width={getHeight(14)} height={getHeight(14)} color={colors.white} />
                        )}
                    </Pressable>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: colors.white,
        borderRadius: getHeight(18),
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    imageContainer: {
        width: '100%',
        height: getHeight(150),
        backgroundColor: '#F7F5F0',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#5A6559',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: getHeight(6),
    },
    badgeText: {
        fontSize: getHeight(9),
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.5,
    },
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: getHeight(30),
        height: getHeight(30),
        borderRadius: getHeight(15),
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartButtonActive: {
        backgroundColor: '#FFEBEE',
    },
    detailsContainer: {
        padding: 12,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    ratingText: {
        fontSize: getHeight(12),
        fontWeight: '600',
        color: colors.textDark,
        marginLeft: 4,
    },
    productName: {
        fontSize: getHeight(14),
        fontWeight: '700',
        color: colors.textDark,
        lineHeight: getHeight(18),
        marginBottom: 3,
    },
    subtitleText: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        marginBottom: 10,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    priceText: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.darkGreen,
    },
    addButton: {
        width: getHeight(32),
        height: getHeight(32),
        borderRadius: getHeight(16),
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inCartButton: {
        backgroundColor: colors.darkGreen,
    },
})

export default React.memo(ProductCard)
