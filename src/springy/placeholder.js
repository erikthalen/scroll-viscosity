import {appendAfter, getStyleStr} from './utils'

export default class Placeholder {
  constructor({el, styles}) {
    this.element = el
    this.styles = styles

    this.placeholder = null

    // relevant for inline-styled elements
    this.child = this.element.firstElementChild
    this.isCollapsing = getStyleStr(this.element, `display`).includes('inline')
    this.isChildCollapsing = this.child && getStyleStr(this.child, `display`).includes('inline')
  }

  // setup the element that will take up space in the dom tree
  create() {
    this.placeholder = document.createElement("div")
    this.placeholder.classList.add("springy-placeholder")
    this.applyStyles()
    appendAfter(this.placeholder)(this.element)

    if (this.child)
      this.setupChildren()
  }

  update({styles}) {
    this.styles = styles

    this.applyStyles.bind(this)
  }

  remove() {
    if (!this.placeholder)
      return

    if (this.child)
      this.revertChildren()

    this.placeholder.remove()
    this.placeholder = null
  }

  applyStyles() {
    Object.assign(this.placeholder.style, {
      position: this.styles.position !== 'static' && this.styles.position,
      width: this.styles.width,
      height: this.styles.height,
      display: this.element.tagName !== 'IMG' && this.styles.display !== 'list-item' && this.styles.display,
      left: this.styles.leftPos !== this.styles.bodyMargin && this.styles.leftPos - this.styles.bodyMargin + 'px',
      margin: this.getMargins(),
      padding: this.styles.padding !== '0px' && this.styles.padding
    })
  }

  getMargins() {
    return `${this.getMargin('Top')} ${this.getMargin('Right')} ${this.getMargin('Bottom')} ${this.getMargin('Left')}`
  }

  getMargin(direction) {
    if (this.isChildCollapsing || this.isCollapsing)
      return parseFloat(this.styles[`margin${direction}`])

    return Math.max(parseFloat(this.styles[`margin${direction}`]), parseFloat(this.getChildMargin(direction))) + 'px'
  }

  getChildMargin(direction) {
    return this.child
      ? parseFloat(getStyleStr(this.child, `margin${direction}`))
      : 0
  }

  setupChildren() {
    if (this.isChildCollapsing || this.isCollapsing)
      return
    this.child.style.marginTop = 0
  }
  
  revertChildren() {
    this.child.style.removeProperty('margin-top')
  }
}
