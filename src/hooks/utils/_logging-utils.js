/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 */

export const _loggingUtils = {
    /**
     * @param {String} component
     * @param {String} errorMessage
     */
    throwError: (component, errorMessage) => {
        throw new Error(`[${component}] ${errorMessage}`)
    },

    /**
     * @param {String} component
     * @param {String} warningMessage
     */
    warn: (component, warningMessage) => {
        if(!console || !console.log)
            return
        console.warn(`[${component}] ${warningMessage}`)
    },

    /**
     * @param {String} message
     * @param {String} color
     * @param {Number} fontSizeInEm
     * @param {Boolean} bold
     */
    stylizedLog: (message, color, fontSizeInEm, bold) => {
        const style = `
        color: ${color}; 
        font-size: ${fontSizeInEm}em; 
        font-weight: ${bold ? 'bold' : 'normal'};
        `
        console.log(`%c${message}`, style)
    },

    /**
     * @param {String} title
     * @param {Array} items
     * @param {String} primaryColor
     */
    info: (title, items, primaryColor) => {
        if(!console || !console.log)
            return

        if(title) {
            _loggingUtils.stylizedLog(
                `\n${title}\n`,
                primaryColor,
                1.7,
                true
            )
        }

        const body = items.map(item => {
            const itemListPrefixes = {
                bulleted: "• ",
                none: ""
            }

            const itemList = item.list || []
            const itemListStyle = item.listStyle
            const itemListPrefix = itemListPrefixes[itemListStyle] || itemListPrefixes.none

            const itemListSerialized = itemList.map(
                subItem => `\n${itemListPrefix}${subItem}`
            ).join('')

            return `${item.description}${itemListSerialized}\n`
        }).join('\n').trim()

        _loggingUtils.stylizedLog(
            body,
            "#999",
            1.2,
            false
        )
    }
}