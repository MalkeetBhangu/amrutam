import React, { useCallback } from 'react'
import { StyleSheet, View, Image, Pressable, Alert } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { logo, comingSoon as ComingSoonIcon, notificationIcon as NotificationIcon } from 'assets'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { useUserState } from '@src/store/UseUserStore'
import { getTexts } from 'src/translations/TranslationHelper'

const Records: React.FC = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const recordsTexts = t.records

    const handleNotifyPress = useCallback(() => {
        Alert.alert(recordsTexts?.notifySuccessTitle || '', recordsTexts?.notifySuccessMessage || '')
    }, [recordsTexts])

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.logoRow}>
                    <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                    <TextView text={recordsTexts?.logoText?.toUpperCase() || ''} style={styles.logoText} />
                </View>
                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatarImage} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.iconCircle}>
                    <ComingSoonIcon width={getHeight(80)} height={getHeight(80)} />
                </View>

                <TextView text={recordsTexts?.comingSoonTitle || ''} style={styles.titleText} />
                <TextView text={recordsTexts?.comingSoonSubtitle || ''} style={styles.subtitleText} />

                <Pressable style={styles.notifyButton} onPress={handleNotifyPress}>
                    <NotificationIcon width={getHeight(18)} height={getHeight(18)} />
                    <TextView text={recordsTexts?.notifyMe || ''} style={styles.notifyButtonText} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
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
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 60,
    },
    iconCircle: {
        width: getHeight(160),
        height: getHeight(160),
        borderRadius: getHeight(80),
        backgroundColor: colors.ratingBadgeBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    titleText: {
        fontSize: getHeight(20),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitleText: {
        fontSize: getHeight(14),
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: getHeight(22),
        marginBottom: 28,
        paddingHorizontal: 10,
    },
    notifyButton: {
        backgroundColor: colors.darkGreen,
        height: getHeight(48),
        borderRadius: getHeight(24),
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    notifyButtonText: {
        color: colors.white,
        fontSize: getHeight(15),
        fontWeight: '600',
        marginLeft: 8,
    },
})

export default React.memo(Records)