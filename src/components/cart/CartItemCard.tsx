import React, { useState } from 'react'
import { StyleSheet, View, Image, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { minus as MinusIcon, plus as PlusIcon, trash as TrashIcon } from 'assets'
import { CartItem } from 'src/types/CartTypes'

const DEFAULT_PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1608248597263-00079e9653a9?w=500',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=500',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
]

const resolveImageUrl = (urlStr?: string | null, productId?: string): string => {
    const prodKey = productId || 'default'
    const fallbackUri = DEFAULT_PRODUCT_IMAGES[
        Math.abs(prodKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0) % DEFAULT_PRODUCT_IMAGES.length
    ]

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

export interface CartItemCardProps {
    item: CartItem
    onIncrease: (id: string) => void
    onDecrease: (id: string) => void
    onDelete: (id: string) => void
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onIncrease, onDecrease, onDelete }) => {
    const [imgError, setImgError] = useState(false)

    const prodId = item.productId || item.id || ''
    const resolvedUri = resolveImageUrl(item.image, prodId)
    const fallbackUri = DEFAULT_PRODUCT_IMAGES[
        Math.abs(prodId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0) % DEFAULT_PRODUCT_IMAGES.length
    ]

    const imageSource = !imgError ? { uri: resolvedUri } : { uri: fallbackUri }

    return (
        <View style={styles.cartCard}>
            <Image
                source={imageSource}
                style={styles.productThumbnail}
                resizeMode="cover"
                onError={() => setImgError(true)}
            />

            <View style={styles.cardDetailsColumn}>
                <View style={styles.cardTopRow}>
                    <TextView text={item.name} style={styles.productTitle} numberOfLines={1} />
                    <TextView text={`₹${item.price * item.quantity}`} style={styles.productPrice} />
                </View>

                <TextView text={item.variant || item.size || (item as any).subtitle || ''} style={styles.variantText} />

                <View style={styles.cardBottomRow}>
                    {/* Quantity Stepper */}
                    <View style={styles.stepperContainer}>
                        <Pressable onPress={() => onDecrease(prodId)} style={styles.stepperBtn} hitSlop={6}>
                            <MinusIcon width={getHeight(12)} height={getHeight(12)} color={colors.textDark} />
                        </Pressable>

                        <TextView text={String(item.quantity)} style={styles.stepperQtyText} />

                        <Pressable onPress={() => onIncrease(prodId)} style={styles.stepperBtn} hitSlop={6}>
                            <PlusIcon width={getHeight(12)} height={getHeight(12)} color={colors.textDark} />
                        </Pressable>
                    </View>

                    {/* Trash Delete Icon */}
                    <Pressable onPress={() => onDelete(prodId)} hitSlop={10}>
                        <TrashIcon width={getHeight(18)} height={getHeight(18)} />
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cartCard: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: getHeight(16),
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
    },
    productThumbnail: {
        width: getHeight(76),
        height: getHeight(76),
        borderRadius: getHeight(12),
        backgroundColor: '#F7F5F0',
    },
    cardDetailsColumn: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productTitle: {
        fontSize: getHeight(10),
        fontWeight: '600',
        color: colors.textDark,
        flex: 1,
        marginRight: 8,
    },
    productPrice: {
        fontSize: getHeight(14),
        fontWeight: '700',
        color: colors.textDark,
    },
    variantText: {
        fontSize: getHeight(12),
        color: colors.textSecondary,
        marginTop: 2,
    },
    cardBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: getHeight(18),
        paddingHorizontal: 8,
        height: getHeight(34),
        minWidth: getHeight(95),
        justifyContent: 'space-between',
    },
    stepperBtn: {
        width: getHeight(26),
        height: getHeight(26),
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperQtyText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.textDark,
        marginHorizontal: 8,
    },
})

export default React.memo(CartItemCard)
