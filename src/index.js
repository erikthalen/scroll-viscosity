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
- transforms not set back on destroy (scale tested)
- strange behaviour after loads of resizes
- wrong placement when fonts aren't loaded

*/

import {ImagesLoaded, FontsLoaded} from "./assets-loaded";
import Animation from "./animation";
import onResize from "./resize";
import Copycat from "./copycat";
import SubjectStyling from "./subject-styling";

import { hasParentWithDataAttr, getStyleRefs, randomInt } from "./utils";

class Viscosity {
  constructor({element, easing, wacky}) {
    this.subject = element;
    this.easing = wacky
      ? randomInt(.05, .2)
      : easing || .3

    if (!this.subject) {
      return;
    }

    this.originalPlacement = getStyleRefs(this.subject);
    this.subject.dataset.viscosity = "is-bound";

    // todo: better callback, not using time
    // wait for all Viscosity to construct, before checking
    setTimeout(() => {
      if (hasParentWithDataAttr("viscosity", this.subject)) {
        this.subject.dataset.viscosity = "is-child";
        return;
      }
      ImagesLoaded(this).then(FontsLoaded).then(this.init.bind(this))
    });

    onResize(this._onResize.bind(this));
  }

  init() {
    SubjectStyling.setup(this);
    Copycat.create(this);
    Copycat.applyStyles(this);
    Animation.start(this);
    this.subject.dataset.viscosity = "is-running";
  }

  // revert everything back to normal
  destroy() {
    SubjectStyling.revert(this)
    Copycat.remove(this);
    Animation.stop(this);
    this.subject.dataset.viscosity = "is-destroyed";
  }

  // what to do on screen resize
  _onResize() {
    setTimeout(() => {
      this.originalPlacement = getStyleRefs(this.subject);
    });

    if (this.isRunning) {
      this.destroy();

      setTimeout(() => {
        this.init();
      });
    }
  }

  // turn the whole thing on/off
  toggle() {
    this.isRunning
      ? this.destroy()
      : this.init();
  }
}

export default function(args) {
  // selector-string passed
  if (typeof args === "string") {
    return [...document.querySelectorAll(args)].map(element => new Viscosity({element}));
  }

  // an element passed
  if (args.tagName) {
    return new Viscosity({element: args});
  }

  // object is passed
  if (typeof args === "object") {
    return new Viscosity(args);
  }
}
