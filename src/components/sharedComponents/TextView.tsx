import React, { ReactNode } from 'react'
import { LayoutChangeEvent, StyleProp, Text, TextProps, TextStyle } from 'react-native'

export interface TextViewProps extends TextProps {
    style?: StyleProp<TextStyle>
    textId?: string
    text?: string
    numberOfLines?: number
    key?: string | number
    onPress?: () => void
    onLayout?: (e: LayoutChangeEvent) => void
    children?: ReactNode
    fontFamily?: string
}

const TextView: React.FunctionComponent<TextViewProps> = (props) => {
    const { text, numberOfLines, style, onPress, onLayout, fontFamily, children, ...rest } = props
    return (
        <Text {...rest} style={[style, fontFamily ? { fontFamily } : undefined]} numberOfLines={numberOfLines} onLayout={onLayout} onPress={onPress} >
            <>
                {text}
                {children}
            </>
        </Text>
    )
}

export default React.memo(TextView)
