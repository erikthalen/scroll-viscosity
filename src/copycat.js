import {appendAfter, getStyleStr, isImage, checkForInlineStyle} from './utils'
import {COPYCAT_CLASS} from './constants'

export default {
  // globals
  id: 0,
  copycats: [],
  subscriptions: [],

  get proxy() {
    return new Proxy(this.copycats, {
      set: (target, key, value) => {
        target[key] = value
        this.id = target.length

        if (typeof value === 'number' && !target.length) {
          this.subscriptions.forEach(subscription => {
            setTimeout(subscription.cb, 100)
          })
        }

        return true
      }
    })
  },

  create(viscosity) {
    viscosity.copycat = document.createElement('div')
    this._addRef(viscosity.copycat)
    viscosity.copycat.innerHTML = String.fromCharCode(160) // a space
    viscosity.copycat.classList.add(COPYCAT_CLASS)
    viscosity.copycat.dataset.id = viscosity.id = this._getId(viscosity)
    appendAfter(viscosity.copycat)(viscosity.subject)
    this.applyStyles(viscosity)
  },

  getId(viscosity) {
    return viscosity.id
  },

  remove(viscosity) {
    viscosity.copycat.remove()
    this._removeRef(viscosity.copycat)
  },

  subscribe(viscosity, cb) {
    this.subscriptions.push({viscosity, cb})
  },

  unsubscribe(viscosity) {
    const index = this.subscriptions.map(s => s.viscosity).indexOf(viscosity)
    this.subscriptions.splice(index, 1)
  },

  applyStyles(viscosity) {
    const {
      position,
      display,
      leftPos,
      topPos,
      bodyMargin,
      padding,
      borderWidth,
      widthRect,
      heightRect,
      float
    } = viscosity.originalPlacement

    Object.assign(viscosity.copycat.style, {
      width: widthRect + 'px',
      height: heightRect + 'px',
      position: this._ifNot('static')(position),
      display: !isImage(viscosity.subject) && this._ifNot('list-item', 'block')(display) && (display === 'inline' && 'inline-block'),
      left: this._ifNot('static', 'relative')(position) && (
        (position === 'absolute')
        ? (leftPos - bodyMargin + 'px')
        : (leftPos + 'px')),
      top: this._ifNot('static', 'relative')(position) && this._accounted(viscosity, topPos) + 'px',
      margin: this._getMargins(viscosity),
      padding: (padding !== '0px' && borderWidth !== '0px') && parseFloat(padding) + parseFloat(borderWidth) + 'px',
      float: this._ifNot('none')(float)
    })
  },

  _getMargins(viscosity) {
    return `${this._getMargin(viscosity, 'Top')} ${this._getMargin(viscosity, 'Right')} ${this._getMargin(viscosity, 'Bottom')} ${this._getMargin(viscosity, 'Left')}`
  },

  _getMargin(viscosity, direction) {
    if (checkForInlineStyle(viscosity.subject)) {
      return parseFloat(viscosity.originalPlacement[`margin${direction}`])
    }

    return (Math.max(parseFloat(viscosity.originalPlacement[`margin${direction}`]), parseFloat(this._getChildMargin(viscosity.subject, direction))) + 'px')
  },

  _getChildMargin(subject, direction) {
    const firstOrLastChild = (direction === 'Top')
      ? 'firstElementChild'
      : (direction === 'Bottom')
        ? 'lastElementChild'
        : null

    // does first child have children?
    if (firstOrLastChild && subject[firstOrLastChild] && subject[firstOrLastChild][firstOrLastChild]) {
      // then run fn with the child
      return this._getChildMargin(subject[firstOrLastChild], direction)
    } else if (firstOrLastChild && subject[firstOrLastChild]) {
      // else return child margin
      return parseFloat(getStyleStr(subject[firstOrLastChild], `margin${direction}`))
    }

    // no child
    return parseFloat(getStyleStr(subject, `margin${direction}`))

  },

  _getId(viscosity) {
    return this.copycats.find(e => e.element === viscosity.copycat).id
  },

  _removeRef(of) {
    const index = this.copycats.map(e => e.element).indexOf(of)
    this.proxy.splice(index, 1)
    // this.id--
  },

  _addRef(of) {
    this.proxy.push({element: of, id: this.id})
    // this.id++
  },

  _accounted(viscosity, topPos) {
    return checkForInlineStyle(viscosity.subject)
      ? topPos + viscosity.originalPlacement.bodyMargin
      : viscosity.originalPlacement.position === 'absolute'
        ? parseFloat(viscosity.originalPlacement.top)
        : topPos + viscosity.originalPlacement.bodyMargin
  },

  _ifNot(...values) {
    return prop => values.includes(prop)
      ? null
      : prop
  }
}
