import {removeInlineStyles, sumAsFloat, getStyleStr, isInline, checkForInlineStyle} from './utils'

export default {
  setup(viscosity) {
    const {
      topPos,
      paddingTop,
      marginLeft,
      leftPos,
      rightPos,
      width,
      height,
      margin
    } = viscosity.originalPlacement

    Object.assign(viscosity.subject.style, {
      width,
      height,
      position: "fixed",
      top: sumAsFloat(topPos, paddingTop) + 'px',
      left: leftPos - parseFloat(marginLeft) + 'px',
      // right: rightPos + 'px',
      margin: margin !== '0px' && margin
    })

    if (viscosity.subject.firstElementChild && checkForInlineStyle(viscosity.subject))
      setTimeout(() => viscosity.subject.firstElementChild.style.marginTop = 0)
  },

  revert(viscosity) {
    removeInlineStyles(viscosity.subject, [
      'position',
      'top',
      'left',
      // 'right',
      'width',
      'height',
      'margin'
    ])

    viscosity.subject.style.cssText = viscosity.originalPlacement.inline

    if (viscosity.subject.firstElementChild && checkForInlineStyle(viscosity.subject))
      viscosity.subject.firstElementChild.style.removeProperty('margin-top')
  }
}
