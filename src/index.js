/**
 * Viscosity
 *
 * Erik Thalén - erikthalen.com
 */

/**
known bugs:

- slight displacement of content that comes after a row of inline-block subjects. (not prio)

- existing transforms gets applied wrong (transform origin)
- animation-restarter gives wrong margins

*/

import AssetsLoaded from './assets-loaded'
import Animation from './animation'
import onResize from './resize'
import Copycat from './copycat'
import SubjectStyling from './subject-styling'

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
      ? randomInt(.05, .2)
      : easing || .3

    if (!this.subject) {
      return
    }

    this.subject.dataset.viscosity = 'is-bound'

    // todo: better callback, not using time
    // wait for all Viscosity to construct, before checking
    setTimeout(() => {
      AssetsLoaded(this).then(this.init.bind(this))
    })

    onResize(this._restart.bind(this))
  }

  init() {
    assertThat(typeof this.originalPlacement === 'undefined').then(() => {
      this.originalPlacement = getStyleRefs(this.subject)

      assertThat(typeof this.originalPlacement === 'object' && copycatIsGone(this)).then(() => {
        if (hasParentWithDataAttr('viscosity', this.subject)) {
          this.subject.dataset.viscosity = 'is-child'
          return
        }

        SubjectStyling.setup(this)
        Copycat.create(this)
        Copycat.applyStyles(this)
        Animation.start(this)
        this.subject.dataset.viscosity = 'is-running'
      })
    })
  }

  destroy() {
    SubjectStyling.revert(this)
    Copycat.remove(this)
    Animation.stop(this)
    this.subject.dataset.viscosity = 'is-destroyed'
    // assertThat(getStyleStr(this.subject, 'position') !== 'fixed').then(() => {
    setTimeout(() => {
      this.originalPlacement = undefined
    }, 10)
    // })
  }

  _restart() {
    if (this.isRunning) {
      this.destroy()
      setTimeout(this.init.bind(this), 1000)
    }
  }

  toggle() {
    this.isRunning
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
