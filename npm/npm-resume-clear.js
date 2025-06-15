/**
 * @author Ryan Balieiro
 * @description Use this script to wipe all existing resume data and start fresh with a blank resume.
 *
 * @usage
 * npm run resume:clear
 */
import {useNpmLogger} from "./snippets/_npm-log.js"
import {useNpmFileUtils} from "./snippets/_npm-files.js"
import {useNpmJsonUtils} from "./snippets/_npm-json.js"

const logger = useNpmLogger()
const fileUtils = useNpmFileUtils()
const jsonUtils = useNpmJsonUtils()

const foldersToDelete = [
    "public/images/pictures"
]

const foldersToEmpty = [
    "public/data/sections"
]

// Delete images and section's json files...
foldersToDelete.forEach(fileUtils.deleteFolder)
foldersToEmpty.forEach(fileUtils.emptyFolder)

// Overwrite settings.json...
const jSettingsPath = "public/data/settings.json"
jsonUtils.overwrite(jSettingsPath, {
    developerSettings: {
        debugMode: false,
        fakeEmailRequests: false,
        stayOnThePreloaderScreen: false,
        version: "1.0.0"
    },

    preloaderSettings: {
        enabled: true,
        title: "React <b>Portfolio</b>",
        subtitle: "by Ryan Balieiro",
        logoOffset: {
            right: 14,
            top: 2,
            bottom: 0,
        }
    },

    templateSettings: {
        animatedBackground: true,
        animatedCursorEnabled: true,
        defaultLanguageId: "en",
        defaultThemeId: "dark",
        fullscreenEnabled: true,
        showSpinnerOnThemeChange: false
    },

    supportedLanguages: [
        {
            name: "English",
            id: "en",
            flagUrl: "images/flags/en-us.png"
        }
    ],

    supportedThemes: [
        {
            id: "dark",
            icon: "fa-solid fa-moon",
            dark: true,
            locales: {
                en: {"name": "Dark Mode"},
                es: {"name": "Modo Oscuro"}
            }
        },

        {
            id: "light",
            icon: "fa-solid fa-sun",
            dark: false,
            locales: {
                en: {"name": "Light Mode"},
                es: {"name": "Modo Claro"}
            }
        }
    ],

    imagesToCache: []
})

// Overwrite strings.json...
const jStringsPath = "public/data/strings.json"
const jStrings = jsonUtils.open(jStringsPath)
delete jStrings.locales["es"]
delete jStrings.locales["fr"]
delete jStrings.locales["ko"]
for(let i in jStrings.locales["en"]) {
    if(i.startsWith("see_") && i !== "see_more")
        delete jStrings.locales["en"][i]
}
delete jStrings.locales["en"]["read"]
jsonUtils.save(jStringsPath, jStrings)

// Define default sections...
const presetSections = [
    {
        id: "about",
        categoryId: "home",
        jsonPath: "/data/sections/cover.json",
        faIcon: "fa-solid fa-address-card"
    },
    {
        id: "skills",
        categoryId: "showcase",
        jsonPath: "/data/sections/skills.json",
        faIcon: "fa-solid fa-tools"
    },
    {
        id: "experience",
        categoryId: "background",
        jsonPath: "/data/sections/experience.json",
        faIcon: "fa-solid fa-briefcase"
    },
    {
        id: "contact",
        categoryId: "more",
        jsonPath: "/data/sections/contact.json",
        faIcon: "fa-solid fa-pen-to-square"
    }
]

// Create sections.json...
const jSectionsPath = "public/data/sections.json"
jsonUtils.update(jSectionsPath, {
    sections: presetSections
})

// Create each default section's JSON file...
for(const presetSection of presetSections) {
    const jSectionDataPath = `public${presetSection.jsonPath}`
    jsonUtils.create(jSectionDataPath, {
        title: {
            locales: {
                en: {
                    title_short: "Title",
                    title_short_nav: "Title Nav",
                    title_long_prefix: "This is a",
                    title_long: "Placeholder {{Title}}"
                }
            }
        },

        articles: [

        ]
    })
}

// Create categories.json...
const jCategoriesPath = "public/data/categories.json"
jsonUtils.update(jCategoriesPath, {
    categories: [
        {
            id: "home",
            faIcon: "fa-regular fa-user",
            locales: {
                en: { title: "Home" }
            }
        },
        {
            id: "background",
            faIcon: "fa-regular fa-clock",
            locales: {
                en: { title: "History" }
            }
        },
        {
            id: "showcase",
            faIcon: "fa-regular fa-folder-open",
            locales: {
                en: { title: "Showcase" }
            }
        },
        {
            id: "more",
            faIcon: "fa-regular fa-object-ungroup",
            locales: {
                en: { title: "More" }
            }
        }
    ]
})

// Reset profile.json...
const jProfilePath = "public/data/profile.json"
jsonUtils.update(jProfilePath, {
    name: "John Doe",

    profilePictureUrl: "images/pictures/pfp.png",
    resumePdfUrl: "",

    statusCircleVisible: true,
    statusCircleVariant: "available",
    statusCircleHoverMessage: "status_message_available_for_freelance",

    locales: {
        en: {
            localized_name: "John Doe",
            localized_name_stylized: "<strong>John {{Doe}}</strong>",
            status_message_available_for_freelance: "Available for freelance!",
            roles: [
                "Procrastinator"
            ]
        }
    }
})

logger.log(logger.LogTypes.SUCCESS_FINISHED, "Successfully cleared resume data!")
