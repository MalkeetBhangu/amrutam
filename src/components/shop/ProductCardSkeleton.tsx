import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Animated, Dimensions } from 'react-native'
import colors from 'src/tokens/Colors'
import { getHeight } from 'src/libs/StyleHelper'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 50) / 2

const ProductCardSkeleton: React.FC = () => {
    const animatedValue = useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0.4,
                    duration: 750,
                    useNativeDriver: true,
                }),
            ])
        )
        pulse.start()
        return () => pulse.stop()
    }, [animatedValue])

    return (
        <View style={styles.cardContainer}>
            <Animated.View style={[styles.imageSkeleton, { opacity: animatedValue }]} />
            <View style={styles.detailsContainer}>
                <Animated.View style={[styles.ratingSkeleton, { opacity: animatedValue }]} />
                <Animated.View style={[styles.nameSkeletonLine1, { opacity: animatedValue }]} />
                <Animated.View style={[styles.nameSkeletonLine2, { opacity: animatedValue }]} />
                <Animated.View style={[styles.subtitleSkeleton, { opacity: animatedValue }]} />
                <View style={styles.bottomRow}>
                    <Animated.View style={[styles.priceSkeleton, { opacity: animatedValue }]} />
                    <Animated.View style={[styles.buttonSkeleton, { opacity: animatedValue }]} />
                </View>
            </View>
        </View>
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
    imageSkeleton: {
        width: '100%',
        height: getHeight(150),
        backgroundColor: colors.skeletonBg,
    },
    detailsContainer: {
        padding: 12,
    },
    ratingSkeleton: {
        width: getHeight(42),
        height: getHeight(14),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
        marginBottom: 8,
    },
    nameSkeletonLine1: {
        width: '90%',
        height: getHeight(14),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
        marginBottom: 4,
    },
    nameSkeletonLine2: {
        width: '65%',
        height: getHeight(14),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
        marginBottom: 8,
    },
    subtitleSkeleton: {
        width: '50%',
        height: getHeight(12),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
        marginBottom: 12,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    priceSkeleton: {
        width: getHeight(55),
        height: getHeight(18),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
    },
    buttonSkeleton: {
        width: getHeight(32),
        height: getHeight(32),
        borderRadius: getHeight(16),
        backgroundColor: colors.skeletonBg,
    },
})

export default ProductCardSkeleton
