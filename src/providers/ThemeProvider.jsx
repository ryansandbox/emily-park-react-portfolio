/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 * @description This provider handles the theme management for the application, allowing users to switch between different themes.
 */

import React, {createContext, useContext, useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import ActivitySpinner from "/src/components/loaders/ActivitySpinner.jsx"

function ThemeProvider({ children, supportedThemes, defaultThemeId, showSpinnerOnThemeChange, onThemeChanged }) {
    const utils = useUtils()

    const allThemes = Array.isArray(supportedThemes) && supportedThemes.length > 0 ?
        supportedThemes :
        []

    const defaultTheme = allThemes.find(theme => theme.id === defaultThemeId)
        || allThemes[0]

    const supportsMultipleThemes = allThemes.length >= 2

    const [spinnerActivities, setSpinnerActivities] = useState([])
    const [selectedThemeId, setSelectedThemeId] = useState(null)

    /** @constructs **/
    useEffect(() => {
        if(allThemes.length === 0) {
            utils.log.throwError("ThemeProvider", "The app must support at least one theme. Make sure you filled the supportedThemes property in the settings.json file.")
            return
        }

        const savedThemeId = utils.storage.getPreferredTheme()
        const savedTheme = allThemes.find(theme => theme.id === savedThemeId)
        setSelectedTheme(savedTheme || defaultTheme)
    }, [])

    const getSelectedTheme = () => {
        return allThemes.find(theme => theme.id === selectedThemeId)
    }

    const setSelectedTheme = (theme) => {
        const _apply = () => {
            document.documentElement.setAttribute('data-theme', theme.id)
            onThemeChanged(theme.id)
        }

        setSelectedThemeId(theme.id)
        utils.storage.setPreferredTheme(theme.id)
        if(!showSpinnerOnThemeChange || !selectedThemeId) {
            _apply()
            return
        }

        setSpinnerActivities([{id: "theme-change"}])
        setTimeout(() => { _apply() }, 30)
        setTimeout(() => { setSpinnerActivities([]) }, 300)
    }

    const getAvailableThemes = (excludeSelected) => {
        if(!allThemes)
            return []

        if(!excludeSelected)
            return allThemes
        return allThemes.filter(theme => theme.id !== selectedThemeId)
    }

    const toggle = () => {
        const selectedTheme = getSelectedTheme()
        const currentIndex = allThemes.indexOf(selectedTheme)
        const targetIndex = currentIndex + 1

        const targetTheme = targetIndex >= allThemes.length ?
            allThemes[0] :
            allThemes[targetIndex]

        setSelectedTheme(targetTheme)
    }

    return (
        <ThemeContext.Provider value={{
            setSelectedTheme,
            getSelectedTheme,
            supportsMultipleThemes,
            getAvailableThemes,
            toggle
        }}>
            <ActivitySpinner activities={spinnerActivities}
                             defaultMessage={null}/>

            {selectedThemeId && (
                <>{children}</>
            )}
        </ThemeContext.Provider>
    )
}

const ThemeContext = createContext(null)
/**
 * @return {{
 *   setSelectedTheme: Function,
 *   getSelectedTheme: Function,
 *   supportsMultipleThemes: Boolean,
 *   getAvailableThemes: Function,
 *   toggle: Function
 * }}
 */
export const useTheme = () => useContext(ThemeContext)

export default ThemeProvider