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
import useGetWishlist from '@src/apis/useGetWishlist'
import useAddToWishlist from '@src/apis/useAddToWishlist'
import useRemoveFromWishlist from '@src/apis/useRemoveFromWishlist'
import { ProductItem } from 'src/types/ProductTypes'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { Screens } from 'src/constants/Screens'

import ProductCardSkeleton from './ProductCardSkeleton'
import ProductFilterModal, { FilterState } from './ProductFilterModal'

const SKELETON_ARRAY = [1, 2, 3, 4, 5, 6]

const DEFAULT_APPLIED_FILTERS: FilterState = {
    sortBy: 'popularity',
    categories: [],
    minPrice: 0,
    maxPrice: 5000,
}

const Shop: React.FC = () => {
    const navigation = useNavigation<any>()
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const [appliedFilters, setAppliedFilters] = useState<FilterState>(DEFAULT_APPLIED_FILTERS)

    const { mutate: addToCartMutate } = useAddToCart()
    const { data: cartData } = useGetCart('guest')
    const { data: wishlistData } = useGetWishlist('guest')
    const { mutate: addToWishlistMutate } = useAddToWishlist()
    const { mutate: removeFromWishlistMutate } = useRemoveFromWishlist()

    const cartProductIds = useMemo(() => {
        const raw: any = cartData
        let items: any[] = []
        if (Array.isArray(raw?.data?.items)) items = raw.data.items
        else if (Array.isArray(raw?.data)) items = raw.data
        else if (Array.isArray(raw?.items)) items = raw.items
        else if (Array.isArray(raw)) items = raw

        return new Set(items.map((i: any) => i.productId || i.id))
    }, [cartData])

    const wishlistProductIds = useMemo(() => {
        const raw: any = wishlistData
        let items: any[] = []
        if (Array.isArray(raw?.data?.items)) items = raw.data.items
        else if (Array.isArray(raw?.data)) items = raw.data
        else if (Array.isArray(raw?.items)) items = raw.items
        else if (Array.isArray(raw)) items = raw

        return new Set(items.map((i: any) => i.productId || i.id))
    }, [wishlistData])

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
        sortBy: appliedFilters.sortBy,
        categories: appliedFilters.categories,
        minPrice: appliedFilters.minPrice,
        maxPrice: appliedFilters.maxPrice,
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

    const handleToggleWishlist = useCallback(
        (product: ProductItem, newWishlistState: boolean) => {
            if (newWishlistState) {
                console.log('Adding product to wishlist via API:', product.id)
                addToWishlistMutate({ userId: 'guest', productId: product.id })
            } else {
                console.log('Removing product from wishlist via API:', product.id)
                removeFromWishlistMutate({ userId: 'guest', productId: product.id })
            }
        },
        [addToWishlistMutate, removeFromWishlistMutate]
    )

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleOpenFilter = useCallback(() => {
        setIsFilterModalOpen(true)
    }, [])

    const handleCloseFilter = useCallback(() => {
        setIsFilterModalOpen(false)
    }, [])

    const handleApplyFilters = useCallback((filters: FilterState) => {
        setAppliedFilters(filters)
    }, [])

    const renderProductItem = useCallback(
        ({ item }: { item: ProductItem }) => {
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
                />
            )
        },
        [cartProductIds, wishlistProductIds, handleAddToCart, handleToggleWishlist, handleCartPress]
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

    const [allCategoryOptions, setAllCategoryOptions] = useState<string[]>([])

    useEffect(() => {
        if (products && products.length > 0) {
            setAllCategoryOptions((prev) => {
                const set = new Set(prev)
                products.forEach((p: any) => {
                    if (p?.category && typeof p.category === 'string' && p.category.trim()) {
                        set.add(p.category.trim())
                    }
                    if (Array.isArray(p?.categories)) {
                        p.categories.forEach((cat: string) => {
                            if (cat && typeof cat === 'string' && cat.trim()) set.add(cat.trim())
                        })
                    }
                    if (Array.isArray(p?.tags)) {
                        p.tags.forEach((tag: string) => {
                            if (tag && typeof tag === 'string' && tag.trim()) set.add(tag.trim())
                        })
                    }
                })
                return Array.from(set)
            })
        }
    }, [products])

    const dynamicCategories = useMemo(() => {
        if (allCategoryOptions.length > 0) return allCategoryOptions
        const catSet = new Set<string>()
        products.forEach((p) => {
            if (p.category && p.category.trim()) {
                catSet.add(p.category.trim())
            }
        })
        const list = Array.from(catSet)
        return list.length > 0
            ? list
            : ['Hair Care', 'Skin Care', 'Immunity', 'Digestion', 'Wellness', 'Ayurvedic Oils', 'Malts & Powders', 'Personal Care', 'Juices & Syrups', 'Bundles & Kits']
    }, [allCategoryOptions, products])

    const isInitialLoading = isLoading && products.length === 0

    return (
        <View style={styles.container}>
            {/* Top Fixed Shop Header - Never unmounts on search or filter updates */}
            <ShopHeader
                searchQuery={searchQuery}
                onChangeSearchQuery={setSearchQuery}
                onOpenFilter={handleOpenFilter}
            />

            {isInitialLoading ? (
                <FlatList
                    data={SKELETON_ARRAY}
                    renderItem={renderSkeletonItem}
                    keyExtractor={skeletonKeyExtractor}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={keyExtractor}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                    refreshing={isFetching && !isLoading && !isFetchingNextPage}
                    onRefresh={refetch}
                />
            )}

            {/* Floating Shopping Bag Cart Button */}
            <ShopCartFloatingButton count={cartCount} onPress={handleCartPress} />

            {/* Product Filter Modal */}
            <ProductFilterModal
                visible={isFilterModalOpen}
                onClose={handleCloseFilter}
                initialFilters={appliedFilters}
                availableCategories={dynamicCategories}
                onApplyFilters={handleApplyFilters}
            />
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