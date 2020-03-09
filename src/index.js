/**
 * Viscosity
 *
 * Erik Thalén - erikthalen.com
 */

import AssetsLoaded from './assets-loaded'
import Animation from './animation'
import onResize from './resize'
import Copycat from './copycat'
import SubjectStyling from './subject-styling'
import Observer from './observer'
import Status from './status'

import {hasParent, getStyleRefs, randomInt} from './utils'

class Viscosity {
  constructor({element, easing, wacky}) {
    this.subject = element
    this.easing = wacky
      ? randomInt(.1, .25)
      : easing || .3

    if (!this.subject) {
      return
    }

    Observer.observe({
      what: this.subject.parentElement,
      until: () => Status.get(this.subject) === "is-bound"
    }).then(AssetsLoaded(this).then(this.init.bind(this)))

    Status.set(this.subject, 'is-bound')

    onResize(this.restart.bind(this))
  }

  init() {
    getStyleRefs(this.subject).then(refs => {
      this.originalPlacement = refs

      if (hasParent('viscosity', this.subject)) {
        Status.set(this.subject, 'is-child')
        return
      }

      setTimeout(() => {
        SubjectStyling.setup(this)
        Copycat.create(this)
        Copycat.applyStyles(this)
        Animation.start(this)
        Status.set(this.subject, 'is-running')
        // console.log('id: ', this, Copycat.getId(this))
      }, 10)
    })
  }

  destroy() {
    SubjectStyling.revert(this)
    Copycat.remove(this)
    Animation.stop(this)
    Status.set(this.subject, 'is-destroyed')
  }

  restart() {
    if (Animation.isRunning(this)) {
      this.destroy()

      Copycat.subscribe(this, () => {
        Observer.observe({
          what: this.subject.parentElement,
          until: () => !this.subject.parentElement.querySelector(`[data-id='${Copycat.getId(this)}']`)
        }).then(() => {
          // console.log(Copycat.getId(this))
          Copycat.unsubscribe(this)
          this.init()
        })
      })
    }
  }

  toggle() {
    Animation.isRunning(this)
      ? this.destroy()
      : this.init()
  }
}

export default function(args) {
  // selector-string passed
  if (typeof args === 'string') {
    return [...document.querySelectorAll(args)].map(element => new Viscosity({element}))
  }

  // an element passed
  if (args.tagName) {
    return new Viscosity({element: args})
  }

  // object is passed
  if (typeof args === 'object') {
    return new Viscosity(args)
  }
}
