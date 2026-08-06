console.log("picker loaded")

let lastHovered = null
let selectedElement = null

function isUnique(selector) {
  if (document.querySelectorAll(selector).length === 1) {
    return true
  }
  
  return false
}

function classSelector(element, includeTag) {
  const classes = 
    typeof element.className === "string" && element.className.trim()
    ? element.className
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .filter(c =>
          !/^css-/.test(c) &&
          !/^sc-/.test(c) &&
          !/^jsx-/.test(c)
        )
        .map(c => `.${CSS.escape(c)}`)
        .join("")
    : ""

  return (
    includeTag
      ? element.tagName.toLowerCase() + classes
      : classes || element.tagName.toLowerCase()
  )
}

function nthInfo(element) {
  if (!element.parentElement) {
    return {
      index: 1,
      needsNth: false
    }
  }

  const tag = element.tagName.toLowerCase()

  const siblings = [...element.parentElement.children]
    .filter(el => el.tagName.toLowerCase() === tag)

  return {
    index: siblings.indexOf(element) + 1,
    needsNth: siblings.length > 1
  }
}

function getUniqueLocator(element) {

  // 1. Check clicked element ID
  if (element.id) {

    const selector =
      `#${CSS.escape(element.id)}`

    if (isUnique(selector)) {
      return selector
    }
  }

  // 2. Look for parent id
  const parts = [classSelector(element, true)]
  let current = element.parentElement

  while (current) {
    if (current.id) {
      const selector =
        `#${CSS.escape(current.id)} ${parts.join(" ")}`

      if (isUnique(selector)) {
        return selector
      }
    } else {
      parts.unshift(classSelector(current, false))
    }

    current = current.parentElement
  }

  //UP TO HERE HAS BEEN INSPECTED AND WORKS

  // 3. No IDs found, build class path
  const path = []

  current = element

  while (current && current !== document.documentElement) {

    const selectorPart =
      classSelector(current, true)

    path.unshift({
      selector: selectorPart,
      ...nthInfo(current)
    })

    // Try plain selector first
    let selector = path
      .map(p => p.selector)
      .join(" > ")

    if (isUnique(selector)) {
      return selector
    }

    // Add nth-of-type from target upward
    const testPath = path.map(p => ({
      ...p
    }))

    for (let i = testPath.length - 1; i >= 0; i--) {

      if (testPath[i].needsNth) {
        testPath[i].selector =
          `${testPath[i].selector}:nth-of-type(${testPath[i].index})`
      }

      selector = testPath
        .map(p => p.selector)
        .join(" > ")

      if (isUnique(selector)) {
        return selector
      }
    }

    current = current.parentElement
  }

  return ""
}

function highlightSelected(element) {
  element.style.outline = "3px solid #4480ef"
}

function unhighlightSelected(element) {
  element.style.outline = ""
}

// Hover preview
document.addEventListener(
  "mousemove",
  (event) => {

    const element = event.target

    if (!(element instanceof HTMLElement)) {
      return
    }

    if (
      lastHovered &&
      lastHovered !== element &&
      lastHovered !== selectedElement
    ) {

      lastHovered.style.outline = ""

    }

    if (element !== selectedElement) {

      element.style.outline =
        "2px solid #3b82f6"

    }

    element.style.cursor =
      "crosshair"

    lastHovered = element

  },
  true
)

// Click selection
document.addEventListener(
  "click",
  (event) => {

    event.preventDefault()
    event.stopPropagation()

    const element = event.target

    if (!(element instanceof HTMLElement)) {
      return
    }

    // Clicking selected element clears it
    if (selectedElement === element) {
      unhighlightSelected(element)
      selectedElement = null

      window.parent.postMessage(
        {
          type: "unselected"
        },
        "*"
      )
      return
    }

    // Remove old selection
    if (selectedElement) {
      unhighlightSelected(selectedElement)
    }

    // Select new element
    selectedElement = element

    highlightSelected(element)

    const locator =
      getUniqueLocator(element)

    console.log(
      "Selected locator:",
      locator
    )

    window.parent.postMessage(
      {
        type: "selected",
        locator
      },
      "*"
    )

  },
  true
)
