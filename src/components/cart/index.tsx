import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import {
    logo,
    backArrow as BackArrowIcon,
    trash as TrashIcon,
    promo as PromoIcon,
    arrowRight as ArrowRightIcon,
    chevronDown as ChevronRightIcon,
    minus as MinusIcon,
    plus as PlusIcon,
} from 'assets'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getTexts } from 'src/translations/TranslationHelper'
import useGetCart from '@src/apis/useGetCart'
import useAddToCart from '@src/apis/useAddToCart'
import useRemoveFromCart from '@src/apis/useRemoveFromCart'
import useUpdateCartQuantity from '@src/apis/useUpdateCartQuantity'
import useClearCart from '@src/apis/useClearCart'
import { CartItem } from 'src/types/CartTypes'
import EmptyCart from './EmptyCart'
import CartItemCard from './CartItemCard'

const CartScreen: React.FC = () => {
    const navigation = useNavigation<any>()
    const { data: cartData, isLoading } = useGetCart('guest')
    const { mutate: addToCartMutate } = useAddToCart()
    const { mutate: removeFromCartMutate } = useRemoveFromCart()
    const { mutate: updateCartQtyMutate } = useUpdateCartQuantity()
    const { mutate: clearCartMutate } = useClearCart()

    const textData = getTexts(DEFAULT_LANGUAGE_CODE)
    const cartTexts = textData.cart

    const cartItems: CartItem[] = useMemo(() => {
        const raw: any = cartData
        if (Array.isArray(raw?.data?.items)) return raw.data.items
        if (Array.isArray(raw?.data)) return raw.data
        if (Array.isArray(raw?.items)) return raw.items
        if (Array.isArray(raw)) return raw
        return []
    }, [cartData])

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const handleShopNowPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const handleClearCart = useCallback(() => {
        console.log('Clearing all items from cart...')
        cartItems.forEach((item) => {
            const targetProdId = (item as any).productId || item.id
            if (targetProdId) {
                removeFromCartMutate({ userId: 'guest', productId: targetProdId })
            }
        })
    }, [cartItems, removeFromCartMutate])

    const handleIncreaseQty = useCallback(
        (id: string) => {
            const target = cartItems.find((i) => i.id === id || (i as any).productId === id)
            if (target) {
                const targetProdId = (target as any).productId || target.id
                const newQty = (target.quantity || 1) + 1
                updateCartQtyMutate({ userId: 'guest', productId: targetProdId, quantity: newQty })
            }
        },
        [cartItems, updateCartQtyMutate]
    )

    const handleDecreaseQty = useCallback(
        (id: string) => {
            const target = cartItems.find((i) => i.id === id || (i as any).productId === id)
            if (target) {
                const targetProdId = (target as any).productId || target.id
                if (target.quantity <= 1) {
                    removeFromCartMutate({ userId: 'guest', productId: targetProdId })
                } else {
                    const newQty = target.quantity - 1
                    updateCartQtyMutate({ userId: 'guest', productId: targetProdId, quantity: newQty })
                }
            }
        },
        [cartItems, updateCartQtyMutate, removeFromCartMutate]
    )

    const handleDeleteItem = useCallback(
        (id: string) => {
            const target = cartItems.find((i) => i.id === id || (i as any).productId === id)
            if (target) {
                const targetProdId = (target as any).productId || target.id
                removeFromCartMutate({ userId: 'guest', productId: targetProdId })
            }
        },
        [cartItems, removeFromCartMutate]
    )

    // Calculations
    const subtotal = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0)
    }, [cartItems])

    const totalCount = useMemo(() => {
        return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
    }, [cartItems])

    const deliveryFee = subtotal > 0 ? 50 : 0
    const taxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0
    const totalAmount = subtotal + deliveryFee + taxes

    const handleCheckout = useCallback(() => {
        Alert.alert('Checkout', `Proceeding to checkout for ₹${totalAmount.toLocaleString()}`)
    }, [totalAmount])

    return (
        <View style={styles.container}>
            {/* Top Navigation Header */}
            <View style={styles.headerBar}>
                <Pressable onPress={handleBackPress} style={styles.backButton} hitSlop={10}>
                    <BackArrowIcon width={getHeight(20)} height={getHeight(20)} color={colors.textDark} />
                </Pressable>

                <TextView text={cartTexts.title} style={styles.headerTitle} />

                <View style={styles.headerRight}>
                    <Image source={logo} style={styles.logoIcon} resizeMode="contain" />
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatarImage} />
                    </View>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.darkGreen} />
                </View>
            ) : cartItems.length === 0 ? (
                /* Empty Cart UI Component */
                <EmptyCart onShopNowPress={handleShopNowPress} />
            ) : (
                /* Cart Items List UI */
                <>
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Section 1: Items in your cart + Clear button */}
                        <View style={styles.sectionHeader}>
                            <TextView text={cartTexts.itemsInCart} style={styles.sectionTitle} />
                            <Pressable onPress={handleClearCart} hitSlop={8}>
                                <TextView text={cartTexts.clear} style={styles.clearButtonText} />
                            </Pressable>
                        </View>

                        {cartItems.map((item) => {
                            const itemId = item.productId || item.id
                            return (
                                <CartItemCard
                                    key={itemId}
                                    item={item}
                                    onIncrease={handleIncreaseQty}
                                    onDecrease={handleDecreaseQty}
                                    onDelete={handleDeleteItem}
                                />
                            )
                        })}

                        {/* Section 2: Promo Code Card */}
                        <Pressable style={styles.promoCard} onPress={() => Alert.alert('Promo Code', 'Enter promo code dialog')}>
                            <View style={styles.promoLeftRow}>
                                <PromoIcon width={getHeight(20)} height={getHeight(20)} color={colors.darkGreen} />
                                <TextView text={cartTexts.applyPromoCode} style={styles.promoText} />
                            </View>
                            <ChevronRightIcon width={getHeight(14)} height={getHeight(14)} color={colors.textDark} style={{ transform: [{ rotate: '-90deg' }] }} />
                        </Pressable>

                        <View style={styles.dividerLine} />

                        {/* Section 3: Order Summary */}
                        <View style={styles.summarySection}>
                            <TextView text={cartTexts.orderSummary} style={styles.sectionTitle} />

                            <View style={styles.summaryRow}>
                                <TextView text={`${cartTexts.subtotal} (${totalCount} items)`} style={styles.summaryLabel} />
                                <TextView text={`₹${subtotal.toLocaleString()}`} style={styles.summaryValue} />
                            </View>

                            <View style={styles.summaryRow}>
                                <TextView text={cartTexts.deliveryFee} style={styles.summaryLabel} />
                                <TextView text={`₹${deliveryFee}`} style={styles.summaryValue} />
                            </View>

                            <View style={styles.summaryRow}>
                                <TextView text={cartTexts.taxes} style={styles.summaryLabel} />
                                <TextView text={`₹${taxes}`} style={styles.summaryValue} />
                            </View>

                            <View style={styles.dashedDivider} />

                            <View style={styles.totalRow}>
                                <TextView text={cartTexts.total} style={styles.totalLabel} />
                                <TextView text={`₹${totalAmount.toLocaleString()}`} style={styles.totalValue} />
                            </View>
                        </View>

                        {/* Section 4: Eco Commitment Note */}
                        <View style={styles.ecoBanner}>
                            <View style={styles.ecoIconCircle}>
                                <Image source={logo} style={styles.ecoLogo} resizeMode="contain" />
                            </View>
                            <TextView
                                text={cartTexts.ecoBannerText}
                                style={styles.ecoText}
                            />
                        </View>
                    </ScrollView>

                    {/* Sticky Bottom Checkout Footer */}
                    <View style={styles.checkoutFooter}>
                        <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
                            <TextView text={cartTexts.checkout} style={styles.checkoutText} />
                            <ArrowRightIcon width={getHeight(18)} height={getHeight(18)} color={colors.white} />
                        </Pressable>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 14,
        backgroundColor: colors.screenBackground,
    },
    backButton: {
        width: getHeight(36),
        height: getHeight(36),
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        width: getHeight(24),
        height: getHeight(24),
        marginRight: 8,
    },
    avatarWrapper: {
        width: getHeight(34),
        height: getHeight(34),
        borderRadius: getHeight(17),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.avatarBorder,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
    },
    clearButtonText: {
        fontSize: getHeight(14),
        fontWeight: '500',
        color: colors.textSecondary,
    },
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
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.textDark,
        flex: 1,
        marginRight: 8,
    },
    productPrice: {
        fontSize: getHeight(16),
        fontWeight: '700',
        color: colors.textDark,
    },
    variantText: {
        fontSize: getHeight(13),
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
    stepperSymbol: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.textDark,
    },
    stepperQtyText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.textDark,
        marginHorizontal: 8,
    },
    promoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAF8',
        borderRadius: getHeight(16),
        borderWidth: 1,
        borderColor: '#C2D1C8',
        borderStyle: 'dashed',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginTop: 8,
        marginBottom: 20,
    },
    promoLeftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    promoText: {
        fontSize: getHeight(14),
        fontWeight: '600',
        color: colors.darkGreen,
        marginLeft: 10,
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginBottom: 20,
    },
    summarySection: {
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    summaryLabel: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
    },
    summaryValue: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.textDark,
    },
    dashedDivider: {
        borderWidth: 0.5,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: getHeight(17),
        fontWeight: '700',
        color: colors.textDark,
    },
    totalValue: {
        fontSize: getHeight(20),
        fontWeight: '700',
        color: colors.darkGreen,
    },
    ecoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DFE7E3',
        borderRadius: getHeight(14),
        padding: 14,
        marginTop: 10,
    },
    ecoIconCircle: {
        width: getHeight(28),
        height: getHeight(28),
        borderRadius: getHeight(14),
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    ecoLogo: {
        width: getHeight(16),
        height: getHeight(16),
    },
    ecoText: {
        fontSize: getHeight(12),
        color: '#4A5B53',
        flex: 1,
        lineHeight: getHeight(17),
    },
    checkoutFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
        elevation: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    checkoutButton: {
        height: getHeight(52),
        backgroundColor: colors.darkGreen,
        borderRadius: getHeight(26),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkoutText: {
        fontSize: getHeight(16),
        fontWeight: '600',
        color: colors.white,
        marginRight: 8,
    },
})

export default CartScreen