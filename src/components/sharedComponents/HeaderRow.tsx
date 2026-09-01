import React from 'react'
import { StyleSheet, View, Image, Pressable, StyleProp, ViewStyle } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { logo } from 'assets'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { useUserState } from '@src/store/UseUserStore'
import { getTexts } from 'src/translations/TranslationHelper'

export interface HeaderRowProps {
    title?: string
    rightText?: string
    avatarUri?: string
    onAvatarPress?: () => void
    style?: StyleProp<ViewStyle>
    rightComponent?: React.ReactNode
}

const HeaderRow: React.FC<HeaderRowProps> = ({ title, rightText, avatarUri = DEFAULT_AVATAR, onAvatarPress, style, rightComponent, }) => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const headerTitle = title?.toUpperCase() || t.common?.appName?.toUpperCase()

    return (
        <View style={[styles.headerRow, style]}>
            <View style={styles.logoRow}>
                <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                <TextView text={headerTitle} style={styles.logoText} />
            </View>

            {rightComponent ? (
                rightComponent
            ) : (
                <View style={styles.rightContainer}>
                    {rightText ? <TextView text={rightText} style={styles.rightText} /> : null}
                    <Pressable onPress={onAvatarPress} disabled={!onAvatarPress} style={styles.avatarWrapper}>
                        <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                    </Pressable>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        width: getHeight(28),
        height: getHeight(28),
        marginRight: 8,
    },
    logoText: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.darkGreen,
        letterSpacing: 0.8,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        fontSize: getHeight(15),
        fontWeight: '600',
        color: colors.textDark,
        marginRight: 10,
    },
    avatarWrapper: {
        width: getHeight(38),
        height: getHeight(38),
        borderRadius: getHeight(19),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.avatarBorder,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
})

export default React.memo(HeaderRow)
