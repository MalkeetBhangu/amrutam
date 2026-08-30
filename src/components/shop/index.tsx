import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import ShopHeader from './ShopHeader'
import ProductCard from './ProductCard'
import ShopCartFloatingButton from './ShopCartFloatingButton'
import useGetProducts from '@src/apis/useGetProducts'
import useAddToCart from '@src/apis/useAddToCart'
import useGetCart from '@src/apis/useGetCart'
import { ProductItem } from 'src/types/ProductTypes'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { Screens } from 'src/constants/Screens'

import ProductCardSkeleton from './ProductCardSkeleton'

const SKELETON_ARRAY = [1, 2, 3, 4, 5, 6]

const Shop: React.FC = () => {
    const navigation = useNavigation<any>()
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

    const { mutate: addToCartMutate } = useAddToCart()
    const { data: cartData } = useGetCart('guest')

    const cartProductIds = useMemo(() => {
        const raw: any = cartData
        let items: any[] = []
        if (Array.isArray(raw?.data?.items)) items = raw.data.items
        else if (Array.isArray(raw?.data)) items = raw.data
        else if (Array.isArray(raw?.items)) items = raw.items
        else if (Array.isArray(raw)) items = raw

        return new Set(items.map((i: any) => i.productId || i.id))
    }, [cartData])

    const cartCount = useMemo(() => {
        const raw: any = cartData
        let items: any[] = []
        if (Array.isArray(raw?.data?.items)) items = raw.data.items
        else if (Array.isArray(raw?.data)) items = raw.data
        else if (Array.isArray(raw?.items)) items = raw.items
        else if (Array.isArray(raw)) items = raw

        return items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
    }, [cartData])

    const handleCartPress = useCallback(() => {
        navigation.navigate(Screens.CART)
    }, [navigation])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 400)
        return () => clearTimeout(handler)
    }, [searchQuery])

    const {
        products,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isFetching,
        refetch,
    } = useGetProducts({
        search: debouncedSearchQuery,
    })

    const handleAddToCart = useCallback(
        (product: ProductItem) => {
            console.log('Adding product to cart via API:', product.id)
            addToCartMutate({
                userId: 'guest',
                productId: product.id,
                quantity: 1,
            })
        },
        [addToCartMutate]
    )

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const renderHeader = useCallback(
        () => (
            <View>
                <ShopHeader
                    searchQuery={searchQuery}
                    onChangeSearchQuery={setSearchQuery}
                />
            </View>
        ),
        [searchQuery]
    )

    const renderProductItem = useCallback(
        ({ item }: { item: ProductItem }) => {
            const isInCart = cartProductIds.has(item.id)
            return (
                <ProductCard
                    product={item}
                    isInCart={isInCart}
                    onAddToCart={handleAddToCart}
                    onOpenCart={handleCartPress}
                />
            )
        },
        [cartProductIds, handleAddToCart, handleCartPress]
    )

    const renderSkeletonItem = useCallback(() => <ProductCardSkeleton />, [])

    const keyExtractor = useCallback((item: ProductItem, index: number) => item.id || String(index), [])
    const skeletonKeyExtractor = useCallback((item: number) => `skeleton-${item}`, [])

    const renderEmpty = useCallback(() => (
        <View style={styles.emptyContainer}>
            <TextView text="No products found" style={styles.emptyText} />
        </View>
    ), [])

    const renderFooter = useCallback(() => {
        if (isFetchingNextPage) {
            return (
                <View style={styles.footerLoading}>
                    <ActivityIndicator size="small" color={colors.darkGreen} />
                </View>
            )
        }
        return null
    }, [isFetchingNextPage])

    if (isLoading) {
        return (
            <View style={styles.container}>
                <FlatList
                    data={SKELETON_ARRAY}
                    renderItem={renderSkeletonItem}
                    keyExtractor={skeletonKeyExtractor}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={renderHeader}
                    showsVerticalScrollIndicator={false}
                />
                <ShopCartFloatingButton count={cartCount} onPress={handleCartPress} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={keyExtractor}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                refreshing={isFetching && !isLoading && !isFetchingNextPage}
                onRefresh={refetch}
            />

            {/* Floating Shopping Bag Cart Button */}
            <ShopCartFloatingButton count={cartCount} onPress={handleCartPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    listContent: {
        paddingBottom: 90,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: getHeight(15),
        color: colors.textSecondary,
    },
    footerLoading: {
        paddingVertical: 16,
        alignItems: 'center',
    },
})

export default Shop