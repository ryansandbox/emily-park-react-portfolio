/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 * @description This class is a wrapper for the article item data. It provides methods to parse and validate the data loaded from an article's list.
 */

import {useUtils} from "/src/hooks/utils.js"

const utils = useUtils()

export default class ArticleItemDataWrapper {
    /**
     * @param {ArticleDataWrapper} articleDataWrapper
     * @param {Object} rawData
     * @param {Object} language
     * @param {Object} theme
     * @param {Number} id
     */
    constructor(articleDataWrapper, rawData, language, theme, id) {
        this._articleDataWrapper = articleDataWrapper

        this.id = id
        this.categoryId = rawData.categoryId
        this.category = undefined

        const date = this._parseDate(rawData.date)
        const dateStart = this._parseDate(rawData.dateStart) || date
        const dateEnd = this._parseDate(rawData.dateEnd)

        this.dateStart = date || dateStart
        this.dateStartDisplay = language.getDateLocaleString(this.dateStart)
        this.dateStartDisplayAsExperienceTime = language.getExperienceTimeString(this.dateStart)

        this.dateEnd = dateEnd
        this.dateEndDisplay = language.getDateLocaleString(dateEnd)

        this.date = dateStart

        this.faIcon = rawData.faIcon
        this.faIconColors = this._parseColor(rawData.faIconColors, theme)

        this.img = language.parseJsonText(rawData.img)
        this.label = rawData.label
        this.link = this._parseLink(rawData.link, language)
        this.locales = this._parseLocales(rawData.locales, language)
        this.percentage = this._parseNumber(rawData.percentage, 0, 100)
        this.preview = this._parsePreview(rawData.preview, language)
    }

    _parseNumber(rawNumber, min = -99999999999, max = 99999999999) {
        if (!rawNumber) return undefined

        const cast = Number(rawNumber)
        if(isNaN(cast) || cast === null) return undefined

        return utils.number.clamp(cast, min, max)
    }

    _parseColor(rawColor, theme) {
        if(!rawColor)
            return undefined

        const isDarkTheme = theme.getSelectedTheme()?.dark

        const bgDarkColor = rawColor["bg"] || rawColor["bgDark"] || rawColor["background"] || rawColor["backgroundDark"]
        const bgLightColor = rawColor["bgLight"] || rawColor["backgroundLight"]

        const fillDarkColor = rawColor["fill"] || rawColor["color"] || rawColor["fillDark"] || rawColor["colorDark"]
        const fillLightColor = rawColor["fillLight"] || rawColor["colorLight"]

        if(isDarkTheme) {
            return {
                backgroundColor: bgDarkColor,
                color: fillDarkColor
            }
        }
        else {
            return {
                backgroundColor: bgLightColor || bgDarkColor,
                color: fillLightColor || fillDarkColor
            }
        }
    }

    _parseDate(rawDate) {
        if (!rawDate) return undefined
        if (rawDate.now) return new Date()
        if (!rawDate.year || !rawDate.month) return undefined

        const year = rawDate.year
        const month = rawDate.month != null ? rawDate.month - 1 : 0
        const day = rawDate.day != null ? rawDate.day : 1
        return new Date(year, month, day)
    }

    _parseLink(rawLink, language) {
        if(!rawLink)
            return undefined

        const tooltipString = rawLink["tooltipString"]

        return {
            href: rawLink.href,
            faIcon: rawLink.faIcon || undefined,
            tooltip: tooltipString ?
                language.getString(tooltipString) :
                null
        }
    }

    _parseLocales(locales, language) {
        if(!locales)
            return {}

        const translations = {
            title: language.getTranslation(locales, "title", null),
            country: language.getTranslation(locales, "country", null),
            institution: language.getTranslation(locales, "institution", null),
            level: language.getTranslation(locales, "level", null),
            list: language.getTranslation(locales, "list", null),
            province: language.getTranslation(locales, "province", null),
            tags: language.getTranslation(locales, "tags", []),
            text: language.getTranslation(locales, "text", null),
            label: language.getTranslation(locales, "label", null),
        }

        if(translations.list && Array.isArray(translations.list)) {
            translations.list = translations.list.map(item => {
                return language.parseJsonText(item)
            })
        }

        return translations
    }

    _parsePreview(rawPreview, language) {
        if(!rawPreview)
            return {}

        const links = rawPreview["links"].map(rawLink => {
            return this._parseLink(rawLink, language)
        })

        const screenshots = rawPreview["screenshots"] || []
        const supportedRatios = ["16:9", "1:1", "9:16"]

        let screenshotsAspectRatio = rawPreview["screenshotsAspectRatio"]
        if(screenshots.length > 0 && supportedRatios.indexOf(screenshotsAspectRatio) === -1) {
            screenshotsAspectRatio = "1:1"
            utils.log.warn("ArticleItemDataWrapper", "Invalid screenshotsAspectRatio value. Supported values are: " + supportedRatios.join(", ") + ". Using default value 1:1.")
        }

        return {
            hasLinks: links.length > 0,
            hasScreenshots: screenshots.length > 0,
            hasScreenshotsOrYoutubeVideo: screenshots.length > 0 || rawPreview.youtubeVideo,
            screenshotsAspectRatio: screenshotsAspectRatio,

            links: links,
            screenshots: screenshots,
            youtubeVideo: rawPreview.youtubeVideo
        }
    }

    get uniqueId() {
        return this._articleDataWrapper.uniqueId + "-item-" + this.id
    }

    get articleWrapper() {
        return this._articleDataWrapper
    }

    get faIconStyle() {
        if(!this.faIconColors)
            return null

        return {
            backgroundColor: this.faIconColors["backgroundColor"] || null,
            color: this.faIconColors["color"] || null,
        }
    }

    get imageAlt() {
        if(this.label) return utils.string.stripHTMLTags(this.label)
        if(this.locales.title) return utils.string.stripHTMLTags(this.locales.title)
        return "item-" + this.id
    }

    get fullLocation() {
        let location = ""

        if(this.locales.province) location += this.locales.province
        if(this.locales.province && this.locales.country) location += " – "
        if(this.locales.country) location += this.locales.country

        return location
    }

    get shortLocation() {
        if(this.locales.country) return this.locales.country
        return this.locales.province
    }

    get placeholder() {
        return `Item ${this.id}`
    }

    get faIconWithFallback() {
        return this.faIcon || `fa-solid fa-clone`
    }

    listProps() {
        const props = []
        const staticKeys = ["id", "label", "img", "faIcon", "faIconColors", "link", "dateStart", "dateEnd", "percentage"]
        for (const key of staticKeys)
            props.push(this._parsePropForListing(key, this[key]))

        const locales = this.locales || {}
        const localesEntries = Object.entries(locales)
        for (const [key, value] of localesEntries)
            props.push(this._parsePropForListing(key, value))

        const previewKeys = ["youtubeVideo", "hasScreenshots", "hasLinks"]
        for (const key of previewKeys)
            props.push(this._parsePropForListing(key, this.preview[key]))

        return props.filter(prop => prop.value)
    }

    _parsePropForListing(name, value) {
        if(value === null || value === undefined)
            return ""

        if(value instanceof Date) value = value.toLocaleDateString(undefined, { month: "long", year: "numeric" })
        else if(Array.isArray(value)) value = utils.array.toHtmlList(value)
        else if (typeof value === "object") value = utils.json.sanitizeForLogs(value)

        return {
            name,
            value: value.toString()
        }
    }
}