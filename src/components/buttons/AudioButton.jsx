import "./AudioButton.scss"
import React, {useEffect, useRef, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"
import HoverStaticTooltip from "/src/components/widgets/HoverStaticTooltip.jsx"

function AudioButton({ url = "", tooltip = "", size = "", buttonClassName = "", tooltipClassName = "" }) {
    const feedbacks = useFeedbacks()
    const utils = useUtils()

    const audioRef = useRef(null)
    const [uniqueId, setUniqueId] = useState(utils.string.generateUniqueRandomString("audio-button-"))
    const [status, setStatus] = useState(AudioButton.Status.NONE)
    const [playCount, setPlayCount] = useState(0)

    const isMagicCursorEnabledAndActive = feedbacks.animatedCursorEnabled && feedbacks.animatedCursorActive
    const shouldShowStaticTooltip = tooltip && !isMagicCursorEnabledAndActive

    const statusIconMap = {
        [AudioButton.Status.LOADING]: "fa-solid fa-spinner pi-spin",
        [AudioButton.Status.PLAYING]: "fa-solid fa-pause",
        [AudioButton.Status.COMPLETED]: "fa-solid fa-volume-high",
    }

    const statusIcon = statusIconMap[status] || "fa-solid fa-volume-high"

    /** @listens url **/
    useEffect(() => {
        _reset()
    }, [url])

    const _onClick = () => {
        if(!url) return

        const closureMap = {
            [AudioButton.Status.NONE]: _loadAudio,
            [AudioButton.Status.PLAYING]: _stopAudio,
            [AudioButton.Status.COMPLETED]: _playAudio,
        }

        const closure = closureMap[status]
        closure && closure()
    }

    const _reset = () => {
        audioRef.current?.pause()
        setStatus(AudioButton.Status.NONE)
        audioRef.current = null
    }

    const _loadAudio = () => {
        setStatus(AudioButton.Status.LOADING)
        const resolvedPath = utils.file.resolvePath(url)
        audioRef.current = new Audio(resolvedPath)
        audioRef.current.addEventListener("loadeddata", () => {
            _playAudio()
        })
        audioRef.current.addEventListener("ended", () => {
            _stopAudio()
        })
        audioRef.current.addEventListener("error", () => {
            _reset()
            utils.log.warn("AudioButton", "Couldn't load audio from URL: " + resolvedPath)
        })
    }

    const _playAudio = () => {
        if(!audioRef.current) return
        setStatus(AudioButton.Status.PLAYING)
        audioRef.current.currentTime = 0
        audioRef.current?.play()
    }

    const _stopAudio = () => {
        if(!audioRef.current) return
        setPlayCount(prevCount => prevCount + 1)
        setStatus(AudioButton.Status.COMPLETED)
        audioRef.current.currentTime = 0
        audioRef.current?.pause()
    }

    return (
        <div className={`audio-button-wrapper ${size}`}>
            {shouldShowStaticTooltip && (
                <HoverStaticTooltip label={tooltip}
                                    className={`audio-button-tooltip text-center ${tooltipClassName}`}
                                    id={uniqueId + "-tooltip"}
                                    forceResetFlag={playCount}
                                    targetId={uniqueId}/>
            )}

            <button className={`audio-button ${buttonClassName}`}
                    id={uniqueId}
                    data-tooltip={tooltip}
                    onClick={_onClick}>
                <i className={statusIcon}/>
            </button>
        </div>
    )
}

AudioButton.Sizes = {
    DEFAULT: "audio-button-wrapper-size-default",
    DYNAMIC_FOR_NAV_TITLE: "audio-button-wrapper-size-dynamic-for-nav-title",
}

AudioButton.Status = {
    NONE: "none",
    LOADING: "loading",
    PLAYING: "playing",
    COMPLETED: "completed",
}

export default AudioButton