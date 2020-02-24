/**
 * handles the funny part
 *
 * can be set to on/off
 */

export default class Animation {
  constructor({element, styles, easing}) {
    this.subject = element
    this.styles = styles
    this.easing = easing

    this.isRunning = false
    this.isInView = true
    this.setCurrentPos()
    // this.startObserve()
  }

  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
  }

  update() {
    if (!this.isRunning)
      return

    requestAnimationFrame(this.update.bind(this))

    this.currentPosition = this.isInView
      ? this.lerp(this.currentPosition, // ease from
          this.getCurrentPos(), // to
          this.easing) // by amount
      : this.getCurrentPos()

    this.setStyle()
  }

  getCurrentPos() {
    return window.pageYOffset * -1
  }

  setCurrentPos() {
    this.currentPosition = this.getCurrentPos()
  }

  setStyle() {
    const t = this.styles.transform
    if (t.length > 1) {
      // merge existing transform styling
      this.subject.style.transform = `matrix(${t[1]}, ${t[2]}, ${t[3]}, ${t[4]}, ${t[5]}, ${t[6] + this.currentPosition})`
    } else {
      // subject had no existing transform
      this.subject.style.transform = `translate3d(0, ${this.currentPosition}px, 0)`
    }
  }

  removeStyle() {
    this.subject.style.removeProperty('transform')

    if (!this.subject.getAttribute('style')) {
      this.subject.removeAttribute('style')
    }
  }

  // note: does this do much? for performance
  startObserve() {
    let callback = (entries, observer) => {
      entries.map(entry => {
        this.isInView = entry.isIntersecting
      })
    }
    let observer = new IntersectionObserver(callback)
    observer.observe(this.subject)
  }

  // bad idea to use publicly
  start() {
    this.isRunning = true
    this.setCurrentPos()
    this.update()
    this.subject.dataset.viscosity = 'is-running'
  }

  // bad idea to use publicly
  stop() {
    this.isRunning = false
    this.removeStyle()
    this.subject.dataset.viscosity = 'is-paused'
  }
}
