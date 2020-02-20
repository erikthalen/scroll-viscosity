/**
 * Springy
 *
 * Erik Thalén - erikthalen.com
 */

// todo: loads of (boring) integration tests, 👀
// todo: clean up code (aka. the signature of every developer), 🛁
// todo: publish 🥂🍾

/**
known bugs:

- slight displacement of images

*/

import Animation from './animation'
import Resize from './resize'

export default class Springy {
  constructor({element, easing}) {
    this.element = element
    this.options = {
      easing: easing || 0.3
    }

    if (!this.element) {
      return
    }

    this.animation = new Animation({el: this.element, easing: this.options.easing})
    this.onResize = new Resize({callback: this.onResize.bind(this)})

    // relevant styling to keep
    this.orgStyles = [
      "position",
      "top",
      "left",
      "right",
      "width",
      "height",
      "display",
      "transform",
      "marginTop",
      "marginBottom",
      "marginLeft",
      "marginRight",
      "paddingTop",
      "margin",
      "padding"
    ]

    // wrapper gets created on init
    this.wrapper = null

    // relevant for inline-styled elements
    this.children = this.element.firstElementChild
    this.isCollapsing = this.getStyle(`display`).includes('inline')
    this.isChildCollapsing = this.children && this.getStyle(`display`, this.element.firstElementChild).includes('inline')

    this.init()
  }

  // choo choo
  init() {
    this.saveRefs() // of original styles

    // todo: 'global' handler to save every instance's style before messing with the content flow
    setTimeout(() => {
      this.setupEl()
      this.setupWrapper()
      if (this.children)
        this.setupChildren()

      this.animation.start()
    })
  }

  // for setting up the elements
  saveRefs() {
    this.orgStyles.forEach(style => (this[style] = this.getStyle(style)))
    this.topPos = this.element.getBoundingClientRect().top + window.pageYOffset - parseFloat(this.getStyle('marginTop')) + "px"
    this.bodyMargin = window.getComputedStyle(document.body).margin
  }

  // setup the element that will take up space in the dom tree
  setupWrapper() {
    this.wrapper = document.createElement("div")
    this.wrapper.classList.add("springy__wrapper")
    this.styleWrapper()
    this.appendAfter(this.wrapper)(this.element)
    this.wrapper.appendChild(this.element)
  }

  // special care for inlined children, b/c collapsing margins
  getChildMargin(direction) {
    return this.element.firstElementChild
      ? parseFloat(this.getStyle(`margin${direction}`, this.element.firstElementChild))
      : 0
  }
  setupChildren() {
    if (this.isChildCollapsing || this.isCollapsing)
      return
    this.element.firstElementChild.style.marginTop = 0
  }
  revertChildren() {
    this.element.firstElementChild.style.removeProperty('margin-top')
  }

  // todo: it's a mess
  // the element that will take up space in the dom tree
  styleWrapper() {
    Object.assign(this.wrapper.style, {
      maxWidth: this.maxWidth !== "none"
        ? this.maxWidth
        : null,
      width: this.width,
      height: this.height,
      left: this.left !== 'auto' && this.left,
      position: this.position !== 'static' && this.position,
      display: this.element.tagName !== 'IMG' && this.display !== 'list-item' && this.display,
      margin: this.getWrapperMargins(),
      padding: this.padding !== '0px' && this.padding
    })
  }

  getWrapperMargins() {
    return `${this.getWrapperMargin('Top')} ${this.getWrapperMargin('Right')} ${this.getWrapperMargin('Bottom')} ${this.getWrapperMargin('Left')}`
  }

  getWrapperMargin(direction) {
    if (this.isChildCollapsing || this.isCollapsing)
      return parseFloat(this[`margin${direction}`])

    return Math.max(parseFloat(this[`margin${direction}`]), parseFloat(this.getChildMargin(direction))) + 'px'
  }

  // the element that will float around
  setupEl() {
    Object.assign(this.element.style, {
      position: "fixed",
      top: this.addAsFloat(this.topPos, this.paddingTop, this.marginTop) + "px",
      left: this.addAsFloat(this.left, this.margin, this.bodyMargin) + "px",
      right: this.addAsFloat(this.right, this.margin) + "px",
      width: this.width,
      height: this.height,
      margin: 0,
      padding: 0
    })
  }

  // leave the place, un-noticed
  destroy() {
    if (!this.wrapper)
      return

    if (this.children)
      this.revertChildren()

    this.animation.stop()
    this.removeStyles(this.orgStyles)
    this.appendAfter(this.element)(this.wrapper)
    this.wrapper.remove()
    this.wrapper = null
  }

  // helper to get a style property
  getStyle(prop, el = this.element) {
    return window.getComputedStyle(el)[prop]
  }

  // returns sum of all arguments, as float value
  addAsFloat(...xs) {
    return xs.reduce((x, cur) => x = x + parseFloat(cur), 0)
  }

  // removes all passed inline style properties, from springy-element
  removeStyles(props) {
    props.forEach(prop => this.element.style.removeProperty(prop))
  }

  // places source, after target in the dom tree
  appendAfter(source) {
    return target => {
      target.parentNode.insertBefore(source, target.nextSibling)
    }
  }

  // what to do on screen resize
  onResize() {
    this.destroy()
    setTimeout(() => this.init())
  }

  // turn the whole thing on/off
  toggle() {
    if (this.animation.isRunning) {
      this.destroy()
    } else {
      this.init()
    }
  }
}
