import React, {useEffect, useState} from 'react'
import {useScheduler} from "/src/hooks/scheduler.js"
import {useConstants} from "/src/hooks/constants.js"
import {useNavigation} from "/src/providers/NavigationProvider.jsx"

function Nav({ links, itemComponent, id = null, className = "", tag, data = {} }) {
    const scheduler = useScheduler()
    const constants = useConstants()
    const navigation = useNavigation()

    const [clickedLink, setClickedLink] = useState(null)

    const _isActive = (link) => {
        const isClickedLinkAvailable = links.find(link => link.id === clickedLink?.id)
        if(clickedLink && isClickedLinkAvailable)
            return clickedLink.id === link.id
        return link.active
    }

    const _onLinkClicked = (link) => {
        setClickedLink(link)

        const changeTag = "nav-change-" + tag
        scheduler.clearAllWithTag(changeTag)
        navigation.navigateToSectionWithLink(link.href)

        scheduler.schedule(() => {
            setClickedLink(null)
        }, constants.SECTION_TRANSITION_TOTAL_TIME + 400, changeTag)
    }

    return (
        <nav className={`nav-base ${className}`}
             id={id}>
            {links.map((link, key) => {
                const Component = itemComponent
                return (
                    <Component key={key}
                               link={link}
                               active={_isActive(link)}
                               data={data}
                               onClick={() => { _onLinkClicked(link) }}/>
                )
            })}
        </nav>
    )
}

export default Nav