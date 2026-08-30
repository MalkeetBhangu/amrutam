import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'
import { bag as BagIcon } from 'assets'

export interface ShopCartFloatingButtonProps {
    count?: number
    onPress?: () => void
}

const ShopCartFloatingButton: React.FC<ShopCartFloatingButtonProps> = ({ count = 0, onPress }) => {
    return (
        <View style={styles.floatingContainer}>
            <Pressable style={styles.fabButton} onPress={onPress} hitSlop={6}>
                <BagIcon width={getHeight(22)} height={getHeight(22)} color={colors.white} />

                {/* Badge Circle Counter */}
                {count > 0 && (
                    <View style={styles.badgeCircle}>
                        <TextView text={String(count)} style={styles.badgeText} />
                    </View>
                )}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    floatingContainer: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        zIndex: 999,
    },
    fabButton: {
        width: getHeight(56),
        height: getHeight(56),
        borderRadius: getHeight(18),
        backgroundColor: colors.darkGreen,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        position: 'relative',
    },
    badgeCircle: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#D32F2F',
        width: getHeight(20),
        height: getHeight(20),
        borderRadius: getHeight(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.white,
    },
    badgeText: {
        fontSize: getHeight(10),
        fontWeight: '700',
        color: colors.white,
    },
})

export default React.memo(ShopCartFloatingButton)
