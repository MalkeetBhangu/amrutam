import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamsList } from '@src/navigation/useNavigation'
import { useUserState } from '@src/store/UseUserStore'
import { bag as BagIcon, logo, medicalKit as MedicalKitIcon, wishlistWhite as WishlistWhiteIcon } from 'assets'
import React, { useCallback } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { TABS } from 'src/constants/Screens'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'

const Home: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<ParamsList>>()
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const homeTexts = t.home
    const handleDoctorPress = useCallback(() => { navigation.navigate(TABS.DOCTORS_TAB as any) }, [navigation])
    const handleShopPress = useCallback(() => { navigation.navigate(TABS.SHOP_TAB as any) }, [navigation])
    const handleWishlistPress = useCallback(() => { navigation.navigate(TABS.WISHLIST_TAB as any) }, [navigation])

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.logoRow}>
                    <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                    <TextView text={homeTexts?.logoText || ''} style={styles.logoText} />
                </View>

                <View style={styles.avatarWrapper}>
                    <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatarImage} />
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Pressable style={styles.actionButton} onPress={handleDoctorPress}>
                    <MedicalKitIcon width={getHeight(22)} height={getHeight(22)} color={colors.white} stroke={colors.white} />
                    <TextView text={homeTexts?.doctor || ''} style={styles.buttonText} />
                </Pressable>

                <Pressable style={styles.actionButton} onPress={handleShopPress}>
                    <BagIcon width={getHeight(22)} height={getHeight(22)} color={colors.white} stroke={colors.white} />
                    <TextView text={homeTexts?.shop || ''} style={styles.buttonText} />
                </Pressable>

                <Pressable style={styles.actionButton} onPress={handleWishlistPress}>
                    <WishlistWhiteIcon width={getHeight(22)} height={getHeight(22)} />
                    <TextView text={homeTexts?.wishlist || ''} style={styles.buttonText} />
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
        letterSpacing: 0.5,
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
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    actionButton: {
        height: getHeight(54),
        backgroundColor: colors.darkGreen,
        borderRadius: getHeight(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        gap: 10,
    },
    buttonText: {
        color: colors.white,
        fontSize: getHeight(16),
        fontWeight: '600',
    },
})

export default React.memo(Home)