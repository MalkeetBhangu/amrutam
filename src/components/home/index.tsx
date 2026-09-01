import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamsList } from '@src/navigation/useNavigation'
import { useUserState } from '@src/store/UseUserStore'
import { bag as BagIcon, medicalKit as MedicalKitIcon, wishlistWhite as WishlistWhiteIcon } from 'assets'
import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import Button from 'src/components/sharedComponents/Button'
import HeaderRow from 'src/components/sharedComponents/HeaderRow'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { TABS } from 'src/constants/Screens'
import { getHeight } from 'src/libs/StyleHelper'
import colors from 'src/tokens/Colors'
import { getTexts } from 'src/translations/TranslationHelper'

const Home: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<ParamsList>>()
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const homeTexts = t.home
    const handleDoctorPress = useCallback(() => { navigation.navigate(TABS.DOCTORS_TAB) }, [navigation])
    const handleShopPress = useCallback(() => { navigation.navigate(TABS.SHOP_TAB) }, [navigation])
    const handleWishlistPress = useCallback(() => { navigation.navigate(TABS.WISHLIST_TAB) }, [navigation])

    return (
        <View style={styles.container}>
            <HeaderRow title={homeTexts?.logoText} />

            <View style={styles.contentContainer}>
                <Button
                    title={homeTexts?.doctor || ''}
                    onPress={handleDoctorPress}
                    leftIcon={<MedicalKitIcon width={getHeight(22)} height={getHeight(22)} color={colors.white} stroke={colors.white} />}
                    height={getHeight(54)}
                    borderRadius={getHeight(14)}
                    style={styles.actionButton}
                    textStyle={styles.buttonText}
                />

                <Button
                    title={homeTexts?.shop || ''}
                    onPress={handleShopPress}
                    leftIcon={<BagIcon width={getHeight(22)} height={getHeight(22)} color={colors.white} stroke={colors.white} />}
                    height={getHeight(54)}
                    borderRadius={getHeight(14)}
                    style={styles.actionButton}
                    textStyle={styles.buttonText}
                />

                <Button
                    title={homeTexts?.wishlist || ''}
                    onPress={handleWishlistPress}
                    leftIcon={<WishlistWhiteIcon width={getHeight(22)} height={getHeight(22)} />}
                    height={getHeight(54)}
                    borderRadius={getHeight(14)}
                    style={styles.actionButton}
                    textStyle={styles.buttonText}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    actionButton: {
        marginBottom: 16,
    },
    buttonText: {
        fontSize: getHeight(16),
        fontWeight: '600',
    },
})

export default React.memo(Home)