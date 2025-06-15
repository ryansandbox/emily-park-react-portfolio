import "./ArticleInlineList.scss"
import React, {useEffect, useState} from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import Link from "/src/components/generic/Link.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleInlineList({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={dataWrapper.uniqueId}
                 type={Article.Types.SPACING_SMALL}
                 dataWrapper={dataWrapper}
                 className={`article-inline-list`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticleInlineListItems dataWrapper={dataWrapper}
                                    selectedItemCategoryId={selectedItemCategoryId}/>
        </Article>
    )
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticleInlineListItems({ dataWrapper, selectedItemCategoryId}) {
    const viewport = useViewport()

    const maxItems = viewport.getValueFromBreakpointHash({
        xxl: 5,
        xl: 4,
        sm: 2,
        default: 2
    })

    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)
    const slicedItems = filteredItems.slice(0, maxItems)

    const displayAsList = viewport.innerWidth < dataWrapper.settings.displayAsListIfWidthIsLowerThan
    const listClass = displayAsList ?
        `article-inline-list-items-column-mode` :
        ``

    return (
        <ul className={`article-inline-list-items ${listClass}`}>
            {slicedItems.map((itemWrapper, key) => (
                <ArticleInlineListItem itemWrapper={itemWrapper}
                                       key={key}/>
            ))}
        </ul>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleInlineListItem({ itemWrapper }) {
    return (
        <li className={`article-inline-list-item text-4`}>
            <Link href={itemWrapper.link?.href || null}
                  tooltip={itemWrapper.link?.tooltip}
                  metadata={itemWrapper.link?.metadata}>
                <i className={`article-inline-list-item-icon ${itemWrapper.faIconWithFallback}`}
                   style={itemWrapper.faIconStyle}/>

                <span className={`article-inline-list-item-label`}
                      dangerouslySetInnerHTML={{__html: itemWrapper.locales.label || itemWrapper.label || itemWrapper.placeholder}}/>
            </Link>
        </li>
    )
}

export default ArticleInlineList