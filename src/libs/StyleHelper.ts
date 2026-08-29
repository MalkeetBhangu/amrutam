import { Dimensions } from 'react-native'

const getWindowSize = () => {
    const { width, height } = Dimensions.get('window')
    return { windowWidth: width, windowHeight: height }
}
export const getFigmaBase = () => {
    return { width: 376, height: 812 }
}
export const getWidth = (figmaWidth: number) => {
    const { windowWidth } = getWindowSize()
    return (windowWidth / getFigmaBase().width) * figmaWidth
}
export const getHeight = (figmaHeight: number) => {
    const { windowHeight } = getWindowSize()
    return (windowHeight / getFigmaBase().height) * figmaHeight
}
export const scale = (size: number) => {
    const { windowWidth } = getWindowSize()
    return (windowWidth / getFigmaBase().width) * size
}
export const verticalScale = (size: number) => {
    const { windowHeight } = getWindowSize()
    return (windowHeight / getFigmaBase().height) * size
}
export const moderateScale = (size: number, factor: number = 0.5) => {
    const avgScale = (scale(size) + verticalScale(size)) / 2
    return size + (avgScale - size) * factor
}
