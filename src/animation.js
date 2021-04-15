import { lerp, removeInlineStyles } from './utils'

export default {
  _update(
    viscosity,
    positionY = window.pageYOffset * -1,
    positionX = window.pageXOffset * -1
  ) {
    if (!viscosity.isRunning) return

    requestAnimationFrame(() => this._update(viscosity, positionY, positionX))

    positionY = lerp(positionY, window.pageYOffset * -1, viscosity.easing)
    positionX = lerp(positionX, window.pageXOffset * -1, viscosity.easing)

    if (this._isRelevant(viscosity, positionY, positionX)) {
      // do the transformation
      this._setStyle(viscosity, positionY, positionX)
      viscosity.inView = true
    } else if (viscosity.inView) {
      // move it far away
      this._setStyle(viscosity, window.innerHeight * 100, 0)
      viscosity.inView = false
    }
  },

  _setStyle(viscosity, positionY, positionX) {
    const t = viscosity.originalPlacement.transform || []

    if (t.length > 1) {
      // merge existing transform styling
      viscosity.subject.style.transform = `matrix(${t[1]}, ${t[2]}, ${t[3]}, ${
        t[4]
      }, ${t[5] + positionX}, ${t[6] + positionY})`
    } else {
      // subject had no existing transform
      viscosity.subject.style.transform = `translate3d(${positionX}px, ${positionY}px, 0)`
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

  _isRelevant(viscosity, positionY, positionX) {
    const { heightRect, widthRect, topPos, leftPos } = viscosity.originalPlacement
    const offsetY = heightRect * 0.5
    const offsetX = widthRect * 0.5

    const top = positionY + heightRect >= topPos * -1 - offsetY
    const bottom = positionY <= (topPos - window.innerHeight) * -1 + offsetY
    const left = positionX + widthRect >= leftPos * -1 - offsetX
    // const right = positionX + widthRect >= rightPos * -1 - offsetX

    // console.log(top, bottom, left)

    return top && bottom
  },
}
