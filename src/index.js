/**
 * Viscosity
 *
 * Erik Thalén - erikthalen.com
 */

import AssetsLoaded from './assets-loaded'
import Animation from './animation'
import Resize from './resize'
import Copycat from './copycat'
import SubjectStyling from './subject-styling'
import Observer from './observer'
import Status from './status'

import { hasParent, getStyleRefs, randomInt } from './utils'

class Viscosity {
  constructor({ element, easing, wacky }) {
    this.subject = element
    this.easing = wacky ? randomInt(0.1, 0.25) : easing || 0.3

    if (!this.subject) {
      return
    }

    Observer.observe({
      what: this.subject.parentElement,
      until: () => Status.get(this.subject) === 'is-bound',
    }).then(AssetsLoaded(this).then(this.init.bind(this)))

    Status.set(this.subject, 'is-bound')

    Resize(this.restart.bind(this))
  }

  init() {
    getStyleRefs(this.subject).then(refs => {
      this.originalPlacement = refs

      if (hasParent('viscosity', this.subject)) {
        Status.set(this.subject, 'is-child')
        return
      }

      SubjectStyling.setup(this)
      Copycat.create(this)
      Animation.start(this)
      Status.set(this.subject, 'is-running')
    })
  }

  destroy() {
    SubjectStyling.revert(this)
    Copycat.remove(this)
    Animation.stop(this)
    Status.set(this.subject, 'is-destroyed')
  }

  restart() {
    if (!Animation.isRunning(this)) {
      return
    }

    // Copycat.subscribe(this, () => {
    //   Observer.observe({
    //     what: this.subject.parentElement,
    //     until: () => !this.subject.parentElement.querySelector(`[data-id='${Copycat.getId(this)}']`)
    //   }).then(() => {
    //     Copycat.unsubscribe(this)
    //     this.init()
    //   })
    // })
    
    this.destroy()
    setTimeout(this.init.bind(this), 250)
  }

  toggle() {
    Animation.isRunning(this) ? this.destroy() : this.init()
  }
}

export default function (args) {
  // selector-string passed
  if (typeof args === 'string') {
    return [...document.querySelectorAll(args)].map(
      element => new Viscosity({ element })
    )
  }

  // an element passed
  if (args.tagName) {
    return new Viscosity({ element: args })
  }

  // object is passed
  if (typeof args === 'object') {
    return new Viscosity(args)
  }
}
