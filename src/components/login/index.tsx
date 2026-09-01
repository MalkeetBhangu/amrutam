import React, { useCallback } from 'react'
import { StyleSheet, View, Text, Dimensions, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import colors from 'src/tokens/Colors'
import { Screens } from 'src/constants/Screens'
import { useUserState } from 'src/store/UseUserStore'
import { useCreateUser } from 'src/apis/useCreateUser'
import { getHeight } from 'src/libs/StyleHelper'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getTexts } from 'src/translations/TranslationHelper'
import Button from 'src/components/sharedComponents/Button'
import { logoSvg as LogoSvg, consultant as ConsultantIcon, shopIcon as ShopBagIcon, } from '@assets/index'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')


const Login: React.FC = () => {
    const navigation = useNavigation<any>()
    const insets = useSafeAreaInsets()
    const { userData, setUserData } = useUserState()
    const { mutate: createUserMutate, isPending } = useCreateUser()
    const textData = getTexts(userData.languageCode ?? DEFAULT_LANGUAGE_CODE)
    const loginTexts = textData.login

    const handleCreateAccount = useCallback(() => {
        if (!userData?.userId) {
            createUserMutate(undefined, {
                onSuccess: (data) => {
                    const userId = data.data?.userId ?? ''
                    if (userId) {
                        setUserData({ userId })
                        navigation.replace(Screens.MAIN_TABS)
                    } else {
                        Alert.alert(
                            loginTexts?.errorTitle,
                            loginTexts?.userCreateError
                        )
                    }
                },
                onError: () => {
                    Alert.alert(
                        loginTexts?.errorTitle,
                        loginTexts?.userCreateError
                    )
                }
            })
        } else {
            navigation.replace(Screens.MAIN_TABS)
        }
    }, [userData?.userId, createUserMutate, setUserData, navigation, loginTexts])


    return (
        <View style={styles.container}>
            <View style={[styles.contentContainer, { paddingTop: Math.max(insets.top, 24) }]}>
                <View style={styles.centerSection}>
                    <View style={styles.logoContainer}>
                        <LogoSvg width={64} height={64} />
                    </View>

                    <Text style={styles.titleText}>{loginTexts?.title}</Text>
                    <Text style={styles.subtitleText}>{loginTexts?.subtitle}</Text>

                    <View style={styles.featuresList}>
                        <View style={styles.featureRow}>
                            <View style={styles.featureIconBadge}>
                                <ConsultantIcon width={16} height={16} />
                            </View>
                            <View style={styles.featureTextWrapper}>
                                <Text style={styles.featureTitle}>{loginTexts?.expertConsults}</Text>
                                <Text style={styles.featureDescription}>{loginTexts?.expertConsultsDesc}</Text>
                            </View>
                        </View>
                        <View style={styles.featureRow}>
                            <View style={styles.featureIconBadge}>
                                <ShopBagIcon width={16} height={17} />
                            </View>
                            <View style={styles.featureTextWrapper}>
                                <Text style={styles.featureTitle}>{loginTexts?.curatedShop}</Text>
                                <Text style={styles.featureDescription}>{loginTexts?.curatedShopDesc}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={[styles.bottomSection, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <Button title={loginTexts?.createAccountBtn} onPress={handleCreateAccount} loading={isPending} height={getHeight(52)} borderRadius={26} style={styles.primaryButton} textStyle={styles.primaryButtonText} />
                </View>
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
        justifyContent: 'space-between',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        marginTop: -SCREEN_HEIGHT * 0.05,
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: getHeight(23),
        fontWeight: '700',
        color: colors.textDark,
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: getHeight(14.5),
        lineHeight: getHeight(21),
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 16,
        fontWeight: '400',
    },
    featuresList: {
        width: '100%',
        maxWidth: 360,
        marginTop: 38,
        paddingHorizontal: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    featureIconBadge: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EDF4EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureTextWrapper: {
        marginLeft: 14,
        flex: 1,
        justifyContent: 'center',
    },
    featureTitle: {
        fontSize: getHeight(14.5),
        fontWeight: '600',
        color: colors.textDark,
    },
    featureDescription: {
        fontSize: getHeight(12.5),
        lineHeight: getHeight(17),
        color: colors.textSecondary,
        marginTop: 2,
    },
    bottomSection: {
        paddingHorizontal: 24,
        alignItems: 'center',
        width: '100%',
    },
    primaryButton: {
        width: '100%',
        maxWidth: 380,
        height: getHeight(52),
        backgroundColor: colors.darkGreen,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.darkGreen,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: getHeight(15.5),
        fontWeight: '600',
        letterSpacing: 0.1,
    },
})

export default React.memo(Login)