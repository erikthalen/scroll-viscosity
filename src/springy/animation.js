/**
 * handles the funny part
 *
 * can be set to on/off
 */

export default class Animation {
  constructor({el, easing}) {
    this.element = el
    this.easing = easing

    this.isRunning = false,
    this.isInView = true
    this.setCurrentPos() // for lerping
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
    this.element.style.transform = `translateY(${this.currentPosition}px)`
  }

  // does this do much? for performance
  startObserve() {
    let callback = (entries, observer) => {
      entries.map(entry => {
        this.isInView = entry.isIntersecting
      })
    }
    let observer = new IntersectionObserver(callback)
    observer.observe(this.element)
  }

  start() {
    this.isRunning = true
    this.update()
  }

  stop() {
    this.isRunning = false
  }
}
