import "./CopyButton.scss"
import React, {useEffect, useState} from "react"
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useScheduler} from "/src/hooks/scheduler.js"
import {useUtils} from "/src/hooks/utils.js"
import HoverStaticTooltip from "/src/components/widgets/HoverStaticTooltip.jsx"

function CopyButton({ text = "", buttonClassName = "" }) {
    const viewport = useViewport()
    const language = useLanguage()
    const scheduler = useScheduler()
    const utils = useUtils()

    const [didCopy, setDidCopy] = useState(false)
    const [forceReset, setForceReset] = useState(0)
    const [uniqueId, setUniqueId] = useState(utils.string.generateUniqueRandomString("audio-button-"))

    const isTouchScreen = utils.device.isTouchDevice()
    const tooltipText = language.getString(didCopy ? "copied_to_clipboard" : "copy_to_clipboard")
    const faIcon = didCopy ? "fa-solid fa-check" : "fa-solid fa-copy"
    const isCopiedToClipboard = viewport.isCopiedToClipboard(text)

    useEffect(() => {
        if(!isCopiedToClipboard && didCopy) {
            setDidCopy(false)
            if(isTouchScreen) setForceReset(prev => prev + 1)
        }
    }, [isCopiedToClipboard])

    const _onClick = async () => {
        await viewport.copyToClipboard(text)
        setDidCopy(true)

        const tag = "copy-button-" + text
        scheduler.clearAllWithTag(tag)
        scheduler.schedule(() => {
            setDidCopy(false)
            if(isTouchScreen) setForceReset(prev => prev + 1)
        }, 1000, tag)
    }

    return (
        <div className={`copy-button-wrapper ${buttonClassName}`}>
            <HoverStaticTooltip label={tooltipText}
                                className={`copy-button-tooltip text-center text-4`}
                                id={uniqueId + "-tooltip"}
                                forceResetFlag={forceReset}
                                forceVisible={didCopy}
                                targetId={uniqueId}/>

            <button className={`copy-button`}
                    id={uniqueId}
                    onClick={_onClick}>
                <i className={`${faIcon}`}/>
            </button>
        </div>
    )
}

export default CopyButton