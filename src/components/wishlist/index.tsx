import { useNavigation } from '@react-navigation/native'
import useAddToCart from '@src/apis/useAddToCart'
import useGetCart from '@src/apis/useGetCart'
import useGetWishlist from '@src/apis/useGetWishlist'
import useRemoveFromWishlist from '@src/apis/useRemoveFromWishlist'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { Screens, TABS } from 'src/constants/Screens'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'
import { WishlistItem } from 'src/types/WishlistTypes'
import EmptyWishlist from './EmptyWishlist'
import WishlistCard from './WishlistCard'
import { useUserState } from '@src/store/UseUserStore'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamsList } from '@src/navigation/useNavigation'

const WishlistScreen: React.FC = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE, userId } } = useUserState(['languageCode', 'userId'])
    const navigation = useNavigation<StackNavigationProp<ParamsList>>()
    const t = getTexts(languageCode)
    const wishlistTexts = t.wishlist
    const { data: wishlistData, isLoading } = useGetWishlist(userId)
    const { data: cartData } = useGetCart(userId)
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


    const handleCartPress = useCallback(() => { navigation.navigate(Screens.CART) }, [navigation])
    const handleExploreShopPress = useCallback(() => { navigation.navigate(TABS.SHOP_TAB) }, [navigation])

    const handleRemoveFromWishlist = useCallback(
        (itemToRemove: WishlistItem) => {
            const targetProdId = itemToRemove.id || (itemToRemove as any).productId
            if (targetProdId) removeFromWishlistMutate({ userId, productId: targetProdId })
            setItems((prev) => prev.filter((i) => (i.id || (i as any).productId) !== targetProdId))
        },
        [removeFromWishlistMutate]
    )

    const handleAddToCart = useCallback(
        (item: WishlistItem) => {
            const targetProdId = item.id || (item as any).productId
            if (targetProdId) addToCartMutate({ userId, productId: targetProdId, quantity: 1 })
        },
        [addToCartMutate]
    )

    const renderItem = useCallback(
        ({ item }: { item: WishlistItem }) => {
            const itemId = item.id || (item as any).productId
            const isInCart = cartProductIds.has(itemId)
            return <WishlistCard item={item} isInCart={isInCart} onRemoveFromWishlist={handleRemoveFromWishlist} onAddToCart={handleAddToCart} onOpenCart={handleCartPress} />
        },
        [cartProductIds, handleRemoveFromWishlist, handleAddToCart, handleCartPress]
    )

    const keyExtractor = useCallback(
        (item: WishlistItem, index: number) => item.id || (item as any).productId || String(index),
        []
    )

    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TextView text={wishlistTexts.title} style={styles.headerTitle} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.darkGreen} />
                </View>
            ) : items.length === 0 ? (
                <EmptyWishlist onExploreShopPress={handleExploreShopPress} />
            ) : (
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
        backgroundColor: colors.screenBackground,
    },
    headerBar: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.dividerBg,
    },
    headerTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
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