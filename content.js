const username = "<yourusername>"
const header = document.getElementById("header")
const parentDirectoryLink = document.getElementById("parentDirLinkBox")
const table = document.querySelector("table")
const defaultOptions = {
    showHidden: false,
    viewMode: "grid"
}

function removeParentDirectoryLink() {
    document.body.removeChild(parentDirectoryLink)
}

function formatCurrentDirectory() {
    const { pathname: directory } = window.location
    header.textContent = directory
    return directory
}

function getLocations() {
    return [
        {
            name: "Hard Drive",
            path: "/",
            image: chrome.runtime.getURL("icons/disk.png")
        },
        {
            name: username,
            path: `/Users/${username}/`,
            image: chrome.runtime.getURL("icons/home.png")
        },
        {
            name: "Downloads",
            path: `/Users/${username}/downloads/`,
            image: chrome.runtime.getURL("icons/downloads.jpg")
        },
        {
            name: "Documents",
            path: `/Users/${username}/documents/`,
            image: chrome.runtime.getURL("icons/documents.png")
        },
        {
            name: "Pictures",
            path: `/Users/${username}/pictures/`,
            image: chrome.runtime.getURL("icons/pictures.jpeg")
        },
        {
            name: "Movies",
            path: `/Users/${username}/movies/`,
            image: chrome.runtime.getURL("icons/movies.jpeg")
        }
    ]
}

function getLocationClassName(_location) {
    const { pathname } = window.location
    if (pathname === "/") {
        return _location.path === "/" ? "active" : "";
    } else if (pathname === `/Users/${username}`) {
        return _location.path === `/Users/${username}` ? "active" : ""
    } else if (pathname.toLowerCase() === _location.path.toLowerCase()) {
        return "active"
    } else return ""
}

function extractTableInfo() {
    const tbody = table.querySelector("tbody")
    const rows = Array.from(tbody.children)
    const foldersAndFiles = rows.map(row => {
        const dataCell = row.children[0]
        return {
            name: dataCell.getAttribute("data-value"),
            link: dataCell.children[0].getAttribute("href")
        }
    })
    return foldersAndFiles
}

function divideInFoldersAndFiles(tableInfo, showHidden) {
    const folders = tableInfo.filter(info => {
        return info.name.endsWith("/")
    }).filter(info => showHidden ? true : !info.name.startsWith("."))
    const files = tableInfo.filter(info => {
        return !info.name.endsWith("/")
    }).filter(info => showHidden ? true : !info.name.startsWith("."))
    return [folders, files]
}

function createElement(tag, { props = {}, attributes = {}, listeners = [], children = [] }) {
    const element = document.createElement(tag)
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value))
    Object.entries(listeners).forEach(([name, listener]) => element[name] = listener)
    Object.assign(element, {...props})
    children.forEach(child => element.appendChild(child))
    return element
}

function createFolder(info) {
    return createElement("div", {
        props: {
            className: "folder",
            title: info.name
        },
        attributes: {
            "data-path": info.link,
        },
        listeners: {
            onclick(event) {
                console.log(event.target, event.currentTarget)
                const path = event.currentTarget.getAttribute("data-path")
                console.log("going to:", path)
                // history.pushState({}, "", path)
                window.location.href = path
            }
        },
        children: [
            createElement("figure", {
                props: {
                    className: "folder__image-container",
                },
                children: [
                    createElement("img", {
                        props: {
                            className: "image",
                            src: "https://i.imgur.com/sBdKjY8.png"
                        }
                    })
                ]
            }),
            createElement("p", {
                props: {
                    className: "folder__name",
                    textContent: info.name.replace("/", "")
                }
            })
        ]
    })   
}

function createFile() {

}

function createSidebar() {
    const locations = getLocations()
    return createElement("aside", {
        props: {
            className: "just-explore__sidebar"
        },
        children: [
            createElement("header", {
                props: {
                    className: "sidebar__brand"
                },
                children: [
                    createElement("h1", {
                        props: {
                            textContent: "File Explorer"
                        }
                    })
                ]
            }),
            createElement("div", {
                props: {
                    className: "locations__title"
                },
                children: [
                    createElement("h4", {
                        props: {
                            textContent: "Locations"
                        }
                    })
                ]
            }),
            createElement("ul", {
                props: {
                    className: "sidebar__locations"
                },
                children: locations.map(location => {
                    return createElement("li", {
                        props: {
                            className: "locations__location"
                        },
                        children: [
                            createElement("a", {
                                props: {
                                    href: location.path,
                                    className: getLocationClassName(location)
                                },
                                children: [
                                    createElement("img", {
                                        props: {
                                            src: location.image,
                                        }
                                    }),
                                    createElement("span", {
                                        props: {
                                            textContent: location.name
                                        }
                                    })
                                ]
                            })
                        ]
                    })
                })
            })
        ]
    })
}

function createToolbar(options) {
    return createElement("header", {
        props: {
            className: "canvas__toolbar"
        },
        children: [
            createElement("h1", {
                props: {
                    textContent: formatCurrentDirectory()
                }
            }),
            createElement("div", {

            }),
            createElement("section", {

            })
        ]
    })
}

function createGrid({ showHidden = false }) {
    const [folders, files] = divideInFoldersAndFiles(extractTableInfo(), showHidden)
    console.table({
        folders,
        files,
    })
    return createElement("div", {
        props: {
            className: "canvas__grid",
        },
        children: folders.map(createFolder)
    })
}

function createLayout(options) {
    return createElement("main", {
        props: {
            className: "just-explore"
        },
        children: [
            createSidebar(),
            createElement("article", {
                props: {
                    className: "just-explore__canvas"
                },
                children: [
                    createToolbar(options),
                    createGrid(options)
                ]
            })
        ]
    })
}



function justExplore() {
    header.style.display = "none"
    table.style.display = "none"
    removeParentDirectoryLink()
    formatCurrentDirectory()
    document.body.appendChild(createLayout(defaultOptions))
}

justExplore()
