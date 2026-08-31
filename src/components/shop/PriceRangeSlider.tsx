import React, { useRef, useState, useMemo, useEffect } from 'react'
import { StyleSheet, View, PanResponder, LayoutChangeEvent } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'

export interface PriceRangeSliderProps {
    min?: number
    max?: number
    step?: number
    minValue: number
    maxValue: number
    onValueChange: (minVal: number, maxVal: number) => void
}

const THUMB_SIZE = getHeight(24)

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ min = 0, max = 5000, step = 100, minValue, maxValue, onValueChange, }) => {
    const [trackWidth, setTrackWidth] = useState<number>(300)
    const trackRef = useRef<View>(null)
    const activeThumbRef = useRef<'min' | 'max' | null>(null)

    const valuesRef = useRef({ minValue, maxValue, trackWidth, min, max, step })
    useEffect(() => {
        valuesRef.current = { minValue, maxValue, trackWidth, min, max, step }
    }, [minValue, maxValue, trackWidth, min, max, step])

    const onValueChangeRef = useRef(onValueChange)
    useEffect(() => {
        onValueChangeRef.current = onValueChange
    }, [onValueChange])

    const handleTrackLayout = (e: LayoutChangeEvent) => {
        const { width } = e.nativeEvent.layout
        if (width > 0) {
            setTrackWidth(width)
        }
    }

    const processTouch = (pageX: number, isGrant: boolean = false) => {
        if (!trackRef.current) return
        trackRef.current.measure((_, __, width, ___, pageXOffset) => {
            const currentWidth = width > 0 ? width : valuesRef.current.trackWidth
            if (currentWidth <= 0) return

            const touchX = pageX - pageXOffset
            const ratio = Math.max(0, Math.min(1, touchX / currentWidth))
            const rawVal = valuesRef.current.min + ratio * (valuesRef.current.max - valuesRef.current.min)
            const steppedVal = Math.round(rawVal / valuesRef.current.step) * valuesRef.current.step
            const clampedVal = Math.max(valuesRef.current.min, Math.min(valuesRef.current.max, steppedVal))

            const currMin = valuesRef.current.minValue
            const currMax = valuesRef.current.maxValue
            const stepVal = valuesRef.current.step

            if (isGrant) {
                const distToMin = Math.abs(clampedVal - currMin)
                const distToMax = Math.abs(clampedVal - currMax)
                activeThumbRef.current = distToMin <= distToMax ? 'min' : 'max'
            }

            if (activeThumbRef.current === 'min') {
                const newMin = Math.min(clampedVal, currMax - stepVal)
                onValueChangeRef.current(newMin, currMax)
            } else if (activeThumbRef.current === 'max') {
                const newMax = Math.max(currMin + stepVal, clampedVal)
                onValueChangeRef.current(currMin, newMax)
            }
        })
    }

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    processTouch(evt.nativeEvent.pageX, true)
                },
                onPanResponderMove: (evt) => {
                    processTouch(evt.nativeEvent.pageX, false)
                },
                onPanResponderRelease: () => {
                    activeThumbRef.current = null
                },
                onPanResponderTerminate: () => {
                    activeThumbRef.current = null
                },
            }),
        []
    )

    const minRatio = Math.max(0, Math.min(1, (minValue - min) / (max - min)))
    const maxRatio = Math.max(0, Math.min(1, (maxValue - min) / (max - min)))

    const leftPosition = `${minRatio * 100}%`
    const activeWidth = `${Math.max(0, (maxRatio - minRatio) * 100)}%`
    const rightPosition = `${Math.min(92, Math.max(0, maxRatio * 92))}%`
    const leftThumbPos = `${Math.min(92, Math.max(0, minRatio * 92))}%`

    return (
        <View style={styles.container}>
            <View
                ref={trackRef}
                onLayout={handleTrackLayout}
                style={styles.sliderTrackContainer}
                {...panResponder.panHandlers}
            >
                <View style={styles.trackBackground} />
                <View
                    style={[
                        styles.activeTrack,
                        {
                            left: leftPosition as any,
                            width: activeWidth as any,
                        },
                    ]}
                />

                <View
                    style={[
                        styles.thumb,
                        {
                            left: leftThumbPos as any,
                        },
                    ]}
                />

                <View
                    style={[
                        styles.thumb,
                        {
                            left: rightPosition as any,
                        },
                    ]}
                />
            </View>

            <View style={styles.labelsRow}>
                <TextView text={`₹${min}`} style={styles.labelMin} />
                <TextView text={`₹${max}+`} style={styles.labelMax} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    sliderTrackContainer: {
        height: 36,
        justifyContent: 'center',
        position: 'relative',
    },
    trackBackground: {
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.sliderTrackBg,
        width: '100%',
    },
    activeTrack: {
        position: 'absolute',
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.darkGreen,
    },
    thumb: {
        position: 'absolute',
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: colors.white,
        borderWidth: 3,
        borderColor: colors.darkGreen,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    labelMin: {
        fontSize: getHeight(13),
        fontWeight: '600',
        color: colors.textSecondary,
    },
    labelMax: {
        fontSize: getHeight(13),
        fontWeight: '600',
        color: colors.textSecondary,
    },
})

export default React.memo(PriceRangeSlider)
