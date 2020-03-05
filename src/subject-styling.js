import {sumAsFloat} from './utils'

export default {
  setup(viscosity) {
    const {
      topPos,
      paddingTop,
      marginLeft,
      leftPos,
      margin,
      widthPos,
      heightPos
    } = viscosity.originalPlacement

    Object.assign(viscosity.subject.style, {
      position: 'fixed',
      width: widthPos + 'px',
      height: heightPos + 'px',
      top: sumAsFloat(topPos, paddingTop) + 'px',
      left: leftPos - parseFloat(marginLeft) + 'px',
      margin: margin !== '0px' && margin,
    })

    if (viscosity.subject.firstElementChild) {
      setTimeout(() => viscosity.subject.firstElementChild.style.marginTop = 0)
    }
  },

  revert(viscosity) {
    setTimeout(() => viscosity.subject.style.cssText = viscosity.originalPlacement.inlineStyle)

    if (viscosity.subject.firstElementChild)
      viscosity.subject.firstElementChild.style.removeProperty('margin-top')
  }
}
