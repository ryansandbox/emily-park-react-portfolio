import React, {useEffect, useState} from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import OptionPickerButton from "/src/components/buttons/OptionPickerButton.jsx"
import {useTheme} from "/src/providers/ThemeProvider.jsx"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"
import {useData} from "/src/providers/DataProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"

function NavToolSettings({ options }) {
    const theme = useTheme()
    const feedbacks = useFeedbacks()
    const language = useLanguage()
    const data = useData()
    const utils = useUtils()

    const displayOptions = [{
        id: "options",
        faIcon: "fa-solid fa-cog",
        label: language.getString("options")
    }]

    if(options.includes(NavToolSettings.Options.THEME)) {
        const selectedTheme = theme.getSelectedTheme()

        displayOptions.push({
            id: NavToolSettings.Options.THEME,
            faIcon: selectedTheme.icon,
            label: language.getString("change_theme")
        })
    }

    if(options.includes(NavToolSettings.Options.CURSOR)) {
        const isEnabledAndActive = feedbacks.animatedCursorEnabled && feedbacks.animatedCursorActive

        displayOptions.push({
            id: NavToolSettings.Options.CURSOR,
            faIcon: isEnabledAndActive ? "fa-solid fa-wand-magic-sparkles" : "fa-solid fa-wand-magic",
            label: language.getString(isEnabledAndActive ? "deactivate_magic_cursor" : "activate_magic_cursor")
        })
    }

    if(options.includes(NavToolSettings.Options.DOWNLOAD_RESUME)) {
        displayOptions.push({
            id: NavToolSettings.Options.DOWNLOAD_RESUME,
            faIcon: "fa-solid fa-file-arrow-down",
            label: language.getString("download_resume")
        })
    }

    const _onOptionClicked = (optionId) => {
        switch (optionId) {
            case NavToolSettings.Options.THEME:
                theme.toggle()
                break

            case NavToolSettings.Options.CURSOR:
                feedbacks.toggleAnimatedCursorActive(true)
                break

            case NavToolSettings.Options.DOWNLOAD_RESUME:
                const profile = data.getProfile()
                const resumeUrl = profile.resumePdfUrl
                utils.file.download(resumeUrl)
                break
        }
    }

    return (
        <OptionPickerButton mode={OptionPickerButton.Modes.MODE_DROPDOWN}
                            options={displayOptions}
                            selectedOptionId={"options"}
                            onOptionSelected={_onOptionClicked}
                            tooltipLabel={displayOptions[0].label}/>
    )
}

NavToolSettings.Options = {
    CURSOR: "cursor",
    DOWNLOAD_RESUME: "download_resume",
    THEME: "theme"
}

export default NavToolSettings