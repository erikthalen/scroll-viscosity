import {appendAfter, getStyleStr, isInline, isImage, checkForInlineStyle} from './utils';

// the copycat takes the subjects place
export default {
  // setup the element that will take up space in the dom tree
  create(viscosity) {
    viscosity.copycat = document.createElement('div');
    viscosity.copycat.classList.add('viscosity-copycat');
    appendAfter(viscosity.copycat)(viscosity.subject);
  },

  remove(viscosity) {
    viscosity.copycat.remove();
  },

  applyStyles(viscosity) {
    const {
      position,
      width,
      height,
      display,
      leftPos,
      topPos,
      bodyMargin,
      padding
    } = viscosity.originalPlacement;

    Object.assign(viscosity.copycat.style, {
      width,
      height,
      position: position !== 'static' && position,
      display: !isImage(viscosity.subject) && display !== 'list-item' && display,
      left: position === 'static'
        ? null
        : position === 'absolute'
          ? leftPos - bodyMargin
          : leftPos + 'px',
      top: position === 'static'
        ? null
        : this._accounted(viscosity, topPos) + 'px',
      margin: this._getMargins(viscosity),
      padding: padding !== '0px' && padding
    });
  },

  _getMargins(viscosity) {
    return `${this._getMargin(viscosity, 'Top')} ${this._getMargin(viscosity, 'Right')} ${this._getMargin(viscosity, 'Bottom')} ${this._getMargin(viscosity, 'Left')}`;
  },

  _getMargin(viscosity, direction) {
    if (checkForInlineStyle(viscosity.subject)) {
      return parseFloat(viscosity.originalPlacement[`margin${direction}`]);
    }

    return (Math.max(parseFloat(viscosity.originalPlacement[`margin${direction}`]), parseFloat(this._getChildMargin(viscosity, direction))) + 'px');
  },

  _getChildMargin(viscosity, direction) {
    const firstOrLast = (direction === 'Top')
      ? 'firstElementChild'
      : (direction === 'Bottom')
        ? 'lastElementChild'
        : null

    // does first child have children?
    if (firstOrLast && viscosity.subject[firstOrLast] && viscosity.subject[firstOrLast][firstOrLast]) {
      // then run fn with the child
      return this._getChildMargin(viscosity.subject[firstOrLast], direction)
  } else if (firstOrLast && viscosity.subject[firstOrLast]) {
      // else return child margin
      return parseFloat(getStyleStr(viscosity.subject[firstOrLast], `margin${direction}`))
    }

    return parseFloat(getStyleStr(viscosity.subject, `margin${direction}`));

  },

  _accounted(viscosity, topPos) {
    return checkForInlineStyle(viscosity.subject)
      ? topPos + viscosity.originalPlacement.bodyMargin
      : viscosity.originalPlacement.position === 'absolute'
        ? parseFloat(viscosity.originalPlacement.top)
        : topPos + viscosity.originalPlacement.bodyMargin;
  }
}
