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
        const { protocol, host } = window.location
        const basePath = import.meta.env.BASE_URL
        const path = `${protocol}//${host}${basePath}`
        return path.endsWith('/') ? path : `${path}/`
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