import {sumAsFloat} from './utils'

export default {
  setup(viscosity) {
    const {
      topPos,
      leftPos,
      marginTop,
      marginLeft,
      paddingTop,
      paddingLeft,
      widthRect,
      heightRect
    } = viscosity.originalPlacement

    Object.assign(viscosity.subject.style, {
      position: 'fixed',
      width: widthRect + 'px',
      height: heightRect + 'px',
      top: topPos - parseFloat(paddingTop) + 'px',
      left: leftPos - parseFloat(marginLeft) - parseFloat(paddingLeft) + 'px'
    })

	// note: why was this needed?
    // if (viscosity.subject.firstElementChild) {
    //   setTimeout(() => viscosity.subject.firstElementChild.style.marginTop = 0)
    // }
  },

  revert(viscosity) {
    const to = viscosity.originalPlacement.inlineStyle
    setTimeout(() => {
      if (!to) {
        viscosity.subject.removeAttribute('style')
      } else {
        viscosity.subject.style.cssText = to
      }
    })

    // if (viscosity.subject.firstElementChild)
    //   viscosity.subject.firstElementChild.style.removeProperty('margin-top')
  }
}
