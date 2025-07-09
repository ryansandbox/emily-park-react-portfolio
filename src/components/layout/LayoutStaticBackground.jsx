import "./LayoutStaticBackground.scss"
import React, {useEffect, useState} from 'react'

function LayoutStaticBackground() {
    return (
        <div className={`layout-static-background`}>
            <div className={`layout-static-background-shards-container`}>
                {Array.from({ length: 10 }, (_, index) => (
                    <div key={index}
                         className={`layout-static-background-shard layout-static-background-shard-obj-${index + 1}`}/>
                ))}
            </div>
        </div>
    )
}

export default LayoutStaticBackground