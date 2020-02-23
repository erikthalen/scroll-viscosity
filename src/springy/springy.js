/**
 * Springy
 *
 * Erik Thalén - erikthalen.com
 */

// todo: move code relevant to 'child' to the correct place (everything is currently in 'placeholder.js')
// todo: loads of (boring) integration tests 👀
// todo: publish 🥂🍾

/**
 * tl:dr
 *
 * 1. the target is taken out of the content flow (position: fixed).
 * 2. a placement is created and placed in the content flow, where the target element was before.
 * 3. the target is placed in the same position as is originally was (i.e. on top of the placeholder)
 * 4. the target is moved when the page is scrolled
 */

/**
known bugs:

- slight displacement of content that comes after inline-block elements.

*/

import Animation from './animation'
import Resize from './resize'
import Placeholder from './placeholder'
import Element from './element'

import {getStyleRefs} from './utils'

export default class Springy {
  constructor({element, easing}) {
    this.element = element
    this.easing = easing || 0.3

    if (!this.element) {
      return
    }

    // reference to the original placement of the springy element
    this.originalStyles = getStyleRefs(this.element)

    // handles the movement of the springy element
    this.animation = new Animation({el: this.element, easing: this.easing})

    // handles resizing of the screen
    this.resize = new Resize({callback: this.onResize.bind(this)})

    // handles the placeholder that will take up space in the dom
    this.placeholder = new Placeholder({el: this.element, styles: this.originalStyles})

    // handles the original element, that will move
    this.springyElement = new Element({el: this.element, styles: this.originalStyles})

    this.init()
  }

  init() {
    // todo: 'global' handler to save every Springy instance's style before messing with the content flow
    setTimeout(() => {
      this.springyElement.setup()
      this.placeholder.create()
      this.animation.start()
    })
  }

  // revert everything back to normal
  destroy() {
    this.springyElement.revert()
    this.placeholder.remove()
    this.animation.stop()
  }

  // what to do on screen resize
  onResize() {
    this.destroy()

    setTimeout(() => {
      this.originalStyles = getStyleRefs(this.element)
      this.placeholder.update({styles: this.originalStyles})
      this.springyElement.update({styles: this.originalStyles})
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
