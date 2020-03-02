/**
 * Number fns
 */

/**
  * Convert X to float
  */
const asFloat = x => parseFloat(x);

/**
 * Easing function
 */
export const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

/**
 * returns a random number within range
 * @param {number} from min value
 * @param {number} to max value
 */
export const randomInt = (from, to) => Math.random() * (to - from) + from;

/**
 * Converts strings to numbers, and sums them
 * @param  {...string/number} xs what to sum up
 */
export const sumAsFloat = (...xs) => {
  return xs.reduce((x, cur) => {
    if (cur === 'auto') {
      cur = 0;
    }
    return (x = x + parseFloat(cur));
  }, 0);
};

/**
 * Get/Set dom fns
 */

/**
 *
 * @param {dom-element} el element to check
 * @param {string} prop property to check
 * @returns {string}
 */
export const getStyleStr = (el, prop) => window.getComputedStyle(el)[prop];

/**
 * @param {dom-element} el element to remove style from
 * @param  {...string} props styles to remove
 */
export const removeInlineStyles = (el, ...props) => {
  props.forEach(prop => el.style.removeProperty(prop));

  if (!el.getAttribute('style')) {
    el.removeAttribute('style');
  }
};

/**
 * curried fn that places source just after target in the dom
 * @param {dom-element} source what to place in the dom
 */
export const appendAfter = source => {
  return target => {
    target.parentNode.insertBefore(source, target.nextSibling);
  };
};

/**
 * Style properties related to this program
 */
export const placementStyleProps = [
  'position',
  'top',
  'left',
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
  'padding',
  'borderWidth'
];

// fuck this mess
export const getStyleRefs = el => {
  const obj = {};
  placementStyleProps.forEach(style => (obj[style] = getStyleStr(el, style)));
  obj.transform = getStyleStr(el, 'transform').split(/[(,)]+/).filter(Boolean).map(asFloat);
  obj.inline = el.style.cssText;
  obj.topPos = el.getBoundingClientRect().top + window.pageYOffset - parseFloat(getStyleStr(el, 'marginTop')) - parseFloat(getStyleStr(el, 'paddingTop'));
  obj.leftPos = el.getBoundingClientRect().left;
  obj.rightPos = el.getBoundingClientRect().right;
  obj.bodyMargin = parseFloat(getStyleStr(document.body, 'marginLeft'));
  return obj;
};

/**
 * Traverses the dom upwards and checks for a certain data-attribute
 * @param {string} attribute data-attribute to check
 * @param {dom-element} el elements to start from
 * @param {number} count amount of times the attribute been seen
 * @return {boolean} if an ancestor has the attribute
 */
export const hasParentWithDataAttr = (attribute, el, count = 0) => {
  return el === document.body && count < 2
    ? false
    : count > 1
      ? true
      : el.dataset[attribute]
        ? hasParentWithDataAttr(attribute, el.parentElement, count + 1)
        : hasParentWithDataAttr(attribute, el.parentElement, count);
};

/**
 * Is the element display: inline-*;
 * @param {dom-element} el
 */
export const isInline = el => getStyleStr(el, `display`).includes('inline');

/**
 * Is the element an image
 * @param {dom-element} el
 */
export const isImage = el => el.tagName === 'IMG';

/**
 * Is the element of it's first child display: inline-*, or image
 * @param {dom-element} el
 */
export const checkForInlineStyle = el => {
  const firstChild = el.firstElementChild;
  return (isInline(el) || (firstChild && isInline(firstChild) && !isImage(firstChild)));
};

export const assertThat = (predicate) => {
  return new Promise(resolve => {
    if (predicate) {
      resolve()
    } else {
      return requestAnimationFrame(() => assertThat(predicate))
    }
  })
}

export const copycatIsGone = (viscosity) => {
  return (!viscosity.subject.nextElementSibling || (viscosity.subject.nextElementSibling && !viscosity.subject.nextElementSibling.classList.contains('viscosity-copycat')))
}
