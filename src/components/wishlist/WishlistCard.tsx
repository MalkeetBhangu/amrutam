import React, { useState, useCallback, useEffect } from 'react'
import { StyleSheet, View, Image, Pressable, Dimensions } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { star as StarIcon, heartFilled as HeartFilledIcon, plus as PlusIcon, bag as BagIcon, churna as ChurnaImg } from 'assets'
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

const WishlistCard: React.FC<WishlistCardProps> = ({ item, isInCart = false, onRemoveFromWishlist, onAddToCart, onOpenCart, onPress, }) => {
    const [imgError, setImgError] = useState(false)

    useEffect(() => {
        setImgError(false)
    }, [item.image])

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

    const imageSource = imgError ? ChurnaImg : { uri: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500" }
    const ratingVal = item.rating != null ? Number(item.rating).toFixed(1) : '4.8'
    const subtitleText = item.subtitle || item.category || ''

    return (
        <Pressable style={styles.cardContainer} onPress={handleCardPress}>
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.productImage} resizeMode="cover" onError={() => setImgError(true)} />
                <Pressable style={styles.heartButton} onPress={handleRemovePress} hitSlop={8}>
                    <HeartFilledIcon width={getHeight(18)} height={getHeight(18)} color={colors.heartActiveRed} />
                </Pressable>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.ratingRow}>
                    <StarIcon width={getHeight(12)} height={getHeight(12)} color={colors.darkGreen} />
                    <TextView text={ratingVal} style={styles.ratingText} />
                </View>
                <TextView text={item.name} style={styles.productName} numberOfLines={2} />
                <TextView text={subtitleText} style={styles.subtitleText} numberOfLines={1} />
                <View style={styles.bottomRow}>
                    <TextView text={`₹${item.price}`} style={styles.priceText} />
                    <Pressable style={[styles.addButton, isInCart && styles.inCartButton]} onPress={handleAddPress} hitSlop={6} >
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
        borderColor: colors.cardBorder,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
    },
    imageContainer: {
        width: '100%',
        height: getHeight(150),
        backgroundColor: colors.infoBoxBg,
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
        backgroundColor: colors.white,
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
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inCartButton: {
        backgroundColor: colors.darkGreen,
    },
})

export default React.memo(WishlistCard)
