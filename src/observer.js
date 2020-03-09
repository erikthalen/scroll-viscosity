export default {
  callback(until, resolveObserver, mutationsList, observer) {
    if (until()) {
      resolveObserver()
      observer.disconnect()
    }
  },

  observe({what, until}) {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      until
    }
    return new Promise((resolveObserver, reject) => {
      if (until()) {
        resolveObserver()
      } else {
        this.observer = new MutationObserver(this.callback.bind(this, until, resolveObserver))
        this.observer.observe(what, config)
      }
    })
  }
}
