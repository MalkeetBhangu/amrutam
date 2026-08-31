import React, { useCallback, useState } from 'react'
import { StyleSheet, View, Image, Pressable } from 'react-native'
import { logo, backArrow as BackArrowIcon, heartIcon as HeartIcon, } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_AVATAR, DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'
import { useUserState } from '@src/store/UseUserStore'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { ParamsList } from '@src/navigation/useNavigation'


const DoctorDetailsHeader = () => {
    const { userData: { languageCode = DEFAULT_LANGUAGE_CODE } } = useUserState(['languageCode'])
    const t = getTexts(languageCode)
    const detailsText = t.doctors.details
    const [isFavorite, setIsFavorite] = useState<boolean>(false)
    const navigation = useNavigation<StackNavigationProp<ParamsList>>()
    const handleBackPress = useCallback(() => navigation.goBack(), [navigation])

    return (
        <View>
            <View style={styles.topHeader}>
                <View style={styles.logoWrapper}>
                    <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                    <TextView style={styles.logoText} text={t.doctors.logoText.toUpperCase()} />
                </View>
                <Pressable style={styles.avatarWrapper}>
                    <Image source={{ uri: DEFAULT_AVATAR }} style={styles.avatarImage} resizeMode="cover" />
                </Pressable>
            </View>

            <View style={styles.navHeader}>
                <Pressable style={styles.iconCircleButton} onPress={handleBackPress}>
                    <BackArrowIcon width={getHeight(18)} height={getHeight(18)} />
                </Pressable>
                <TextView text={detailsText.doctorProfile} style={styles.screenTitleText} />
                <Pressable style={styles.iconCircleButton} onPress={() => setIsFavorite(prev => !prev)}>
                    <HeartIcon width={getHeight(18)} height={getHeight(18)} stroke={isFavorite ? colors.heartActiveRed : colors.textDark} fill={isFavorite ? colors.heartActiveRed : 'none'} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoImage: {
        height: getHeight(34),
        width: getHeight(34),
    },
    logoText: {
        fontSize: getHeight(18),
        color: colors.darkGreen,
        marginLeft: 8,
        letterSpacing: 1.2,
        fontWeight: '700',
    },
    avatarWrapper: {
        width: getHeight(40),
        height: getHeight(40),
        borderRadius: getHeight(20),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.avatarBorder,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    navHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    iconCircleButton: {
        width: getHeight(40),
        height: getHeight(40),
        borderRadius: getHeight(20),
        backgroundColor: colors.infoBoxBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    screenTitleText: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
    },
})

export default React.memo(DoctorDetailsHeader)
