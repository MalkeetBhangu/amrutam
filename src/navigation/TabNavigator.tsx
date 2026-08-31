import React from 'react'
import { StyleSheet, View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { doctors, home, profile, records, shop } from '@assets/index'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Bookings from '@src/components/bookings/Bookings'
import Cart from '@src/components/cart'
import DoctorDetails from '@src/components/doctorDetails'
import Doctors from '@src/components/doctors'
import Home from '@src/components/home'
import Wishlist from '@src/components/wishlist'
import Records from '@src/components/records'
import Shop from '@src/components/shop'
import { getHeight } from '@src/libs/StyleHelper'
import colors from '@src/tokens/Colors'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { Screens, TABS } from 'src/constants/Screens'
import { getTexts } from 'src/translations/TranslationHelper'
import ProductDetail from '@src/components/productDetail'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const withTopSafeArea = (Component: React.ComponentType<any>) => (props: any) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.screenBackground }} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.screenBackground} />
        <Component {...props} />
    </SafeAreaView>
)

export const HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.HOME} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.HOME} component={withTopSafeArea(Home)} />
            <Stack.Screen name={Screens.CART} component={withTopSafeArea(Cart)} />
        </Stack.Navigator>
    )
}

const DoctorsNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.DOCTORS} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.DOCTORS} component={withTopSafeArea(Doctors)} />
            <Stack.Screen name={Screens.DOCTOR_DETAILS} component={withTopSafeArea(DoctorDetails)} />
            <Stack.Screen name={Screens.BOOKINGS} component={withTopSafeArea(Bookings)} />
        </Stack.Navigator>
    )
}

const ShopNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.SHOP} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.SHOP} component={withTopSafeArea(Shop)} />
            <Stack.Screen name={Screens.CART} component={withTopSafeArea(Cart)} />
            <Stack.Screen name={Screens.PRODUCT_DETAIL} component={ProductDetail} />
        </Stack.Navigator>
    )
}

const RecordsNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.RECORDS} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.RECORDS} component={withTopSafeArea(Records)} />
        </Stack.Navigator>
    )
}

const WishListNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={Screens.WISHLIST} screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Screens.WISHLIST} component={withTopSafeArea(Wishlist)} />
            <Stack.Screen name={Screens.CART} component={withTopSafeArea(Cart)} />
        </Stack.Navigator>
    )
}

const TabNavigator = () => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)

    const TabNames = [
        { tabIcon: home, name: TABS.HOME_TAB, screen: HomeNavigator, label: t.tabs.home },
        { tabIcon: doctors, name: TABS.DOCTORS_TAB, screen: DoctorsNavigator, label: t.tabs.doctors },
        { tabIcon: shop, name: TABS.SHOP_TAB, screen: ShopNavigator, label: t.tabs.shop },
        { tabIcon: records, name: TABS.RECORDS_TAB, screen: RecordsNavigator, label: t.tabs.records },
        { tabIcon: profile, name: TABS.WISHLIST_TAB, screen: WishListNavigator, label: t.tabs.wishlist }
    ]

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarHideOnKeyboard: true,
                tabBarLabelPosition: 'below-icon',
                tabBarActiveTintColor: colors.primaryGreen,
                tabBarInactiveTintColor: colors.greyColor,
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            {TabNames?.map((item) => {
                return (
                    <Tab.Screen
                        key={item.name}
                        options={{
                            title: item.label,
                            tabBarIcon: ({ focused }) => {
                                const Icon = item.tabIcon
                                const tintColor = focused ? colors.primaryGreen : colors.greyColor
                                return (
                                    <View style={styles.iconWrapper}>
                                        <Icon width={18} height={18} fill={tintColor} color={tintColor} />
                                    </View>
                                )
                            }
                        }}
                        name={item.name}
                        component={item.screen}
                    />
                )
            })}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        borderTopWidth: getHeight(1),
        borderTopColor: colors.shadowColor,
        backgroundColor: colors.white,
        height: getHeight(65),
        paddingBottom: getHeight(8),
        paddingTop: getHeight(6),
        elevation: 4,
    },
    tabBarLabel: {
        fontSize: getHeight(11),
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default TabNavigator
