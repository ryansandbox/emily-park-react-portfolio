/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 */

export const _urlUtils = {
    /**
     * @return {string}
     */
    getAbsoluteLocation: () => {
        const { protocol, host, pathname, search, hash } = window.location
        return `${protocol}//${host}${pathname}${search}${hash}`
    },

    /**
     * @return {string}
     */
    getRootLocation: () => {
        const { protocol, host, pathname, search, hash } = window.location
        const path = `${protocol}//${host}${pathname}`
        return path.endsWith('/') ? path : `${path}/`
    },

    /**
     * @param {string} url
     * @return {boolean}
     */
    isExternal: (url) => {
        const link = document.createElement('a')
        link.href = url
        return link.hostname !== window.location.hostname
    },

    /**
     * @param {string} url
     * @return {boolean}
     */
    isImage: (url) => {
        return /\.(jpg|jpeg|png|gif|bmp|svg|ico)$/i.test(url)
    },

    /**
     * @param {string} url
     * @return {boolean}
     */
    isLocal: (url) => {
        return !_urlUtils.isExternal(url)
    },

    /**
     * @param {String} url
     */
    open: (url) => {
        window.open(url, "_blank")
    },

    /**
     * @param {String} youtubeRawUrl
     * @return {String}
     */
    toYoutubeEmbed: (youtubeRawUrl) => {
        const urlObj = new URL(youtubeRawUrl)
        const videoId = urlObj.searchParams.get('v')
        return `https://www.youtube.com/embed/${videoId}`
    }
}