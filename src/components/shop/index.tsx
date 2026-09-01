import React, { useState, useEffect, useCallback, useMemo, useRef, lazy, Suspense } from 'react'
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import ShopHeader from './ShopHeader'
import ProductCard from './ProductCard'
import ShopCartFloatingButton from './ShopCartFloatingButton'
import useGetProducts from '@src/apis/useGetProducts'
import useGetCart from '@src/apis/useGetCart'
import useGetWishlist from '@src/apis/useGetWishlist'
import useAddToCart from '@src/apis/useAddToCart'
import useAddToWishlist from '@src/apis/useAddToWishlist'
import useRemoveFromWishlist from '@src/apis/useRemoveFromWishlist'
import { ProductItem } from 'src/types/ProductTypes'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { Screens } from 'src/constants/Screens'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { useUserState } from '@src/store/UseUserStore'
import { getTexts } from 'src/translations/TranslationHelper'
import ProductCardSkeleton from './ProductCardSkeleton'
import type { FilterState, ProductFilterModalRef } from './ProductFilterModal'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamsList } from '@src/navigation/useNavigation'

const ProductFilterModal = lazy(() => import('./ProductFilterModal'))

const SKELETON_ARRAY = [1, 2, 3, 4, 5, 6]

const Shop: React.FC = () => {
    const filterModalRef = useRef<ProductFilterModalRef>(null)
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE, userId } } = useUserState(['languageCode', 'userId'])
    const t = getTexts(languageCode)
    const navigation = useNavigation<StackNavigationProp<ParamsList>>()
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState<FilterState | undefined>(undefined)
    const { data: cartData } = useGetCart(userId)
    const { data: wishlistData } = useGetWishlist(userId)
    const { mutate: addToCartMutate } = useAddToCart()
    const { mutate: addToWishlistMutate } = useAddToWishlist()
    const { mutate: removeFromWishlistMutate } = useRemoveFromWishlist()

    const cartProductIds = useMemo(() => new Set(cartData?.data?.items?.map((i: any) => i.productId || i.id)), [cartData])
    const wishlistProductIds = useMemo(() => new Set(wishlistData?.data?.items?.map((i: any) => i.productId || i.id)), [wishlistData])
    const cartCount = useMemo(() => cartData?.data?.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0), [cartData])

    const handleCartPress = useCallback(() => { navigation.navigate(Screens.CART) }, [navigation])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery)
        }, 400)
        return () => clearTimeout(handler)
    }, [searchQuery])

    const { products, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, refetch } = useGetProducts({
        search: debouncedSearchQuery,
        sortBy: activeFilters?.sortBy,
        categories: activeFilters?.categories,
        minPrice: activeFilters?.minPrice,
        maxPrice: activeFilters?.maxPrice,
    })

    const showSkeleton = isLoading || (isFetching && products.length === 0)

    const handleAddToCart = useCallback((product: ProductItem) => { addToCartMutate({ userId, productId: product.id, quantity: 1 }) }, [addToCartMutate, userId])

    const handleToggleWishlist = useCallback((product: ProductItem, newWishlistState: boolean) => {
        if (newWishlistState) addToWishlistMutate({ userId, productId: product.id })
        else removeFromWishlistMutate({ userId, productId: product.id })
    }, [addToWishlistMutate, removeFromWishlistMutate, userId])

    const handleProductPress = useCallback((product: ProductItem) => { navigation.navigate(Screens.PRODUCT_DETAIL, { product }) }, [navigation])
    const handleLoadMore = useCallback(() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }, [hasNextPage, isFetchingNextPage, fetchNextPage])
    const handleOpenFilter = useCallback(() => { filterModalRef.current?.open() }, [])

    const renderItem = useCallback(({ item }: { item: any }) => {
        if (showSkeleton) return <ProductCardSkeleton />
        const isInCart = cartProductIds.has(item.id)
        const isWishlisted = wishlistProductIds.has(item.id)
        return (
            <ProductCard
                product={item}
                isInCart={isInCart}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onOpenCart={handleCartPress}
                onPress={handleProductPress}
            />
        )
    }, [showSkeleton, cartProductIds, wishlistProductIds, handleAddToCart, handleToggleWishlist, handleCartPress, handleProductPress])

    const keyExtractor = useCallback((item: any, index: number) => String(item?.id || index), [])

    const renderEmpty = useCallback(() => (
        <View style={styles.emptyContainer}>
            <TextView text={t.shop?.noProductsFound} style={styles.emptyText} />
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

    return (
        <View style={styles.container}>
            <ShopHeader searchQuery={searchQuery} onChangeSearchQuery={setSearchQuery} onOpenFilter={handleOpenFilter} />

            <FlatList
                data={showSkeleton ? SKELETON_ARRAY : products}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={showSkeleton ? null : renderEmpty}
                ListFooterComponent={showSkeleton || products.length === 0 ? null : renderFooter}
                onEndReached={showSkeleton || products.length === 0 ? undefined : handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                refreshing={isFetching && !isLoading && !isFetchingNextPage}
                onRefresh={refetch}
            />

            <ShopCartFloatingButton count={cartCount} onPress={handleCartPress} />
            <Suspense fallback={null}>
                <ProductFilterModal ref={filterModalRef} activeFilters={activeFilters} onApplyFilters={setActiveFilters} />
            </Suspense>
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