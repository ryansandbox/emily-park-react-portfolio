/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 */

export const _validationUtils = {
    /**
     * @param {String} message
     * @return {boolean}
     */
    isSpam: (message) => {
        const matches = message.match(/[a-z]/gi)
        // Skip verification if the message isn't essentially written with English letters...
        if(!matches || !matches.length || matches.length/message.length < 0.5)
            return false

        // Heuristic 1: Check if the message is too short or has too few spaces
        if (message.length < 10 || (message.match(/\s/g) || []).length < 1)
            return true

        // Heuristic 2: Proportion of letters should be at least 50%
        const letterMatches = message.match(/[a-zA-Z]/g)
        const letterRatio = (letterMatches ? letterMatches.length : 0) / message.length
        if (letterRatio < 0.5)
            return true

        // Heuristic 3: Low vowel/consonant ratio might suggest gibberish
        const vowelMatches = message.match(/[aeiou]/gi)
        const vowelRatio = (vowelMatches ? vowelMatches.length : 0) / (letterMatches ? letterMatches.length : 1)
        if (vowelRatio < 0.25)
            return true

        // Heuristic 4: Require at least 2 unique vowels
        const uniqueVowels = new Set(vowelMatches?.map(v => v.toLowerCase()))
        if (uniqueVowels.size < 2)
            return true

        return false
    },

    /**
     * @param {String} string
     * @param {Number} words
     * @return {boolean}
     */
    isLongerThan: (string, words) => {
        const wordCount = string.trim().split(/\s+/).length
        return wordCount > words
    },

    /**
     * @param {String} string
     * @return {boolean}
     */
    validateEmail: (string) => {
        return Boolean(String(string)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ))
    }
}