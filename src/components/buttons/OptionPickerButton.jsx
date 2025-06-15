import "./OptionPickerButton.scss"
import React, {useEffect, useState} from 'react'
import {Dropdown} from "react-bootstrap"

function OptionPickerButton({ mode, options, selectedOptionId, onOptionSelected, tooltipLabel, showSelectedOptionOnDropdown = false }) {
    const defaultOption = {
        id: "default",
        faIcon: "fa-solid fa-circle"
    }

    const selectedOption = options.find(option => option.id === selectedOptionId)
        || defaultOption

    const availableOptions = options.filter(option =>
        showSelectedOptionOnDropdown ||
        option.id !== selectedOption.id
    )

    const buttonBehaviorEnabled = mode === OptionPickerButton.Modes.MODE_BUTTON ||
        (mode === OptionPickerButton.Modes.MODE_AUTO && options.length <= 2)

    const caretIcon = !buttonBehaviorEnabled && selectedOption.img ?
        `fa-solid fa-caret-down` :
        null

    const _onToggleClicked = () => {
        if(!buttonBehaviorEnabled)
            return

        const optionIndex = options.indexOf(selectedOption)
        const targetIndex = optionIndex < options.length - 1 ?
            optionIndex + 1 :
            0

        onOptionSelected(options[targetIndex]?.id)
    }

    const _onDropdownOptionClicked = (option) => {
        if(!option || !option.id)
            return
        onOptionSelected(option.id)
    }

    return (
        <div className={`btn-option-picker`}>
            <Dropdown>
                <OptionPickerButtonToggle option={selectedOption}
                                          caretIcon={caretIcon}
                                          onClick={_onToggleClicked}
                                          tooltipLabel={tooltipLabel}/>

                {!buttonBehaviorEnabled && (
                    <OptionPickerButtonMenu availableOptions={availableOptions}
                                            selectedOptionId={selectedOptionId}
                                            onClick={_onDropdownOptionClicked}/>
                )}
            </Dropdown>
        </div>
    )
}

function OptionPickerButtonToggle({ option, caretIcon, onClick, tooltipLabel }) {
    return (
        <Dropdown.Toggle variant={`transparent`}
                         className={`btn-option-picker-toggle`}
                         onClickCapture={onClick}
                         data-tooltip={tooltipLabel}>
            <OptionPickerButtonPickerIcon   option={option}
                                            size={2}/>

            {caretIcon && (
                <i className={`fa-caret-icon ${caretIcon}`}/>
            )}
        </Dropdown.Toggle>
    )
}

function OptionPickerButtonMenu({ availableOptions, selectedOptionId, onClick }) {
    const hasSelectedOption = availableOptions.some(option => option.id === selectedOptionId)
    const borderClass = hasSelectedOption ? 'dropdown-item-no-border' : ''

    return (
        <Dropdown.Menu>
            {availableOptions.map((option, key) => (
                <Dropdown.Item key={key}
                               className={`btn-option-picker-menu-item ${borderClass} ${option.id === selectedOptionId ? 'btn-option-picker-menu-item-selected' : ''}`}
                               onClick={() => { onClick(option) }}>
                    <OptionPickerButtonPickerIcon   option={option}
                                                    size={1}/>

                    <span className={`btn-option-picker-menu-item-label`}>
                        {option.label}
                    </span>
                </Dropdown.Item>
            ))}
        </Dropdown.Menu>
    )
}

function OptionPickerButtonPickerIcon({ option, size }) {
    const sizeClass = `btn-option-picker-icon-size-${size}`
    const willRenderImage = option.img
    const willRenderFaIcon = !willRenderImage

    return (
        <div className={`btn-option-picker-icon ${sizeClass}`}>
            {willRenderImage && (
                <img src={option.img}
                     alt={option.label}
                     className={`img`}/>
            )}

            {willRenderFaIcon && (
                <i className={`fa-icon ${option.faIcon}`}/>
            )}
        </div>
    )
}

OptionPickerButton.Modes = {
    MODE_AUTO: "mode_auto",
    MODE_BUTTON: "mode_button",
    MODE_DROPDOWN: "mode_dropdown"
}

export default OptionPickerButton