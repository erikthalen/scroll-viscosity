/**
 * Viscosity
 *
 * Erik Thalén - erikthalen.com
 */

// import "regenerator-runtime/runtime";

import AssetsLoaded from './assets-loaded'
import Animation from './animation'
import onResize from './resize'
import Copycat from './copycat'
import SubjectStyling from './subject-styling'
import Observer from './observer'

import {
  hasParentWithDataAttr,
  getStyleRefs,
  randomInt,
  assertThat,
  copycatIsGone,
  getStyleStr
} from './utils'

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
      assertThat: () => this.subject.dataset.viscosity === "is-bound"
    }).then(() => {
      AssetsLoaded(this).then(this.init.bind(this));
    })

    this.subject.dataset.viscosity = 'is-bound'

    onResize(this.restart.bind(this))
  }

  init() {
    setTimeout(() => {
      getStyleRefs(this.subject).then(refs => {
        this.originalPlacement = refs

        setTimeout(() => {
          if (hasParentWithDataAttr('viscosity', this.subject)) {
            this.subject.dataset.viscosity = 'is-child'
            return
          }

          SubjectStyling.setup(this)
          Copycat.create(this)
          Copycat.applyStyles(this)
          Animation.start(this)
          this.subject.dataset.viscosity = 'is-running'
        }, 100)
      })
    }, 100)
  }

  destroy() {
    SubjectStyling.revert(this)
    Copycat.remove(this)
    Animation.stop(this)
    this.subject.dataset.viscosity = 'is-destroyed'
  }

  restart() {
    if (Animation.isRunning(this)) {
      this.destroy()

      Observer.observe({
        what: this.subject.parentElement,
        assertThat: () => !this.subject.parentElement.querySelector(`[data-id='${Copycat.getId(this)}']`)
      }).then(this.init.bind(this))
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
