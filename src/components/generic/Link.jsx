import "./Link.scss"
import React, {useEffect, useState} from 'react'
import {useFeedbacks} from "/src/providers/FeedbacksProvider.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useLocation} from "/src/providers/LocationProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"
import {useScheduler} from "/src/hooks/scheduler.js"

function Link({ id = null, className = "", href, children, tooltip = null, metadata = null, onClick = null, onClickTimeout = 0, onHoverStatus = null, intercept = false }) {
    const feedbacks = useFeedbacks()
    const language = useLanguage()
    const location = useLocation()
    const scheduler = useScheduler()
    const utils = useUtils()

    const hrefClass = !href ?
        `link-no-href` :
        ``

    const _onMouseEnter = (e) => {
        onHoverStatus && onHoverStatus(true)
    }

    const _onMouseLeave = (e) => {
        onHoverStatus && onHoverStatus(false)
    }

    const _onClick = (e) => {
        onClick && onClick()
        if(href.includes('mailto') || href.includes('tel:'))
            return

        e.preventDefault()
        if(intercept)
            return

        if(!onClickTimeout) {
            _open()
            return
        }

        scheduler.clearAllWithTag("link-timeout")
        scheduler.schedule(() => {
            _open()
        }, onClickTimeout, "link-timeout")
    }

    const _open = () => {
        if(href.startsWith("#cat:"))
            location.goToCategoryWithId(href.replaceAll("#cat:", ""))
        else if(href.startsWith("#gallery:open"))
            _openGalleryLink()
        else if(href.startsWith("#"))
            location.goToSectionWithId(href.replaceAll("#", ""))
        else if(href.includes("youtube.com/embed") || href.includes("youtube.com/watch?v="))
            _openYoutubeLink()
        else
            _openExternalLink()
    }

    const _openYoutubeLink = () => {
        feedbacks.displayYoutubeVideo(
            href,
            metadata?.title || language.getString("watch_video"),
            metadata?.description
        )
    }

    const _openGalleryLink = () => {
        if(!metadata || !metadata.images?.length)
            return

        feedbacks.displayGallery(
            metadata.images,
            metadata.aspectRatio || "1:1",
            metadata.title || language.getString("gallery")
        )
    }

    const _openExternalLink = () => {
        const shortenedHref = utils.string.limitTextSize(href, 45)
        const formattedUrl = `<br><span class="text-secondary">« <b>${shortenedHref}</b> »</span><br><br>`
        const text = language.getString("leaving_site").replace("{url}", formattedUrl) +
            language.getString("confirm_to_continue")

        feedbacks.showConfirmationDialog(
            language.getString("open_link"),
            text,
            "fa-solid fa-link",
            () => { window.open(href, "blank") },
            language.getString("proceed"),
            null,
            language.getString("cancel"),
        )
    }

    return (
        <a href={href}
           id={id}
           className={`${className} ${hrefClass}`}
           onClick={_onClick}
           onMouseEnter={_onMouseEnter}
           onMouseLeave={_onMouseLeave}
           data-tooltip={tooltip}
           draggable={false}>
            {children}
        </a>
    )
}

export default Link