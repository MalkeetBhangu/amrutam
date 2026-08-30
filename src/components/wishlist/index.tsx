import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import {
    backArrow as BackArrowIcon,
    search as SearchIcon,
    bag as BagIcon,
} from 'assets'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getTexts } from 'src/translations/TranslationHelper'
import { Screens, TABS } from 'src/constants/Screens'
import useGetWishlist from '@src/apis/useGetWishlist'
import useRemoveFromWishlist from '@src/apis/useRemoveFromWishlist'
import useGetCart from '@src/apis/useGetCart'
import useAddToCart from '@src/apis/useAddToCart'
import { WishlistItem } from 'src/types/WishlistTypes'

import WishlistCard from './WishlistCard'
import EmptyWishlist from './EmptyWishlist'

const WishlistScreen: React.FC = () => {
    const navigation = useNavigation<any>()
    const textData = getTexts(DEFAULT_LANGUAGE_CODE)
    const wishlistTexts = textData.wishlist

    const { data: wishlistData, isLoading } = useGetWishlist('guest')
    const { data: cartData } = useGetCart('guest')
    const { mutate: addToCartMutate } = useAddToCart()
    const { mutate: removeFromWishlistMutate } = useRemoveFromWishlist()

    const [items, setItems] = useState<WishlistItem[]>([])

    const cartProductIds = useMemo(() => {
        const raw: any = cartData
        let cartItemsArr: any[] = []
        if (Array.isArray(raw?.data?.items)) cartItemsArr = raw.data.items
        else if (Array.isArray(raw?.data)) cartItemsArr = raw.data
        else if (Array.isArray(raw?.items)) cartItemsArr = raw.items
        else if (Array.isArray(raw)) cartItemsArr = raw

        return new Set(cartItemsArr.map((i: any) => i.productId || i.id))
    }, [cartData])

    const cartCount = useMemo(() => {
        const raw: any = cartData
        let cartItemsArr: any[] = []
        if (Array.isArray(raw?.data?.items)) cartItemsArr = raw.data.items
        else if (Array.isArray(raw?.data)) cartItemsArr = raw.data
        else if (Array.isArray(raw?.items)) cartItemsArr = raw.items
        else if (Array.isArray(raw)) cartItemsArr = raw

        return cartItemsArr.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
    }, [cartData])

    useEffect(() => {
        if (wishlistData) {
            const raw: any = wishlistData
            let list: WishlistItem[] = []
            if (Array.isArray(raw?.data?.items)) {
                list = raw.data.items
            } else if (Array.isArray(raw?.data)) {
                list = raw.data
            } else if (Array.isArray(raw?.items)) {
                list = raw.items
            } else if (Array.isArray(raw)) {
                list = raw
            }

            setItems(list)
        }
    }, [wishlistData])

    const handleBackPress = useCallback(() => {
        navigation.goBack()
    }, [navigation])

    const handleCartPress = useCallback(() => {
        navigation.navigate(Screens.CART)
    }, [navigation])

    const handleExploreShopPress = useCallback(() => {
        navigation.navigate(TABS.SHOP_TAB)
    }, [navigation])

    const handleRemoveFromWishlist = useCallback(
        (itemToRemove: WishlistItem) => {
            const targetProdId = itemToRemove.id || (itemToRemove as any).productId
            if (targetProdId) {
                console.log('Removing item from wishlist via API:', targetProdId)
                removeFromWishlistMutate({ userId: 'guest', productId: targetProdId })
            }

            setItems((prev) =>
                prev.filter(
                    (i) => (i.id || (i as any).productId) !== targetProdId
                )
            )
        },
        [removeFromWishlistMutate]
    )

    const handleAddToCart = useCallback(
        (item: WishlistItem) => {
            const targetProdId = item.id || (item as any).productId
            if (targetProdId) {
                console.log('Adding wishlist item to cart via API:', targetProdId)
                addToCartMutate({ userId: 'guest', productId: targetProdId, quantity: 1 })
            }
        },
        [addToCartMutate]
    )

    const renderItem = useCallback(
        ({ item }: { item: WishlistItem }) => {
            const itemId = item.id || (item as any).productId
            const isInCart = cartProductIds.has(itemId)
            return (
                <WishlistCard
                    item={item}
                    isInCart={isInCart}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    onAddToCart={handleAddToCart}
                    onOpenCart={handleCartPress}
                />
            )
        },
        [cartProductIds, handleRemoveFromWishlist, handleAddToCart, handleCartPress]
    )

    const keyExtractor = useCallback(
        (item: WishlistItem, index: number) => item.id || (item as any).productId || String(index),
        []
    )

    return (
        <View style={styles.container}>
            {/* Navigation Header Bar */}
            <View style={styles.headerBar}>
                <View style={styles.titleWrapper} pointerEvents="none">
                    <TextView text={wishlistTexts.title} style={styles.headerTitle} />
                </View>

                <Pressable style={styles.headerIconButton} onPress={handleCartPress} hitSlop={8}>
                    <BagIcon width={getHeight(20)} height={getHeight(20)} color={colors.textDark} />
                    {cartCount > 0 && (
                        <View style={styles.cartBadge}>
                            <TextView text={String(cartCount)} style={styles.cartBadgeText} />
                        </View>
                    )}
                </Pressable>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.darkGreen} />
                </View>
            ) : items.length === 0 ? (
                /* Empty Wishlist Component */
                <EmptyWishlist onExploreShopPress={handleExploreShopPress} />
            ) : (
                /* Wishlist FlatList Grid */
                <View style={styles.listWrapper}>
                    <FlatList
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        numColumns={2}
                        columnWrapperStyle={styles.columnWrapper}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAF7',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        position: 'relative',
    },
    titleWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 50,
        bottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
    },
    headerIconButton: {
        width: getHeight(36),
        height: getHeight(36),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 2,
    },
    cartBadge: {
        position: 'absolute',
        top: -2,
        right: -4,
        backgroundColor: colors.darkGreen,
        width: getHeight(18),
        height: getHeight(18),
        borderRadius: getHeight(9),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: {
        fontSize: getHeight(9),
        fontWeight: '700',
        color: colors.white,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listWrapper: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
})

export default WishlistScreen