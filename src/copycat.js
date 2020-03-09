import {appendAfter, getStyleStr, isImage, checkForInlineStyle} from './utils'
import {COPYCAT_CLASS} from './constants'

export default {
  // globals
  id: 0,
  copycats: [],
  subscriptions: [],

  // hijack and do computation when [copycats] in changed
  get proxy() {
    return new Proxy(this.copycats, {
      set: (target, key, value) => {
        target[key] = value
        this.id = target.length // kinda weird but works

        // run subscriptions when all copycats are gone
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
    viscosity.copycat.dataset.id = viscosity.id = this._setId(viscosity)
    appendAfter(viscosity.copycat)(viscosity.subject)
    this.applyStyles(viscosity)
  },

  remove(viscosity) {
    viscosity.copycat.remove()
    this._removeRef(viscosity.copycat)
  },

  getId(viscosity) {
    return viscosity.id
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
      paddingLeft,
      borderWidth,
      widthRect,
      heightRect,
      float
    } = viscosity.originalPlacement

    Object.assign(viscosity.copycat.style, {
      width: widthRect + 'px',
      height: heightRect + 'px',
      position: this._ifNot('static')(position),
      display: !isImage(viscosity.subject) && this._ifNot('list-item', 'block')(display) && (display === 'inline' && 'inline-block') || '',
      left: this._ifNot('static', 'relative')(position) && (
        (position === 'absolute')
        ? (leftPos - bodyMargin - parseFloat(paddingLeft) + 'px')
        : (leftPos + 'px')),
      top: this._ifNot('static', 'relative')(position) && this._accounted(viscosity, topPos) + 'px',
      margin: this._getSpacings(viscosity, 'margin'),
      padding: this._getSpacings(viscosity, 'padding'),
      float: this._ifNot('none')(float)
    })
  },

  _getSpacings(viscosity, type) {
    return `${this._getSpacing(viscosity, `${type}Top`)} ${this._getSpacing(viscosity, `${type}Right`)} ${this._getSpacing(viscosity, `${type}Bottom`)} ${this._getSpacing(viscosity, `${type}Left`)}`
  },

  _getSpacing(viscosity, direction) {
    // this probably fails now, for padding
    if (checkForInlineStyle(viscosity.subject)) {
      return parseFloat(viscosity.originalPlacement[direction])
    }

    return (Math.max(parseFloat(viscosity.originalPlacement[direction]), parseFloat(this._getChildSpacing(viscosity.subject, direction))) + 'px')
  },

  _getChildSpacing(subject, direction) {
    const firstOrLastChild = direction.includes('Top')
      ? 'firstElementChild'
      : direction.includes('Bottom')
        ? 'lastElementChild'
        : null

    // does first/last child have children?
    if (firstOrLastChild && subject[firstOrLastChild] && subject[firstOrLastChild][firstOrLastChild]) {
      // then run fn with the child
      return this._getChildSpacing(subject[firstOrLastChild], direction)
    } else if (firstOrLastChild && subject[firstOrLastChild]) {
      // else return child margin
      return parseFloat(getStyleStr(subject[firstOrLastChild], direction))
    }

    // no child
    return parseFloat(getStyleStr(subject, direction))
  },

  _setId(viscosity) {
    return this.copycats.find(e => e.element === viscosity.copycat).id
  },

  _removeRef(of) {
    const index = this.copycats.map(e => e.element).indexOf(of)
    this.proxy.splice(index, 1)
  },

  _addRef(of) {
    this.proxy.push({element: of, id: this.id})
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
