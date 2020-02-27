import {lerp, removeInlineStyles} from './utils'

/**
 * handles the funny part
 *
 * can be set to on/off
 */
export default {
  isInView: true, // this one gotta go into viscosity

  update(viscosity, position = (window.pageYOffset * -1)) {
    if (!viscosity.isRunning)
      return

    requestAnimationFrame(() => this.update(viscosity, position))

    position = this.isInView
      ? lerp(position, // ease from
          window.pageYOffset * -1, // to
          viscosity.easing) // by amount
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

  start(viscosity) {
    viscosity.isRunning = true
    this.currentPosition = window.pageYOffset * -1
    this.update(viscosity)
  },

  stop(viscosity) {
    viscosity.isRunning = false
    removeInlineStyles(viscosity.subject, 'transform')
  }
}
