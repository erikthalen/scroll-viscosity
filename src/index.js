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
// import Mutations from './mutations'

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
      console.log('No subject! Cancelling')
      return
    }

    this.subject.dataset.viscosity = 'is-bound'

    // todo: better callback, not using time
    // wait for all Viscosity to construct, before checking
    assertThat(() => this.subject.dataset.viscosity === "is-bound").then(() => {
      AssetsLoaded(this).then(this.init.bind(this));
    });

    onResize(this.restart.bind(this))
  }

  init() {
    setTimeout(() => {
      getStyleRefs(this.subject).then(refs => {
        this.originalPlacement = refs

        if (!this.originalPlacement) {
          console.log(`Didn't get any style refs, just got: `, this.originalPlacement)
        }

        setTimeout(() => {
          if (hasParentWithDataAttr('viscosity', this.subject)) {
            this.subject.dataset.viscosity = 'is-child'
            return
          }

          SubjectStyling.setup(this)
          Copycat.create(this)
          Copycat.applyStyles(this)
          Animation.start(this)
          // Mutations.observe(this)
          this.subject.dataset.viscosity = 'is-running'
        }, 100)
      }, 100)
    })
  }

  destroy() {
    SubjectStyling.revert(this)
    Copycat.remove(this)
    Animation.stop(this)
    // Mutations.unobserve(this)
    this.subject.dataset.viscosity = 'is-destroyed'

    //assertThat(() => getStyleStr(this.subject, 'position') !== 'fixed').then(() => {
    setTimeout(() => {
      this.originalPlacement = undefined
    }, 10)
  }

  restart() {
    if (this.isRunning) {
      this.destroy()
      assertThat(() => typeof this.originalPlacement === 'undefined').then(this.init.bind(this))
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
