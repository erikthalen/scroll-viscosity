/**
 * viscous
 *
 * Erik Thalén - erikthalen.com
 */

// what happens if one image is slow and one fast? regarding placement in dom
// todo: loads of (boring) integration tests 👀
// todo: publish 🥂🍾

// idea: create one 'central' controller that dispatches events and keep track of every instance,
// (good for having control to only run inits what all instanses are ready)

/**
 * what is this
 *
 * 1. the subject is taken out of the content flow (position: fixed).
 * 2. a copycat is created and placed in the content flow, where the subject subject was before.
 * 3. the subject is placed in the same position as is originally was (i.e. on top of the copycat)
 * 4. the subject is moved when the page is scrolled
 */

/**
known bugs:

- slight displacement of content that comes after a row of inline-block subjects. (not prio)

- existing transforms gets applied wrong
- transforms not set back on destroy
- strange behaviour after loads of resizes

*/

import ImagesLoaded from './images-loaded'
import Animation from './animation'
import Resize from './resize'
import Copycat from './copycat'
import Costume from './costume'

import {hasParentWithViscosity, getStyleRefs} from './utils'

class Viscosity {
  constructor({element, easing, wacky}) {
    this.subject = (typeof element === 'string')
      ? document.querySelector(element)
      : element
    this.easing = wacky
      ? (Math.random() * 1.5 + .5) / 10 // 0.05 - 0.2
      : easing
        ? easing
        : 0.3

    this.subject.dataset.viscosity = 'is-bound'

    if (!this.subject) {
      return
    }

    // reference to the original placement of the springy subject
    this._originalStyles = getStyleRefs(this.subject)


    // handles the movement of the subject
    this._animation = new Animation({element: this.subject, styles: this._originalStyles, easing: this.easing})

    // handles the element that takes up space in the dom
    this._copycat = new Copycat({element: this.subject, styles: this._originalStyles})

    // handles the styling of the subject, so it can move
    this._costume = new Costume({element: this.subject, styles: this._originalStyles})

	// handles the status if any images are loaded or not
	new ImagesLoaded({element: this.subject, callback: this.init.bind(this)})
    new Resize({callback: this._onResize.bind(this)})
  }

  init() {
    // todo: better callback, not using time
    // wait for all Viscosity to construct, before checking
    setTimeout(() => {
      if (hasParentWithViscosity(this.subject)) {
        this.subject.dataset.viscosity = 'is-child'
        return
      }

      this._costume.setup()
      this._copycat.create()
      this._animation.start()
      this.subject.dataset.viscosity = 'is-running'
    })
  }

  // revert everything back to normal
  destroy() {
    this._costume.revert()
    this._copycat.remove()
    this._animation.stop()
    this.subject.dataset.viscosity = 'is-destroyed'
  }

  // what to do on screen resize
  _onResize() {
    setTimeout(() => {
      this._originalStyles = getStyleRefs(this.subject)
      this._copycat.update({styles: this._originalStyles})
      this._costume.update({styles: this._originalStyles})
    })

    if (this._animation.isRunning) {
      this.destroy()

      setTimeout(() => {
        this.init()
      })
    }
  }

  // turn the whole thing on/off
  toggle() {
    this._animation.isRunning
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
