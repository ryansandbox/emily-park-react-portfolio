/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 */

import {useConstants} from "/src/hooks/constants.js"

const constants = useConstants()

export const _domUtils = {
    /**
     * @return {boolean}
     **/
    didLoadImagesWithQuerySelector: (querySelector) => {
        const images = document.querySelectorAll(querySelector || 'img')
        return Array.from(images).every(img => img.complete && img.naturalHeight !== 0)
    },

    /**
     * @param {String} imageClass
     * @return {number}
     */
    getImageCount: (imageClass) => {
        const imageElements = document.querySelectorAll(`.${imageClass}`)
        return Array.from(imageElements).length
    },

    /**
     * @param {String} imageClass
     * @return {number}
     */
    getImageLoadPercentage: (imageClass) => {
        const imageElements = document.querySelectorAll(`.${imageClass}`)
        const imageLoadProgress = { loaded: 0, total: 0 }

        Array.from(imageElements).map(item => {
            imageLoadProgress.total++
            if(item.classList.contains(imageClass + "-loaded") || item.classList.contains(imageClass + "-error"))
                imageLoadProgress.loaded++
        })

        if(imageLoadProgress.total === 0)
            return 100

        const percentage = Math.round(100*imageLoadProgress.loaded/imageLoadProgress.total)
        return Math.max(0, Math.min(100, percentage))
    },

    /**
     * @param {HTMLElement} element
     * @return {boolean}
     */
    isElementOutsideBounds: (element) => {
        const rect = element.getBoundingClientRect()

        return (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.top > window.innerHeight
        )
    },

    /**
     * @param {HTMLElement} element
     * @param {Number} x
     * @param {Number} y
     * @return {boolean}
     */
    isInsideElement: (element, x, y) => {
        if (!element) return false

        const rect = element.getBoundingClientRect()
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        )
    },

    /**
     * @param {Boolean} enabled
     */
    setBodyScrollEnabled: (enabled) => {
        if(window.__scrollEnabled === undefined) window.__scrollEnabled = true
        if(enabled) _domUtils._enableScroll()
        else _domUtils._disableScroll()
    },

    /**
     * @private
     */
    _enableScroll: () => {
        if(window.__scrollEnabled) return

        const bodyStyle = document.body.style
        bodyStyle.position = window.__savedBodyStyle.position
        bodyStyle.top = window.__savedBodyStyle.top
        bodyStyle.left = window.__savedBodyStyle.left
        bodyStyle.right = window.__savedBodyStyle.right
        bodyStyle.width = window.__savedBodyStyle.width
        bodyStyle.overflow = window.__savedBodyStyle.overflow
        delete window.__savedBodyStyle

        window.__scrollEnabled = true
    },

    /**
     * @private
     */
    _disableScroll: () => {
        if(!window.__scrollEnabled) return

        const bodyStyle = document.body.style

        const defaultBodyStyle = {}
        defaultBodyStyle.position = bodyStyle.position
        defaultBodyStyle.top = bodyStyle.top
        defaultBodyStyle.left = bodyStyle.left
        defaultBodyStyle.right = bodyStyle.right
        defaultBodyStyle.width = bodyStyle.width
        defaultBodyStyle.overflow = bodyStyle.overflow
        window.__savedBodyStyle = defaultBodyStyle

        bodyStyle.position = 'fixed'
        bodyStyle.top = `0px`
        bodyStyle.left = '0'
        bodyStyle.right = '0'
        bodyStyle.width = '100%'
        bodyStyle.overflow = 'hidden'

        window.__scrollEnabled = false
    }
}