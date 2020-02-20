/**
 * runs a callback on resize
 * used an easy debounce timer
 */

export default class Resize {
  constructor({callback}) {
    this.callback = callback
    this.resizeTimer = null

    window.addEventListener("resize", e => {
      clearTimeout(this.resizeTimer) // quick and dirty debounce

      this.resizeTimer = setTimeout(() => {
        this.callback()
      }, 250)

    })
  }
}
