/**
 * viscous
 *
 * Erik Thalén - erikthalen.com
 */

// todo: consider having an onload handler integrated in the plugin
// todo: loads of (boring) integration tests 👀
// todo: publish 🥂🍾

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

- slight displacement of content that comes after a row of inline-block subjects.
- the easing goes to default after resize (i think)

*/

import imagesLoaded from 'imagesloaded'

import Animation from './animation'
import Resize from './resize'
import Copycat from './copycat'
import Costume from './costume'

import {hasParentWithViscosity, getStyleRefs} from './utils'

class Viscosity {
  constructor({element, easing}) {
    this.subject = element
    this.easing = easing || 0.3

    this.subject.dataset.viscosity = 'is-bound'

    if (!this.subject) {
      return
    }

    // reference to the original placement of the springy subject
    this.originalStyles = getStyleRefs(this.subject)

    // handles the movement of the subject
    this.animation = new Animation({element: this.subject, easing: this.easing})

    // handles resizing of the screen
    this.resize = new Resize({callback: this.onResize.bind(this)})

    // handles the element that takes up space in the dom
    this.copycat = new Copycat({element: this.subject, styles: this.originalStyles})

    // handles the styling of the subject, so it can move
    this.costume = new Costume({element: this.subject, styles: this.originalStyles})

    // todo: fails on first pageload
    // imagesLoaded(this.subject, this.init.bind(this))

    // todo: better callback, not using time
    // wait for all Viscosity to construct, before checking
    setTimeout(() => {
      if (hasParentWithViscosity(this.subject)) {
        this.subject.dataset.viscosity = 'controlled-by-parent'
        return
      }

      this.init()
    }, 100)
  }

  init() {
    setTimeout(() => {
      if (hasParentWithViscosity(this.subject)) {
        return
      }
      // todo: 'global' handler to save every viscous instance's style before messing with the content flow

      this.costume.setup()
      this.copycat.create()
      this.animation.start()
    }, 10)
  }

  // revert everything back to normal
  destroy() {
    this.costume.revert()
    this.copycat.remove()
    this.animation.stop()
    this.subject.dataset.viscosity = 'is-destroyed'
  }

  // what to do on screen resize
  onResize() {
    if (!this.animation.isRunning)
      return

    this.destroy()

    setTimeout(() => {
      this.originalStyles = getStyleRefs(this.subject)
      this.copycat.update({styles: this.originalStyles})
      this.costume.update({styles: this.originalStyles})
      this.init()
    })
  }

  // turn the whole thing on/off
  toggle() {
    this.animation.isRunning
      ? this.destroy()
      : this.init()
  }
}

export default function({element, easing}) {
  return new Viscosity({element, easing})
}
