import React, { useEffect, useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import colors from 'src/tokens/Colors'
import { getHeight } from 'src/libs/StyleHelper'

const DoctorCardSkeleton: React.FC = () => {
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
            <View style={styles.topSection}>
                {/* Avatar Skeleton */}
                <Animated.View style={[styles.avatarSkeleton, { opacity: animatedValue }]} />

                <View style={styles.infoColumn}>
                    {/* Name & Rating Row */}
                    <View style={styles.nameRow}>
                        <Animated.View style={[styles.nameSkeleton, { opacity: animatedValue }]} />
                        <Animated.View style={[styles.ratingSkeleton, { opacity: animatedValue }]} />
                    </View>

                    {/* Specialty Text Skeleton */}
                    <Animated.View style={[styles.specialtySkeleton, { opacity: animatedValue }]} />

                    {/* Meta Row Skeleton */}
                    <Animated.View style={[styles.metaRowSkeleton, { opacity: animatedValue }]} />
                </View>
            </View>

            {/* Slots Info Boxes Row */}
            <View style={styles.slotsRow}>
                <Animated.View style={[styles.infoBoxSkeleton, { opacity: animatedValue }]} />
                <Animated.View style={[styles.infoBoxSkeleton, { opacity: animatedValue }]} />
            </View>

            {/* Book Button Skeleton */}
            <Animated.View style={[styles.buttonSkeleton, { opacity: animatedValue }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.white,
        borderRadius: getHeight(20),
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        elevation: 2,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatarSkeleton: {
        width: getHeight(80),
        height: getHeight(80),
        borderRadius: getHeight(16),
        backgroundColor: colors.skeletonBg,
    },
    infoColumn: {
        flex: 1,
        marginLeft: 14,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    nameSkeleton: {
        width: '55%',
        height: getHeight(16),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
    },
    ratingSkeleton: {
        width: getHeight(44),
        height: getHeight(20),
        borderRadius: getHeight(10),
        backgroundColor: colors.skeletonBg,
    },
    specialtySkeleton: {
        width: '45%',
        height: getHeight(12),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
        marginTop: 8,
    },
    metaRowSkeleton: {
        width: '75%',
        height: getHeight(12),
        borderRadius: 4,
        backgroundColor: colors.skeletonBg,
        marginTop: 10,
    },
    slotsRow: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-between',
    },
    infoBoxSkeleton: {
        flex: 1,
        height: getHeight(56),
        backgroundColor: colors.skeletonBg,
        borderRadius: getHeight(14),
        marginRight: 10,
    },
    buttonSkeleton: {
        height: getHeight(48),
        backgroundColor: colors.skeletonBg,
        borderRadius: getHeight(14),
        marginTop: 14,
    },
})

export default DoctorCardSkeleton
