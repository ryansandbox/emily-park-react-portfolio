import "./ArticleInfoList.scss"
import React, {useEffect, useState} from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import AvatarView from "/src/components/generic/AvatarView.jsx"
import Link from "/src/components/generic/Link.jsx"
import {useViewport} from "/src/providers/ViewportProvider.jsx"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleInfoList({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={dataWrapper.uniqueId}
                 type={Article.Types.SPACING_DEFAULT}
                 dataWrapper={dataWrapper}
                 className={`article-info-list`}
                 selectedItemCategoryId={selectedItemCategoryId}
                 setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticleInfoListItems dataWrapper={dataWrapper}
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
function ArticleInfoListItems({ dataWrapper, selectedItemCategoryId }) {
    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)

    const id = dataWrapper.uniqueId
    const shrinkClass = filteredItems.find(itemWrapper => itemWrapper.locales.text) ?
        `` :
        `article-info-list-items-shrink`

    const viewport = useViewport()

    useEffect(() => {
        const itemDivs = document.getElementById(id).querySelectorAll(`.article-info-list-item`)

        itemDivs.forEach(div => {
            div.style.height = 'auto'
            div.style.minHeight = '0px'
        })

        let maxHeight = 0
        itemDivs.forEach(div => {
            const height = div.offsetHeight
            if (height > maxHeight) maxHeight = height
        })

        if(maxHeight < 120) {
            itemDivs.forEach(div => {
                div.style.minHeight = `${maxHeight}px`
            })
        }
    }, [dataWrapper?.id, viewport.innerWidth])

    return (
        <div className={`article-info-list-items ${shrinkClass}`}
             id={id}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleInfoListItem itemWrapper={itemWrapper}
                                     key={key}/>
            ))}
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleInfoListItem({ itemWrapper}) {
    const [linkHovered, setLinkHovered] = useState(false)

    const hoverClass = linkHovered ?
        `article-info-list-item-hovered` :
        ``

    const baseTextSize = itemWrapper.locales.text ? 3 : 4
    const titleClass = `text-${baseTextSize + 1}`
    const textClass = `text-${baseTextSize}`

    return (
        <div className={`article-info-list-item ${hoverClass}`}>
            <AvatarView src={itemWrapper.img}
                        faIcon={itemWrapper.faIconWithFallback}
                        style={itemWrapper.faIconStyle}
                        alt={itemWrapper.imageAlt}
                        className={`article-info-list-item-avatar`}/>

            <div className={`article-info-list-item-content`}>
                <div className={`article-info-list-item-info-title ${titleClass}`}
                     dangerouslySetInnerHTML={{__html: itemWrapper.locales.title || itemWrapper.placeholder}}/>

                <p className={`article-info-list-item-info-text ${textClass}`}
                   dangerouslySetInnerHTML={{__html: itemWrapper.locales.text}}/>

                {itemWrapper.link?.href && (
                    <Link href={itemWrapper.link?.href || null}
                          tooltip={itemWrapper.link?.tooltip}
                          metadata={itemWrapper.link?.metadata}
                          className={`${textClass} text-3 article-info-list-item-info-link`}
                          onHoverStatus={setLinkHovered}>
                            <span className={`article-inline-list-item-label`}
                                  dangerouslySetInnerHTML={{__html: itemWrapper.locales.label || itemWrapper.label || itemWrapper.locales.title}}/>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default ArticleInfoList