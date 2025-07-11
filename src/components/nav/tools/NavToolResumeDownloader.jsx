import React, {useEffect, useState} from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"
import OptionPickerButton from "/src/components/buttons/OptionPickerButton.jsx"
import {useData} from "/src/providers/DataProvider.jsx"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"

function NavToolResumeDownloader() {
    const language = useLanguage()
    const utils = useUtils()
    const data = useData()
    const feedbacks = useFeedbacks()

    const profile = data.getProfile()
    const resumeUrl = profile.resumePdfUrl
    const id = "download_resume"
    const tooltip = language.getString("download_resume")

    const options = [{
        id: id,
        faIcon: "fa-solid fa-file-arrow-down",
        label: tooltip
    }]

    const _onClick = () => {
        if(!resumeUrl) {
            feedbacks.displayNotification(
                language.getString("error"),
                language.getString("error_file_not_found"),
                "error"
            )
            return
        }

        utils.file.download(resumeUrl)
    }

    return (
        <OptionPickerButton mode={OptionPickerButton.Modes.MODE_BUTTON}
                            options={options}
                            selectedOptionId={id}
                            onOptionSelected={_onClick}
                            tooltipLabel={tooltip}/>
    )
}

export default NavToolResumeDownloader