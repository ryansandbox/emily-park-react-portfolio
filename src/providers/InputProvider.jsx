/**
 * @author Ryan Balieiro
 * @date 2025-05-10
 * @description This provider is responsible for managing user input events such as keyboard and mouse interactions.
 */

import React, {createContext, useContext, useEffect, useState} from 'react'
import {useUtils} from "/src/hooks/utils.js"
import {useScheduler} from "/src/hooks/scheduler.js"

function InputProvider({ children }) {
    const utils = useUtils()
    const scheduler = useScheduler()

    const tag = "input-provider"

    const [lastKeyPressed, setLastKeyPressed] = useState({id: null, count: -1})

    const [mouseDownStatus, setMouseDownStatus] = useState({clientX: null, clientY: null, count: -1})
    const [mouseMoveStatus, setMouseMoveStatus] = useState({clientX: null, clientY: null, count: -1})
    const [mouseUpStatus, setMouseUpStatus] = useState({clientX: null, clientY: null, count: -1})
    const [isClicked, setIsClicked] = useState(false)
    const [lastMouseTarget, setLastMouseTarget] = useState(null)

    const [didCreateListeners, setDidCreateListeners] = useState(false)

    useEffect(() => {
        _createListeners()
        return () => _destroyListeners()
    }, [])

    const _createListeners = () => {
        window.addEventListener('keydown', _onKeyDown)
        window.addEventListener("mousedown", _onMouseDown)
        window.addEventListener("mousemove", _onMouseMove)
        window.addEventListener("mouseup", _onMouseUp)
        setDidCreateListeners(true)
    }

    const _destroyListeners = () => {
        window.removeEventListener('keydown', _onKeyDown)
        window.removeEventListener("mousedown", _onMouseDown)
        window.removeEventListener("mousemove", _onMouseMove)
        window.removeEventListener("mouseup", _onMouseUp)

        scheduler.clearAllWithTag(tag)
        setDidCreateListeners(false)
    }

    const _onKeyDown = (event) => {
        window.__keyPressCount = window.__keyPressCount || 0
        window.__keyPressCount++

        setLastKeyPressed({
            id: event.key,
            count: window.__keyPressCount
        })
    }

    const _onMouseDown = (e) => {
        if (e.button !== 0) return

        setIsClicked(true)
        setMouseDownStatus(_generateMouseEventBundle(e))
        setLastMouseTarget(e.target)
    }

    const _onMouseMove = (e) => {
        setMouseMoveStatus(_generateMouseEventBundle(e))
        setLastMouseTarget(e.target)
    }

    const _onMouseUp = (e) => {
        setIsClicked(false)
        setMouseUpStatus(_generateMouseEventBundle(e))
        setLastMouseTarget(e.target)

        scheduler.clearAllWithTag("input-collision-check")
        scheduler.schedule(() => {
            const shouldReset = !utils.dom.isInsideElement(e.target, e.clientX, e.clientY)
            if(shouldReset) {
                setLastMouseTarget(null)
            }
        }, 120, "input-collision-check")
    }

    const _generateMouseEventBundle = (e) => {
        window.lastMouseEventTarget = e.target
        window.__mouseEventCount = window.__mouseEventCount || 0
        window.__mouseEventCount++

        return {
            clientX: e.clientX,
            clientY: e.clientY,
            count: window.__mouseEventCount
        }
    }

    return (
        <InputContext.Provider value={{
            lastKeyPressed,

            lastMouseTarget,
            mouseDownStatus,
            mouseMoveStatus,
            mouseUpStatus,
            isClicked,
        }}>
            {didCreateListeners && (
                <>{children}</>
            )}
        </InputContext.Provider>
    )
}

const InputContext = createContext(null)

/**
 * @return {{
 *    lastKeyPressed: {id: String, count: Number},
 *
 *    lastMouseTarget: Element,
 *    mouseDownStatus: {clientX: Number, clientY: Number},
 *    mouseMoveStatus: {clientX: Number, clientY: Number},
 *    mouseUpStatus: {clientX: Number, clientY: Number},
 *    isClicked: {Boolean}
 * }}
 */
export const useInput = () => useContext(InputContext)

export default InputProvider