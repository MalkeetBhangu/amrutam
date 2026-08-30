import React from 'react'
import { StyleSheet, View, ScrollView, Pressable } from 'react-native'
import colors from 'src/tokens/Colors'
import TextView from 'src/components/sharedComponents/TextView'
import { getHeight } from 'src/libs/StyleHelper'

export interface ShopCategoryFilterProps {
    categories?: string[]
    selectedCategory: string
    onSelectCategory: (cat: string) => void
}

const DEFAULT_CATEGORIES = ['All', 'Skin', 'Hair', 'Immunity', 'Digestive', 'Wellness']

const ShopCategoryFilter: React.FC<ShopCategoryFilterProps> = ({
    categories = DEFAULT_CATEGORIES,
    selectedCategory,
    onSelectCategory,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categories.map((cat) => {
                    const isSelected = selectedCategory === cat || (cat === 'All' && (!selectedCategory || selectedCategory === 'All'))
                    return (
                        <Pressable
                            key={cat}
                            style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
                            onPress={() => onSelectCategory(cat)}
                        >
                            <TextView
                                text={cat}
                                style={[styles.chipText, isSelected ? styles.chipTextSelected : styles.chipTextUnselected]}
                            />
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: getHeight(22),
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipSelected: {
        backgroundColor: colors.darkGreen,
    },
    chipUnselected: {
        backgroundColor: '#ECE8DF',
    },
    chipText: {
        fontSize: getHeight(14),
        fontWeight: '600',
    },
    chipTextSelected: {
        color: colors.white,
    },
    chipTextUnselected: {
        color: '#4A4A4A',
    },
})

export default React.memo(ShopCategoryFilter)
