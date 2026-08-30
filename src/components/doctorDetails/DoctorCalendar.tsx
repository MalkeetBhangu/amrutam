import React, { useMemo } from 'react'
import { StyleSheet, View, ScrollView, Pressable } from 'react-native'
import { chevronDown as ChevronDownIcon } from 'assets'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import { getHeight } from 'src/libs/StyleHelper'
import { getTexts } from 'src/translations/TranslationHelper'

export interface CalendarDateItem {
    id: string
    day: string
    date: string
    month: string
    fullDate?: Date
}

const generateRealCalendarDates = (count = 14): CalendarDateItem[] => {
    const dates: CalendarDateItem[] = []
    const startDate = new Date()
    for (let i = 0; i < count; i++) {
        const d = new Date(startDate)
        d.setDate(startDate.getDate() + i)

        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
        const dateNum = d.getDate().toString()
        const monthName = d.toLocaleDateString('en-US', { month: 'long' })
        const dateId = d.toISOString().split('T')[0]

        dates.push({
            id: dateId,
            day: dayName,
            date: dateNum,
            month: monthName,
            fullDate: d,
        })
    }
    return dates
}

export interface DoctorCalendarProps {
    datesList?: any[]
    selectedDate?: string
    onSelectDate: (dateId: string) => void
    monthName?: string
}

const DoctorCalendar: React.FC<DoctorCalendarProps> = ({
    datesList,
    selectedDate,
    onSelectDate,
    monthName,
}) => {
    const t = getTexts(DEFAULT_LANGUAGE_CODE)
    const detailsText = t.doctors.details

    const generatedDates = useMemo(() => generateRealCalendarDates(14), [])

    const datesToRender = useMemo(() => {
        if (Array.isArray(datesList) && datesList.length > 0) {
            return datesList.map((item) => {
                const dateStr = typeof item === 'string' ? item : item?.date || item?.id
                if (dateStr && typeof dateStr === 'string' && (item.day === undefined || item.date === dateStr)) {
                    const parts = dateStr.split('-')
                    let d: Date
                    if (parts.length === 3) {
                        d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                    } else {
                        d = new Date(dateStr)
                    }
                    if (!isNaN(d.getTime())) {
                        return {
                            id: dateStr,
                            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                            date: d.getDate().toString(),
                            month: d.toLocaleDateString('en-US', { month: 'long' }),
                            fullDate: d,
                        }
                    }
                }
                return item
            })
        }
        return generatedDates
    }, [datesList, generatedDates])

    const activeSelectedId =
        selectedDate || datesToRender[0]?.id || datesToRender[0]?.date

    const selectedItem = useMemo(() => {
        return datesToRender.find(
            (item: any) =>
                item.id === activeSelectedId ||
                item.date === activeSelectedId ||
                (typeof activeSelectedId === 'string' &&
                    item.id &&
                    activeSelectedId.includes(item.id))
        )
    }, [datesToRender, activeSelectedId])

    const activeMonth =
        monthName ||
        selectedItem?.month ||
        (generatedDates[0] && generatedDates[0].month) ||
        detailsText.october

    return (
        <View style={styles.sectionContainer}>
            {/* Calendar Header Row */}
            <View style={styles.dateHeaderRow}>
                <TextView text={detailsText.selectDate} style={styles.sectionTitle} />
                <Pressable style={styles.monthSelector}>
                    <TextView text={`${activeMonth} `} style={styles.monthText} />
                    <ChevronDownIcon width={getHeight(12)} height={getHeight(12)} />
                </Pressable>
            </View>

            {/* Date Cards Horizontal Scroll List */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.datesScrollContent}
            >
                {datesToRender.map((item: any, index: number) => {
                    const dayStr = typeof item === 'string' ? item : item.day || ''
                    const dateNumStr =
                        typeof item === 'string'
                            ? item
                            : item.date || item.id || String(index)
                    const itemKey = item.id || `${dateNumStr}-${index}`
                    const isSelected =
                        activeSelectedId === itemKey ||
                        activeSelectedId === dateNumStr ||
                        activeSelectedId === item.id ||
                        (typeof activeSelectedId === 'string' &&
                            item.id &&
                            activeSelectedId === item.id)

                    return (
                        <Pressable
                            key={itemKey}
                            onPress={() => onSelectDate(item.id || dateNumStr)}
                            style={[
                                styles.dateCard,
                                isSelected ? styles.dateCardSelected : styles.dateCardUnselected,
                            ]}
                        >
                            {Boolean(dayStr) && (
                                <TextView
                                    text={dayStr}
                                    style={[
                                        styles.dateDayText,
                                        isSelected
                                            ? styles.dateDayTextSelected
                                            : styles.dateDayTextUnselected,
                                    ]}
                                />
                            )}
                            <TextView
                                text={dateNumStr}
                                style={[
                                    styles.dateNumText,
                                    isSelected
                                        ? styles.dateNumTextSelected
                                        : styles.dateNumTextUnselected,
                                ]}
                            />
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: getHeight(18),
        fontWeight: '700',
        color: colors.textDark,
    },
    dateHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    monthSelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    monthText: {
        fontSize: getHeight(13),
        fontWeight: '600',
        color: colors.darkGreen,
    },
    datesScrollContent: {
        gap: 10,
        paddingVertical: 4,
    },
    dateCard: {
        width: getHeight(62),
        height: getHeight(74),
        borderRadius: getHeight(14),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    dateCardUnselected: {
        backgroundColor: colors.white,
        borderColor: colors.cardBorder,
    },
    dateCardSelected: {
        backgroundColor: colors.darkGreen,
        borderColor: colors.darkGreen,
    },
    dateDayText: {
        fontSize: getHeight(12),
        marginBottom: 4,
    },
    dateDayTextUnselected: {
        color: colors.textSecondary,
    },
    dateDayTextSelected: {
        color: colors.selectedSubText,
    },
    dateNumText: {
        fontSize: getHeight(18),
        fontWeight: '700',
    },
    dateNumTextUnselected: {
        color: colors.textDark,
    },
    dateNumTextSelected: {
        color: colors.white,
    },
})

export default React.memo(DoctorCalendar)
