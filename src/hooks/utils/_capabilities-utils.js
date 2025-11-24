/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 */

export const _capabilitiesUtils = {
    /**
     * @return {Boolean}
     */
    isFullscreen: () => {
        return Boolean(document.fullscreenElement)
    },

    /**
     * @param {Number} top
     * @param {Boolean} instant
     */
    scrollTo: (top, instant) => {
        const behavior = instant ?
            "instant" :
            "smooth"

        window.scrollTo({
            top: top,
            behavior: behavior
        })
    },

    /**
     * @public
     */
    toggleFullscreen: () => {
        const isFullscreen = _capabilitiesUtils.isFullscreen()
        if(isFullscreen) {
            document.exitFullscreen()
                .catch(err => {
                    console.warn(`Error attempting to exit full-screen mode: ${err.message}`)
                })
        }
        else {
            document.documentElement.requestFullscreen({ navigationUI: 'hide' })
                .catch(err => {
                    console.warn(`Error attempting to enter full-screen mode: ${err.message}`)
                })
        }
    }
}