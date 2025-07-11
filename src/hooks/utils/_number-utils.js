/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 */

export const _numberUtils = {
    /**
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     * @return {Number} number
     */
    clamp: (number, min, max) => {
        const clamped = Math.max(min, Math.min(max, number))
        return isNaN(clamped) ? max : clamped
    },

    /**
     * @param {Number} number
     * @param {Number} min
     * @param {Number} max
     * @param {Number} [defaultValue]
     * @return {Number} number
     */
    forceIntoBounds: (number, min, max, defaultValue) => {
        const toNumber = Number(number)
        if(number === null || number === undefined || isNaN(toNumber))
            return defaultValue || min

        if(toNumber > max) return defaultValue || max
        else if(toNumber < min) return defaultValue || min
        else return toNumber

    },

    /**
     * @param {Number} number
     * @return {boolean}
     */
    isValidNumber: (number) => {
        return number !== null && number !== undefined && !isNaN(number)
    },

    /**
     * @param {Number} min
     * @param {Number} max
     * @param {Boolean} [flipSign=false]
     * @return {*}
     */
    random: (min, max, flipSign) => {
        const value = Math.floor(Math.random() * (max - min + 1)) + min
        return flipSign && Math.random() < 0.5 ? -value : value
    }
}