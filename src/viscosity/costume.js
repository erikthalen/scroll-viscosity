import {removeInlineStyles, sumAsFloat, getStyleStr} from './utils'

// the costume restyles the subject
// puts a costume on it..
export default class Costume {
  constructor({element, styles}) {
    this.subject = element
    this.styles = styles

    // relevant for inline-styled subjects
    this.child = this.subject.firstElementChild
    this.isCollapsing = getStyleStr(this.subject, `display`).includes('inline')
    this.isChildCollapsing = this.child && getStyleStr(this.child, `display`).includes('inline')
  }

  setup() {
    Object.assign(this.subject.style, {
      position: "fixed",
      top: sumAsFloat(this.styles.topPos, this.styles.paddingTop, this.styles.marginTop) + "px",
      left: this.styles.leftPos + 'px',
      right: this.styles.rightPos + 'px',
      width: this.styles.width,
      height: this.styles.height,
      margin: 0
    })

    if (this.child)
      setTimeout(() => this.setupChildren())
  }

  revert() {
    removeInlineStyles(this.subject, [
      'position',
      'top',
      'left',
      'right',
      'width',
      'height',
      'margin'
    ])

    if (this.child)
      this.revertChildren()
  }

  update({styles}) {
    this.styles = styles
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
