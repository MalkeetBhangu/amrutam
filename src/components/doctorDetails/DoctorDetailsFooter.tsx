import React from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import { arrowRight as ArrowRightIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'

export interface DoctorDetailsFooterProps {
    consultationFee?: number | string | null
    onBookPress?: () => void
    disabled?: boolean
    buttonText?: string
    hasBookings?: boolean
}

const DoctorDetailsFooter: React.FC<DoctorDetailsFooterProps> = ({
    consultationFee,
    onBookPress,
    disabled = false,
    buttonText,
    hasBookings = false,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const detailsText = t.doctors.details

    const displayButtonText =
        buttonText || (hasBookings ? '← Go back to My Bookings' : detailsText.bookAppointment)

    if (hasBookings) {
        return (
            <View style={styles.footerContainer}>
                <Pressable
                    style={[styles.bookButton, styles.fullWidthButton, disabled && styles.bookButtonDisabled]}
                    onPress={onBookPress}
                    disabled={disabled}
                >
                    <TextView
                        text={displayButtonText}
                        style={[styles.bookButtonText, disabled && styles.bookButtonTextDisabled]}
                    />
                </Pressable>
            </View>
        )
    }

    if (consultationFee == null) return null

    return (
        <View style={styles.footerContainer}>
            <View style={styles.feeWrapper}>
                <TextView text={detailsText.consultationFee} style={styles.feeLabel} />
                <TextView text={`₹${consultationFee}`} style={styles.feeValue} />
            </View>

            <Pressable
                style={[styles.bookButton, disabled && styles.bookButtonDisabled]}
                onPress={onBookPress}
                disabled={disabled}
            >
                <TextView
                    text={displayButtonText}
                    style={[styles.bookButtonText, disabled && styles.bookButtonTextDisabled]}
                />
                <ArrowRightIcon width={getHeight(16)} height={getHeight(16)} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
        elevation: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    feeWrapper: {
        justifyContent: 'center',
    },
    feeLabel: {
        fontSize: getHeight(11.5),
        color: colors.textSecondary,
    },
    feeValue: {
        fontSize: getHeight(20),
        fontWeight: '700',
        color: colors.textDark,
        marginTop: 2,
    },
    bookButton: {
        flex: 1,
        marginLeft: 20,
        height: getHeight(48),
        backgroundColor: colors.darkGreen,
        borderRadius: getHeight(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookButtonText: {
        fontSize: getHeight(14.5),
        fontWeight: '600',
        color: colors.white,
        marginRight: 8,
    },
    fullWidthButton: {
        marginLeft: 0,
    },
    bookButtonDisabled: {
        backgroundColor: colors.disabledGreen,
        opacity: 0.6,
    },
    bookButtonTextDisabled: {
        color: colors.disabledText,
    },
})

export default React.memo(DoctorDetailsFooter)
