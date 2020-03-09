import {lerp, removeInlineStyles} from './utils'

export default {
  _update(viscosity, position = (window.pageYOffset * -1)) {
    if (!viscosity.isRunning)
      return

    requestAnimationFrame(() => this._update(viscosity, position))

    position = lerp(position, window.pageYOffset * -1, viscosity.easing)

    if (this._isRelevant(viscosity, position)) {
      // do the transformation
      this._setStyle(viscosity, position)
      viscosity.inView = true
  } else if (viscosity.inView) {
      // move it far away
      this._setStyle(viscosity, window.innerHeight * 100)
      viscosity.inView = false
    }
  },

  _setStyle(viscosity, position) {
    const t = viscosity.originalPlacement.transform || []

    if (t.length > 1) {
      // merge existing transform styling
      viscosity.subject.style.transform = `matrix(${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, 0, ${t[6] + position})`
    } else {
      // subject had no existing transform
      viscosity.subject.style.transform = `translate3d(0, ${position}px, 0)`
    }
  },

  start(viscosity) {
    viscosity.isRunning = viscosity.inView = true
    this._update(viscosity)
  },

  stop(viscosity) {
    viscosity.isRunning = false
    removeInlineStyles(viscosity.subject, 'transform')
  },

  isRunning(viscosity) {
    return viscosity.isRunning
  },

  _isRelevant(viscosity, position) {
    const offset = viscosity.originalPlacement.heightRect * .5
    const top = (position + viscosity.originalPlacement.heightRect) >= (viscosity.originalPlacement.topPos * -1) - offset
    const bottom = position <= (viscosity.originalPlacement.topPos - window.innerHeight) * -1 + offset

    return top && bottom
  }
}
