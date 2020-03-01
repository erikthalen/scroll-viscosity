import {lerp, removeInlineStyles} from './utils'

export default {
  isInView: true, // this one gotta go into viscosity
  oldBodyHeight: 0,

  update(viscosity, position = (window.pageYOffset * -1)) {
    if (!viscosity.isRunning)
      return

    requestAnimationFrame(() => this.update(viscosity, position))

    // if a new image loads, reposition all elements
    // this._checkBodyHeight(viscosity)

    position = this.isInView
      ? lerp(position, window.pageYOffset * -1, viscosity.easing)
      : window.pageYOffset * -1

    this.setStyle(viscosity, position)
  },

  setStyle(viscosity, position) {
    const t = viscosity.originalPlacement.transform
    if (t.length > 1) {
      // merge existing transform styling
      viscosity.subject.style.transform = `matrix(${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, ${t[5]}, ${t[6] + position})`
    } else {
      // subject had no existing transform
      viscosity.subject.style.transform = `translate3d(0, ${position}px, 0)`
    }
  },

  // note: does this do much? for performance
  // startObserve() {
  //   let callback = (entries, observer) => {
  //     entries.map(entry => {
  //       this.isInView = entry.isIntersecting
  //     })
  //   }
  //   let observer = new IntersectionObserver(callback)
  //   observer.observe(this.subject)
  // },

  _checkBodyHeight(viscosity) {
    if (this.oldBodyHeight !== document.body.clientHeight) {
      viscosity._restart()
    }
    this.oldBodyHeight = document.body.clientHeight
  },

  start(viscosity) {
    viscosity.isRunning = true
    this.update(viscosity)
  },

  stop(viscosity) {
    viscosity.isRunning = false
    removeInlineStyles(viscosity.subject, 'transform')
  }
}
