import React, { ReactNode } from 'react'
import { StyleSheet, Pressable, ActivityIndicator, StyleProp, ViewStyle, TextStyle, View, } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'

export interface ButtonProps {
    title?: string
    onPress?: () => void
    variant?: 'primary' | 'outline' | 'secondary'
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    disabled?: boolean
    loading?: boolean
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    height?: number
    borderRadius?: number
    children?: ReactNode
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    leftIcon,
    rightIcon,
    disabled = false,
    loading = false,
    style,
    textStyle,
    height = getHeight(50),
    borderRadius = getHeight(14),
    children,
}) => {
    const isPrimary = variant === 'primary'
    const isOutline = variant === 'outline'
    const isSecondary = variant === 'secondary'

    const containerStyle = [
        styles.baseButton,
        { height, borderRadius },
        isPrimary && styles.primaryButton,
        isOutline && styles.outlineButton,
        isSecondary && styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
    ]

    const titleStyle = [
        styles.baseText,
        isPrimary && styles.primaryText,
        isOutline && styles.outlineText,
        isSecondary && styles.secondaryText,
        disabled && styles.disabledText,
        textStyle,
    ]

    const loaderColor = isOutline || isSecondary ? colors.darkGreen : colors.white

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                containerStyle,
                pressed && !disabled && !loading && styles.pressed,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={loaderColor} />
            ) : (
                <View style={styles.contentRow}>
                    {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
                    {title ? <TextView text={title} style={titleStyle} /> : null}
                    {children}
                    {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    baseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        width: '100%',
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: colors.darkGreen,
    },
    outlineButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.chipBorder,
    },
    secondaryButton: {
        backgroundColor: colors.infoBoxBg,
    },
    disabledButton: {
        backgroundColor: colors.disabledGreen,
        borderColor: 'transparent',
    },
    baseText: {
        fontSize: getHeight(15),
        textAlign: 'center',
    },
    primaryText: {
        color: colors.white,
    },
    outlineText: {
        color: colors.darkGreen,
    },
    secondaryText: {
        color: colors.textDark,
    },
    disabledText: {
        color: colors.disabledText,
    },
    leftIconWrapper: {
        marginRight: 8,
    },
    rightIconWrapper: {
        marginLeft: 8,
    },
    pressed: {
        opacity: 0.85,
    },
})

export default React.memo(Button)
