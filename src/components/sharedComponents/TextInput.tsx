import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    Pressable,
    StyleProp,
    ViewStyle,
    TextStyle,
    StyleSheet,
} from 'react-native'
import colors from 'src/tokens/Colors'
import fontSizes from 'src/tokens/FontSizes'
import radius from 'src/tokens/Radius'
import spacing from 'src/tokens/Spacing'
import { getHeight } from 'src/libs/StyleHelper'

export interface TextInputProps extends RNTextInputProps {
    label?: string
    error?: string
    leftIcon?: React.ReactNode
    onLeftIconPress?: () => void
    rightIcon?: React.ReactNode
    onRightIconPress?: () => void
    containerStyle?: StyleProp<ViewStyle>
    inputContainerStyle?: StyleProp<ViewStyle>
    inputStyle?: StyleProp<TextStyle>
    labelStyle?: StyleProp<TextStyle>
    isPassword?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    error,
    leftIcon,
    onLeftIconPress,
    rightIcon,
    onRightIconPress,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    labelStyle,
    isPassword = false,
    secureTextEntry,
    placeholderTextColor = colors.inputPlaceholder,
    ...restProps
}) => {
    const [isSecure, setIsSecure] = useState<boolean>(isPassword ? true : !!secureTextEntry)
    const toggleSecure = () => setIsSecure(!isSecure)

    const renderLeftIcon = () => {
        if (leftIcon) {
            return (
                <Pressable
                    onPress={onLeftIconPress}
                    disabled={!onLeftIconPress}
                    hitSlop={10}
                    style={({ pressed }) => [styles.leftIconContainer, pressed && styles.pressed]}
                >
                    {leftIcon}
                </Pressable>
            )
        }
        return null
    }

    const renderRightIcon = () => {
        if (rightIcon) {
            return (
                <Pressable
                    onPress={onRightIconPress}
                    disabled={!onRightIconPress}
                    hitSlop={10}
                    style={({ pressed }) => [styles.rightIconContainer, pressed && styles.pressed]}
                >
                    {rightIcon}
                </Pressable>
            )
        }
        if (isPassword) {
            return (
                <Pressable
                    onPress={toggleSecure}
                    hitSlop={10}
                    style={({ pressed }) => [styles.rightIconContainer, pressed && styles.pressed]}
                >
                    <Text style={styles.passwordToggleText}>{isSecure ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
            )
        }
        return null
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputContainer, !!error && styles.inputContainerError, inputContainerStyle]}>
                {renderLeftIcon()}
                <RNTextInput
                    style={[styles.textInput, inputStyle]}
                    placeholderTextColor={placeholderTextColor}
                    secureTextEntry={isPassword ? isSecure : secureTextEntry}
                    {...restProps}
                />
                {renderRightIcon()}
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: spacing.inputPadding,
    },
    label: {
        fontSize: fontSizes.bodyTextMedium,
        color: colors.textSecondary,
        marginBottom: spacing.marginSmall,
        fontWeight: '200',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.inputBackground,
        borderRadius: radius.input,
        height: getHeight(55),
        paddingHorizontal: spacing.sideMargin,
    },
    inputContainerError: {
        borderColor: colors.badgeRed,
        borderWidth: 1,
    },
    textInput: {
        flex: 1,
        fontSize: fontSizes.bodyTextMedium,
        color: colors.inputText,
        fontWeight: '200',
    },
    leftIconContainer: {
        paddingRight: spacing.marginSmall,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightIconContainer: {
        paddingLeft: spacing.marginSmall,
        justifyContent: 'center',
        alignItems: 'center',
    },
    passwordToggleText: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    errorText: {
        fontSize: fontSizes.bodyTextSmall,
        color: colors.badgeRed,
        marginTop: 4,
    },
    pressed: {
        opacity: 0.7,
    },
})

export default TextInput
