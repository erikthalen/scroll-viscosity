import {sumAsFloat} from './utils'

export default {
  setup(viscosity) {
    const {
      topPos,
      paddingTop,
      marginLeft,
      leftPos,
      width,
      height,
      margin
    } = viscosity.originalPlacement

    Object.assign(viscosity.subject.style, {
      position: 'fixed',
      width,
      height,
      top: sumAsFloat(topPos, paddingTop) + 'px',
      left: leftPos - parseFloat(marginLeft) + 'px',
      margin: margin !== '0px' && margin
    })

    if (viscosity.subject.firstElementChild) {
      setTimeout(() => viscosity.subject.firstElementChild.style.margin = 0)
    }
  },

  revert(viscosity) {
    setTimeout(() => viscosity.subject.style.cssText = viscosity.originalPlacement.inline)

    if (viscosity.subject.firstElementChild)
      viscosity.subject.firstElementChild.style.removeProperty('margin')
  }
}
