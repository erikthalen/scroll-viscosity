import { COPYCAT_CLASS } from './constants'
import Observer from './observer'
import Status from './status'

/**
 * Number fns
 */

/**
 * Convert X to float
 */
const asFloat = x => parseFloat(x)

/**
 * Easing function
 */
export const lerp = (start, end, amt) => (1 - amt) * start + amt * end

/**
 * returns a random number within range
 * @param {number} from min value
 * @param {number} to max value
 */
export const randomInt = (from, to) => Math.random() * (to - from) + from

/**
 * Converts strings to numbers, and sums them
 * @param  {...string/number} xs what to sum up
 */
export const sumAsFloat = (...xs) => {
  return xs.reduce((x, cur) => {
    if (cur === 'auto') {
      cur = 0
    }
    return (x = x + parseFloat(cur))
  }, 0)
}

/**
 * Get/Set dom fns
 */

/**
 *
 * @param {dom-element} el element to check
 * @param {string} prop property to check
 * @returns {string}
 */
export const getStyleStr = (el, prop) => window.getComputedStyle(el)[prop]

/**
 * @param {dom-element} el element to remove style from
 * @param  {...string} props styles to remove
 */
export const removeInlineStyles = (el, ...props) => {
  props.forEach(prop => el.style.removeProperty(prop))

  if (!el.getAttribute('style')) {
    el.removeAttribute('style')
  }
}

/**
 * curried fn that places source just after target in the dom
 * @param {dom-element} source what to place in the dom
 */
export const appendAfter = source => {
  return target => {
    target.parentNode.insertBefore(source, target.nextSibling)
  }
}

/**
 * Style properties related to this program
 */
export const placementStyleProps = [
  'position',
  'top',
  'left',
  'width',
  'height',
  'maxWidth',
  'maxHeight',
  'display',
  'transform',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'margin',
  'padding',
  'borderWidth',
  'float',
]

const collectStyles = (el, obj) => {
  
  const rect = el.getBoundingClientRect()
  // directly copy some styles
  placementStyleProps
    .filter(prop => prop !== 'display')
    .forEach(style => (obj[style] = getStyleStr(el, style)))
  // split transforms matrix style on each matrix
  obj.transform = getStyleStr(el, 'transform')
    .split(/[(,)]+/)
    .filter(Boolean)
    .map(asFloat)
  // calc correct top position
  obj.topPos =
    rect.top +
    window.pageYOffset -
    parseFloat(getStyleStr(el, 'marginTop')) +
    parseFloat(getStyleStr(el, 'paddingTop'))
  obj.leftPos = rect.left + parseFloat(getStyleStr(el, 'paddingLeft'))
  obj.widthRect =
    rect.width -
    parseFloat(getStyleStr(el, 'paddingLeft')) -
    parseFloat(getStyleStr(el, 'paddingRight'))
  obj.heightRect =
    rect.height -
    parseFloat(getStyleStr(el, 'paddingTop')) -
    parseFloat(getStyleStr(el, 'paddingTop'))
  // body margin needed for absolute elements
  obj.bodyMargin = parseFloat(getStyleStr(document.body, 'marginLeft'))
  el.dataset.viscosity = 'is-read'
  return obj
}

export function getStyleRefs(el) {
  return new Promise((resolve, reject) => {
    Observer.observe({
      what: el,
      until: () => Status.get(el) === 'is-seen',
    }).then(() => {
      if (inline) {
        Observer.observe({
          what: el,
          until: () => el.style.display === 'inline-block',
        }).then(() => {
          Observer.observe({
            what: el,
            until: () => Status.get(el) === 'is-read',
          }).then(() => {
            Observer.observe({
              what: el,
              until: () => el.style.cssText === obj.inline,
            }).then(() => {
              resolve(styles)
            })

            el.style.cssText = obj.inline
          })

          const styles = collectStyles(el, obj)
        })

        el.style.display = 'inline-block'
      } else {
        Observer.observe({
          what: el,
          until: () => Status.get(el) === 'is-read',
        }).then(() => {
          resolve(styles)
        })

        const styles = collectStyles(el, obj)
      }
    })

    const inline = isInline(el)
    const obj = {}
    obj.inlineStyle = el.style.cssText
    obj.display = getStyleStr(el, 'display')
    Status.set(el, 'is-seen')
  })
}

/**
 * Traverses the dom upwards and checks for a certain data-attribute
 * @param {string} attribute data-attribute to check
 * @param {dom-element} el elements to start from
 * @param {number} count amount of times the attribute been seen
 * @return {boolean} if an ancestor has the attribute
 */
export const hasParent = (attribute, el, count = 0) => {
  return el === document.body && count < 2
    ? false
    : count > 1
    ? true
    : el.dataset[attribute]
    ? hasParent(attribute, el.parentElement, count + 1)
    : hasParent(attribute, el.parentElement, count)
}

/**
 * Is the element display: inline-*
 * @param {dom-element} el
 */
export const isInline = el => getStyleStr(el, `display`).includes('inline')

/**
 * Is the element an image
 * @param {dom-element} el
 */
export const isImage = el => el.tagName === 'IMG'

/**
 * Is the element of it's first child display: inline-*, or image
 * @param {dom-element} el
 */
export const checkForInlineStyle = el => {
  const firstChild = el.firstElementChild
  return (
    isInline(el) || (firstChild && isInline(firstChild) && !isImage(firstChild))
  )
}
