import "./CategoryFilter.scss"
import React, {useEffect, useState} from 'react'
import {useLanguage} from "/src/providers/LanguageProvider.jsx"
import {useUtils} from "/src/hooks/utils.js"

function CategoryFilter({ categories, selectedCategoryId, setSelectedCategoryId, className = "" }) {
    const utils = useUtils()

    const [lastCategorySelectTime, setLastCategorySelectTime] = useState(0)

    let minButtonWidthPercentage = categories && categories.length ?
        Math.floor(100 / categories.length)
        : 0

    const hasCategoryWithLongLabel = categories.find(category => category.label && category.label.length >= 8)
    if(hasCategoryWithLongLabel)
        minButtonWidthPercentage *= 0.9

    const hoverClass = utils.device.isTouchDevice() ?
        `category-filter-no-hover-effects` :
        ``

    const _select = (categoryId) => {
        const now = Date.now()
        if (!categoryId || now - lastCategorySelectTime < 50) {
            return
        }

        setLastCategorySelectTime(now)
        setSelectedCategoryId(categoryId)
    }

    return (
        <div className={`category-filter ${className}`}>
            {categories.map((category, key) => (
                <CategoryFilterButton key={key}
                                      category={category}
                                      className={hoverClass}
                                      minButtonWidthPercentage={minButtonWidthPercentage}
                                      onClick={() => _select(category.id)}
                                      isSelected={category?.id === selectedCategoryId}/>
            ))}
        </div>
    )
}

function CategoryFilterButton({ category, minButtonWidthPercentage, isSelected, onClick, className = "" }) {
    const language = useLanguage()

    const selectedClassName = isSelected ?
        `category-filter-button-selected` : ``

    const tooltip = language.getString("filter_by").replace("{x}", category.label)

    return (
        <button type={"button"}
                className={`category-filter-button ${className} ${selectedClassName} btn text-2`}
                style={{minWidth: `${minButtonWidthPercentage}%`}}
                onMouseDown={onClick}
                onTouchStart={onClick}
                data-tooltip={tooltip}>
            <span className={`category-filter-button-label`}>{category.label}</span>
            <span className={`category-filter-button-count`}>({category.count})</span>
        </button>
    )
}

export default CategoryFilter