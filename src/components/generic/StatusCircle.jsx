import "./StatusCircle.scss"
import React, {useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import HoverStaticTooltip from "/src/components/widgets/HoverStaticTooltip.jsx"

function StatusCircle({ variant, message, size = "status-circle-size-default", className = "", onClick = null }) {
    const utils = useUtils()
    const [uniqueId, setUniqueId] = useState(utils.string.generateUniqueRandomString("status-circle-"))

    return (
        <div className={`status-circle ${className} ${size} status-circle-variant-${variant}`}
             id={uniqueId}>
            <HoverStaticTooltip label={message}
                                className={`status-circle-tooltip text-center`}
                                id={uniqueId + "-tooltip"}
                                targetId={uniqueId}
                                onDesktopClick={onClick}
                                toggleBehaviorOnTouchScreens={true}/>

            <div className={`status-circle-pulse`}/>
            <div className={`status-circle-body`}/>
        </div>
    )
}

StatusCircle.Sizes = {
    SMALL: "status-circle-size-small",
    DEFAULT: "status-circle-size-default"
}

export default StatusCircle