import "./Layout.scss"
import React, {useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import LayoutAnimatedBackground from "/src/components/layout/LayoutAnimatedBackground.jsx"
import LayoutStaticBackground from "/src/components/layout/LayoutStaticBackground.jsx"

function Layout({ id, children, backgroundStyle }) {
    const utils = useUtils()

    const isAnimatedBackground = backgroundStyle === "animated"
    const isStaticBackground = backgroundStyle === "static"
    const isPlainBackground = backgroundStyle === "plain"

    if(!isAnimatedBackground && !isStaticBackground && !isPlainBackground) {
        utils.log.warn(
            "Layout",
            "Invalid backgroundStyle provided on settings.json. The supported values are 'animated', 'static' and 'plain'. Defaulting to 'plain'."
        )
    }

    return (
        <div id={id}
             className={`layout`}>

            {isAnimatedBackground && <LayoutAnimatedBackground/>}
            {isStaticBackground && <LayoutStaticBackground/>}

            <div className={`layout-content`}>
                {children}
            </div>
        </div>
    )
}

export default Layout