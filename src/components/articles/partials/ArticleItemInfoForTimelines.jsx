import "./ArticleItemInfoForTimelines.scss"
import React, {useEffect, useState} from 'react'
import {useViewport} from "/src/providers/ViewportProvider.jsx"
import DateBadge from "/src/components/widgets/DateBadge.jsx"
import {PropList, PropListItem} from "/src/components/generic/PropList.jsx"
import {Tags, Tag} from "/src/components/generic/Tags.jsx"
import ArticleItemPreviewMenu from "/src/components/articles/partials/ArticleItemPreviewMenu.jsx"
import {useLanguage} from "/src/providers/LanguageProvider.jsx"

/**
 * @param {*} children
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {String} className
 * @param {Boolean} smallDateBadge
 * @return {JSX.Element}
 * @constructor
 */
function ArticleItemInfoForTimelines({ children, itemWrapper, className = "", smallDateBadge = false }) {
    const dateBadgeClass = smallDateBadge ?
        `article-timeline-item-info-for-timelines-date-badge-small` :
        ``

    return (
        <div className={`article-timeline-item-info-for-timelines ${className} ${dateBadgeClass}`}>
            {children}
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {String} className
 * @param {Boolean} dateInterval
 * @return {JSX.Element}
 * @constructor
 */
function ArticleItemInfoForTimelinesHeader({ itemWrapper, className = "", dateInterval = false }) {
    const viewport = useViewport()
    const shouldShowDateBadge = viewport.isBreakpoint("xl")
    const isSmallScreen =  !viewport.isBreakpoint("sm")

    const institution = itemWrapper.locales.institution

    const location = isSmallScreen && institution ?
        itemWrapper.shortLocation :
        itemWrapper.fullLocation

    const propListItems = []

    // Case 1 - The date is being displayed as a badge (no need to display it here).
    if (shouldShowDateBadge) {
        if(institution) {
            propListItems.push({
                faIcon: `fa-regular fa-building`,
                type: PropListItem.Types.SINGLE,
                value: [institution]
            })
        }

        if(location) {
            propListItems.push({
                faIcon: `fa-regular fa-font-awesome`,
                type: PropListItem.Types.SINGLE,
                value: [location]
            })
        }
    }

    // Case 2 - Must display date inside the prop list.
    else {
        propListItems.push({
            faIcon: `fa-regular fa-clock`,
            type: dateInterval ? PropListItem.Types.INTERVAL : PropListItem.Types.SINGLE,
            value: dateInterval ? [itemWrapper.dateStartDisplay, itemWrapper.dateEndDisplay] : [itemWrapper.dateStartDisplay]
        })

        if(institution || location) {
            propListItems.push({
                faIcon: `fa-regular fa-building`,
                type: institution && location ? PropListItem.Types.DUO : PropListItem.Types.SINGLE,
                value: institution && location ? [institution, location] : [institution || location]
            })
        }
    }

    return (
        <div className={`article-timeline-item-info-for-timelines-header ${className}`}>
            <div className={`article-timeline-item-info-for-timelines-header-title`}>
                <h5 className={``}
                    dangerouslySetInnerHTML={{__html: itemWrapper.locales.title || itemWrapper.placeholder}}/>

                {shouldShowDateBadge && (
                    <DateBadge dateStart={itemWrapper.dateStartDisplay}
                               dateEnd={dateInterval ? itemWrapper.dateEndDisplay : null}
                               variant={DateBadge.Variants.DEFAULT}
                               className={`article-timeline-item-info-for-timelines-header-date-badge`}/>
                )}
            </div>

            <PropList className={`article-timeline-item-info-for-timelines-header-prop-list text-1`}
                      inlineBreakpoint={`xl`}>
                {propListItems.map((item, key) => (
                    <PropListItem key={key}
                                  faIcon={item.faIcon}
                                  type={item.type}
                                  iconSpacing={isSmallScreen ? 25 : 30}
                                  value={item.value}/>
                ))}
            </PropList>
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {String} className
 * @return {JSX.Element}
 * @constructor
 */
function ArticleItemInfoForTimelinesBody({ itemWrapper, className = "" }) {
    const textClass = `text-3`

    return (
        <div className={`article-timeline-item-info-for-timelines-body ${className}`}>
            <div className={`article-timeline-item-info-for-timelines-body-text ${textClass}`}
                 dangerouslySetInnerHTML={{__html: itemWrapper.locales.text}}/>

            {itemWrapper.locales.list && itemWrapper.locales.list.length > 0 && (
                <ul className={`article-timeline-item-info-for-timelines-body-list list-mobile-small-padding ${textClass}`}>
                    {itemWrapper.locales.list.map((item, key) => (
                        <li className={`article-timeline-item-info-for-timelines-body-list-item`}
                            key={key}
                            dangerouslySetInnerHTML={{__html: item}}/>
                    ))}
                </ul>
            )}
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {String} className
 * @return {JSX.Element}
 * @constructor
 */
function ArticleItemInfoForTimelinesTagsFooter({ itemWrapper, className = "" }) {
    return (
        <div className={`article-timeline-item-info-for-timelines-tags-footer ${className}`}>
            {itemWrapper.locales.tags && (
                <Tags className={`article-timeline-item-info-for-timelines-tags-footer-tag-list`}>
                    {itemWrapper.locales.tags.map((tag, key) => (
                        <Tag key={key}
                             text={tag}
                             className={`article-timeline-item-info-for-timelines-tags-footer-tag text-1`}/>
                    ))}
                </Tags>
            )}
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @param {String} className
 * @return {JSX.Element}
 * @constructor
 */
function ArticleItemInfoForTimelinesPreviewFooter({ itemWrapper, className = "" }) {
    const hasScreenshotsOrVideo = itemWrapper.preview?.hasScreenshotsOrYoutubeVideo
    const hasLinks = itemWrapper.preview?.hasLinks
    const language = useLanguage()

    if(!hasScreenshotsOrVideo && !hasLinks)
        return <></>

    return (
        <div className={`article-timeline-item-info-preview-footer ${className}`}>
            <div className={`article-timeline-item-info-preview-footer-title text-3`}
                 dangerouslySetInnerHTML={{__html: language.getString("get_to_know_more")}}/>
            <ArticleItemPreviewMenu itemWrapper={itemWrapper}
                                    spaceBetween={false}/>
        </div>
    )
}

export {
    ArticleItemInfoForTimelines,
    ArticleItemInfoForTimelinesHeader,
    ArticleItemInfoForTimelinesBody,
    ArticleItemInfoForTimelinesTagsFooter,
    ArticleItemInfoForTimelinesPreviewFooter
}