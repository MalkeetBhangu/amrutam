import React, { useState, useRef, useMemo, useCallback } from 'react'
import { StyleSheet, View, PanResponder, LayoutChangeEvent, DimensionValue } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getTexts } from 'src/translations/TranslationHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { useUserState } from '@src/store/UseUserStore'

export interface FeeRangeSliderProps {
    minFee?: number
    maxFee: number
    onFeeChange: (newMaxFee: number) => void
    maxLimit?: number
}

const FeeRangeSlider: React.FC<FeeRangeSliderProps> = ({ minFee = 0, maxFee, onFeeChange, maxLimit = 2000, }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const filterTranslations = t.doctors?.filterModal || {}
    const [trackWidth, setTrackWidth] = useState<number>(300)
    const trackRef = useRef<View>(null)

    const handleTrackLayout = useCallback((e: LayoutChangeEvent) => {
        const { width } = e.nativeEvent.layout
        if (width > 0) {
            setTrackWidth(width)
        }
    }, [])

    const updateFeeFromPageX = useCallback((pageX: number) => {
        if (!trackRef.current) return
        trackRef.current.measure((_, __, width, ___, pageXOffset) => {
            const currentWidth = width > 0 ? width : trackWidth
            if (currentWidth > 0) {
                const touchX = pageX - pageXOffset
                const ratio = Math.max(0, Math.min(1, touchX / currentWidth))
                const newFee = Math.round((ratio * maxLimit) / 100) * 100
                onFeeChange(Math.max(100, newFee))
            }
        })
    }, [trackWidth, maxLimit, onFeeChange])

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    updateFeeFromPageX(evt.nativeEvent.pageX)
                },
                onPanResponderMove: (evt) => {
                    updateFeeFromPageX(evt.nativeEvent.pageX)
                },
            }),
        [updateFeeFromPageX]
    )

    const rightHandlePosition = `${Math.min(92, Math.max(0, (maxFee / maxLimit) * 92))}%`

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.feeTitleRow}>
                <TextView text={filterTranslations.consultationFee} style={styles.sectionTitle} />
                <TextView text={`₹${minFee} - ₹${maxFee}+`} style={styles.feeValueText} />
            </View>

            <View
                ref={trackRef}
                onLayout={handleTrackLayout}
                style={styles.sliderTrackContainer}
                {...panResponder.panHandlers}
            >
                <View style={styles.sliderBackgroundTrack} />
                <View style={[styles.sliderActiveTrack, { width: `${(maxFee / maxLimit) * 100}%` }]} />
                <View style={styles.sliderHandleLeft} />
                <View style={[styles.sliderHandleRight, { left: rightHandlePosition as DimensionValue }]} />
            </View>

            <View style={styles.feeLabelRow}>
                <TextView text={filterTranslations.free} style={styles.feeMinMaxText} />
                <TextView text={`₹${maxLimit}+`} style={styles.feeMinMaxText} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: getHeight(15),
        color: colors.textDark,
        marginBottom: 12,
    },
    feeTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    feeValueText: {
        fontSize: getHeight(14),
        color: colors.darkGreen,
    },
    sliderTrackContainer: {
        height: 36,
        justifyContent: 'center',
        position: 'relative',
        marginTop: 6,
    },
    sliderBackgroundTrack: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.sliderTrackBg,
        width: '100%',
    },
    sliderActiveTrack: {
        position: 'absolute',
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.darkGreen,
    },
    sliderHandleLeft: {
        position: 'absolute',
        left: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.darkGreen,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    sliderHandleRight: {
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.darkGreen,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    feeLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    feeMinMaxText: {
        fontSize: getHeight(13),
        color: colors.textSecondary,
    },
})

export default React.memo(FeeRangeSlider)
