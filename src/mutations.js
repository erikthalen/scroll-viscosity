import {getStyleStr} from './utils'

export default {
  config: {
    attributes: true,
    childList: true,
    subtree: true
  },

  callback(mutationsList, observer) {
    if (!mutationsList[0].target || !this.size) {
      return
    }

    if (this.isRunning && this.size.width !== getStyleStr(mutationsList[0].target, 'width') || this.size.height !== getStyleStr(mutationsList[0].target, 'height')) {
      setTimeout(() => this._restart())

      this.size = {
        width: getStyleStr(mutationsList[0].target, 'width'),
        height: getStyleStr(mutationsList[0].target, 'height')
      }
    }
  },

  observe(viscosity) {
    viscosity.size = {
      width: getStyleStr(viscosity.subject, 'width'),
      height: getStyleStr(viscosity.subject, 'height')
    }
    this.observer = new MutationObserver(this.callback.bind(viscosity))
    this.observer.observe(viscosity.subject, this.config)
  },

  unobserve() {
    this.observer.disconnect()
  }
}
