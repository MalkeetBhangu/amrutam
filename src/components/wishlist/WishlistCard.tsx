import React, { useState, useCallback } from 'react'
import { StyleSheet, View, Image, Pressable, Dimensions } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { star as StarIcon, heartFilled as HeartFilledIcon, plus as PlusIcon, bag as BagIcon } from 'assets'
import { WishlistItem } from 'src/types/WishlistTypes'

export interface WishlistCardProps {
    item: WishlistItem
    isInCart?: boolean
    onRemoveFromWishlist?: (item: WishlistItem) => void
    onAddToCart?: (item: WishlistItem) => void
    onOpenCart?: () => void
    onPress?: (item: WishlistItem) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 50) / 2

const DEFAULT_PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1608248597263-00079e9653a9?w=500',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=500',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
]

const WishlistCard: React.FC<WishlistCardProps> = ({
    item,
    isInCart = false,
    onRemoveFromWishlist,
    onAddToCart,
    onOpenCart,
    onPress,
}) => {
    const [imgError, setImgError] = useState(false)

    const handleRemovePress = useCallback(() => {
        if (onRemoveFromWishlist) onRemoveFromWishlist(item)
    }, [onRemoveFromWishlist, item])

    const handleCardPress = useCallback(() => {
        if (onPress) onPress(item)
    }, [onPress, item])

    const handleAddPress = useCallback(() => {
        if (isInCart) {
            if (onOpenCart) onOpenCart()
        } else {
            if (onAddToCart) onAddToCart(item)
        }
    }, [isInCart, onOpenCart, onAddToCart, item])

    const itemKey = item.id || (item as any).productId || '1'
    const fallbackUri = DEFAULT_PRODUCT_IMAGES[
        Math.abs(itemKey.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0) % DEFAULT_PRODUCT_IMAGES.length
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

    const resolvedUri = resolveImageUrl(item.image)
    const imageSource = !imgError ? { uri: resolvedUri } : { uri: fallbackUri }
    const ratingVal = item.rating != null ? Number(item.rating).toFixed(1) : '4.8'
    const subtitleText = item.subtitle || item.category || 'Ayurvedic Care'

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

                {/* Filled Red Heart Icon Button */}
                <Pressable style={styles.heartButton} onPress={handleRemovePress} hitSlop={8}>
                    <HeartFilledIcon
                        width={getHeight(18)}
                        height={getHeight(18)}
                        color="#C62828"
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
                <TextView text={item.name} style={styles.productName} numberOfLines={2} />

                {/* Subtitle / Category */}
                <TextView text={subtitleText} style={styles.subtitleText} numberOfLines={1} />

                {/* Price & Action Row */}
                <View style={styles.bottomRow}>
                    <TextView text={`₹${item.price}`} style={styles.priceText} />

                    <Pressable
                        style={[styles.addButton, isInCart && styles.inCartButton]}
                        onPress={handleAddPress}
                        hitSlop={6}
                    >
                        {isInCart ? (
                            <BagIcon width={getHeight(14)} height={getHeight(14)} color={colors.white} />
                        ) : (
                            <PlusIcon width={getHeight(14)} height={getHeight(14)} color={colors.darkGreen} />
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
    heartButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: getHeight(34),
        height: getHeight(34),
        borderRadius: getHeight(17),
        backgroundColor: '#FFFDF9',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
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
        marginBottom: 8,
    },
    priceText: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.darkGreen,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    addButton: {
        width: getHeight(32),
        height: getHeight(32),
        borderRadius: getHeight(16),
        backgroundColor: '#E8F3EE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inCartButton: {
        backgroundColor: colors.darkGreen,
    },
})

export default React.memo(WishlistCard)
