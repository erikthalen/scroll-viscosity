import {appendAfter, getStyleStr} from './utils'

// the copycat takes the subjects place
export default class Copycat {
  constructor({element, styles}) {
    this.subject = element
    this.styles = styles

    // relevant for inline-styled subjects
    this.child = this.subject.firstElementChild
    this.isCollapsing = getStyleStr(this.subject, `display`).includes('inline')
    this.isChildCollapsing = this.child && getStyleStr(this.child, `display`).includes('inline')
  }

  // setup the subject that will take up space in the dom tree
  create() {
    this.copycat = document.createElement('div')
    this.copycat.classList.add('viscosity-copycat')
    this.applyStyles()
    appendAfter(this.copycat)(this.subject)
  }

  update({styles}) {
    this.styles = styles
    this.applyStyles.bind(this)
  }

  remove() {
    this.copycat.remove()
  }

  applyStyles() {
    const {
      position,
      width,
      height,
      display,
      leftPos,
      topPos,
      bodyMargin,
      padding
    } = this.styles

    Object.assign(this.copycat.style, {
      width,
      height,
      position: (position !== 'static') && position,
      display: (this.subject.tagName !== 'IMG') && (display !== 'list-item') && display,
      left: leftPos + 'px', //(leftPos !== bodyMargin) && (leftPos - bodyMargin) + 'px',
      top: topPos + 'px',
      margin: this.getMargins(),
      padding: (padding !== '0px') && padding
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
}
