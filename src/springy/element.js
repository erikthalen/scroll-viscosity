import {removeInlineStyles, sumAsFloat} from './utils'

export default class Element {
  constructor({el, styles}) {
    this.element = el
    this.styles = styles
  }

  setup() {
    Object.assign(this.element.style, {
      position: "fixed",
      top: sumAsFloat(this.styles.topPos, this.styles.paddingTop, this.styles.marginTop) + "px",
      left: this.styles.leftPos + 'px',
      right: this.styles.rightPos + 'px',
      width: this.styles.width,
      height: this.styles.height,
      margin: 0
    })
  }

  revert() {
    removeInlineStyles(this.element, [
      'position',
      'top',
      'left',
      'right',
      'width',
      'height',
      'margin'
    ])
  }

  update({styles}) {
    this.styles = styles
  }
}
