/**
 * debounced callback
 */
export default function Resize(callback) {
  let resizeTimer = null

  window.addEventListener("resize", e => {
    clearTimeout(resizeTimer) // quick and dirty debounce

    resizeTimer = setTimeout(() => {
      callback()
    }, 250)
  })
}
