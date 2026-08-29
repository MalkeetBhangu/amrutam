import { DEFAULT_LANGUAGE_CODE } from 'src/constants/Constants'
import en from 'src/translations/en.json'


export const languageMap = {
    en: en,
}

export const getTexts = (languageCode: keyof typeof languageMap | string) => {
    let langCode = languageCode
    const lang = Object.keys(languageMap).find((e) => e.includes(langCode))
    if (lang) langCode = lang
    else langCode = DEFAULT_LANGUAGE_CODE
    const obj = languageMap[langCode as keyof typeof languageMap]
    const { translation } = obj
    return translation
}


