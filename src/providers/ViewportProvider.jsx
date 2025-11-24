/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 * @description This provider tracks the viewport size and scroll position, and provides utility functions to manage breakpoints and layout constraints.
 */

import React, {createContext, useContext, useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import {useScheduler} from "/src/hooks/scheduler.js"
import {useData} from "/src/providers/DataProvider.jsx"

function ViewportProvider({ children }) {
    const data = useData()
    const utils = useUtils()
    const scheduler = useScheduler()

    const bootstrapBreakpoints = utils.css.BREAKPOINTS
    const tag = "viewport-provider"

    const [scrollX, setScrollX] = useState(0)
    const [scrollY, setScrollY] = useState(0)
    const [innerWidth, setInnerWidth] = useState(window.innerWidth)
    const [innerHeight, setInnerHeight] = useState(window.innerHeight)
    const [didCreateListeners, setDidCreateListeners] = useState(false)
    const [clipboardText, setClipboardText] = useState(null)

    useEffect(() => {
        _createListeners()
        if(utils.device.isTouchDevice() && utils.device.isAndroid())
             document.body.classList.add("body-android")

        return () => _destroyListeners()
    }, [])

    const _createListeners = () => {
        window.addEventListener('scroll', _onScroll)
        window.addEventListener('resize', _onResize)

        _onScroll()
        _onResize()
        setDidCreateListeners(true)
    }

    const _destroyListeners = () => {
        window.removeEventListener('scroll', _onScroll)
        window.removeEventListener('resize', _onResize)

        scheduler.clearAllWithTag(tag)
        setDidCreateListeners(false)
    }

    const _onScroll = () => {
        setScrollX(window.scrollX)
        setScrollY(window.scrollY)
    }

    const _onResize = () => {
        setInnerWidth(window.innerWidth)
        setInnerHeight(window.innerHeight)
    }

    const isBreakpoint = (breakpoint) => {
        return innerWidth >= bootstrapBreakpoints[breakpoint]
    }

    const getBreakpoint = () => {
        const width = innerWidth
        if (width < bootstrapBreakpoints.sm) return 'xs'
        if (width < bootstrapBreakpoints.md) return 'sm'
        if (width < bootstrapBreakpoints.lg) return 'md'
        if (width < bootstrapBreakpoints.xl) return 'lg'
        if (width < bootstrapBreakpoints.xxl) return 'xl'
        return 'xxl'
    }

    const isMobileLayout = () => {
        const mobileBreakpoint = utils.css.getRootSCSSVariable("--max-breakpoint-for-tabbed-interface")
        return !isBreakpoint(mobileBreakpoint)
    }

    const isDesktopLayout = () => {
        return !isMobileLayout()
    }

    const getValueFromBreakpointHash = (hash) => {
        for(let i in hash)
            if(isBreakpoint(i)) return hash[i]
        return hash['default']
    }

    const getCustomBreakpoint = (breakpointHash) => {
        const matchedKey = Object.keys(breakpointHash)
            .map(Number)
            .filter(bp => innerWidth >= bp)
            .sort((a, b) => b - a)[0]
        return breakpointHash[matchedKey] || null
    }

    const getLayoutConstraints = () => {
        return {
            canToggleFullscreen: data.getSettings().templateSettings.fullscreenEnabled && !isMobileLayout() && !utils.device.isIOS() && !utils.device.isSafari(),
            shouldAddFooterOffset: utils.device.isIOS() && utils.device.isChrome()
        }
    }

    const copyToClipboard = async (text) => {
        if(isCopiedToClipboard(text))
            return

        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            window.lastCopiedToClipboardText = text
            setClipboardText(text)
            return
        }

        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "absolute"
        textArea.style.visibility = "hidden"
        document.body.append(textArea)
        textArea.select()

        try {
            document.execCommand('copy')
            window.lastCopiedToClipboardText = text
            setClipboardText(text)
        }
        catch (error) {}
        finally {
            textArea.remove()
        }
    }

    const isCopiedToClipboard = (text) => {
        return clipboardText === text
    }

    return (
        <ViewportContext.Provider value={{
            scrollX,
            scrollY,
            innerWidth,
            innerHeight,

            isBreakpoint,
            getBreakpoint,
            isMobileLayout,
            isDesktopLayout,
            getValueFromBreakpointHash,
            getLayoutConstraints,
            getCustomBreakpoint,
            copyToClipboard,
            isCopiedToClipboard
        }}>
            {didCreateListeners && (
                <>{children}</>
            )}
        </ViewportContext.Provider>
    )
}

const ViewportContext = createContext(null)

/**
 * @return {{
 *    scrollX: Number,
 *    scrollY: Number,
 *    innerWidth: Number,
 *    innerHeight: Number,
 *
 *    isBreakpoint: Function,
 *    getBreakpoint: Function,
 *    isMobileLayout: Function,
 *    isDesktopLayout: Function,
 *    getValueFromBreakpointHash: Function,
 *    getLayoutConstraints: Function,
 *    getCustomBreakpoint: Function,
 *    copyToClipboard: Function,
 *    isCopiedToClipboard: Function
 * }}
 */
export const useViewport = () => useContext(ViewportContext)

export default ViewportProvider