import React, {useEffect, useState} from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useTheme} from "/src/providers/ThemeProvider.jsx"
import OptionPickerButton from "/src/components/buttons/OptionPickerButton.jsx"

function NavToolThemePicker() {
    const theme = useTheme()
    const language = useLanguage()

    const supportsMultipleThemes = theme.supportsMultipleThemes
    const availableThemes = theme.getAvailableThemes(false)
    const selectedTheme = theme.getSelectedTheme()
    const tooltipLabel = selectedTheme ?
        language.getTranslation(selectedTheme.locales, "name") :
        null

    const options = availableThemes.map(theme => {
        return {
            id: theme.id,
            label: language.getTranslation(theme.locales, "name"),
            faIcon: theme.icon
        }
    })

    const _onOptionSelected = (optionId) => {
        const targetTheme = availableThemes.find(theme => theme.id === optionId)
        if(targetTheme) {
            theme.setSelectedTheme(targetTheme)
        }
    }

    return (
        <>
            {supportsMultipleThemes && (
                <OptionPickerButton mode={OptionPickerButton.Modes.MODE_AUTO}
                                    options={options}
                                    selectedOptionId={selectedTheme?.id}
                                    onOptionSelected={_onOptionSelected}
                                    tooltipLabel={tooltipLabel}
                                    showSelectedOptionOnDropdown={true}/>
            )}
        </>
    )
}

export default NavToolThemePicker