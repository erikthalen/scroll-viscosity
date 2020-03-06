export default {
  callback(assertThat, resolve, mutationsList, observer) {
    if (assertThat()) {
      resolve()
      observer.disconnect()
    }
  },

  observe({what, assertThat}) {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      assertThat
    }
    return new Promise((resolve, reject) => {
      if (assertThat()) {
        resolve()
      } else {
        this.observer = new MutationObserver(this.callback.bind(this, assertThat, resolve))
        this.observer.observe(what, config)
      }
    })
  }
}
