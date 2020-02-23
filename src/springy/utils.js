// helper to get a style property
export const getStyleStr = (el, prop) => {
  return window.getComputedStyle(el)[prop]
}

// removes all passed inline style properties, from springy-element
export const removeInlineStyles = (el, props) => {
  props.forEach(prop => el.style.removeProperty(prop))
}

// places source, after target in the dom tree
export const appendAfter = (source) => {
  return target => {
    target.parentNode.insertBefore(source, target.nextSibling)
  }
}

// returns sum of all arguments, as float value
// counts 'auto' as 0
export const sumAsFloat = (...xs) => {
  return xs.reduce((x, cur) => {
    if (cur === 'auto') {
      cur = 0
    }
    return x = x + parseFloat(cur)
  }, 0)
}

export const placementStyleProps = [
  'position',
  'top',
  'left',
  'right',
  'width',
  'height',
  'display',
  'transform',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'paddingTop',
  'margin',
  'padding'
]

export const getStyleRefs = (el) => {
	const obj = {}
    placementStyleProps.forEach(style => (obj[style] = getStyleStr(el, style)))
    obj.topPos = el.getBoundingClientRect().top + window.pageYOffset - parseFloat(getStyleStr(el, 'marginTop')) - parseFloat(getStyleStr(el, 'paddingTop'))
    obj.leftPos = el.getBoundingClientRect().left
    obj.rightPos = el.getBoundingClientRect().right
    obj.bodyMargin = parseFloat(getStyleStr(document.body, 'marginLeft'))
	return obj
  }
