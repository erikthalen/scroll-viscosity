import {appendAfter, getStyleStr, isImage, checkForInlineStyle} from './utils';
import {COPYCAT_CLASS} from './constants'

// the copycat takes the subjects place
export default {
  // setup the element that will take up space in the dom tree
  create(viscosity) {
    viscosity.copycat = document.createElement('div');
    viscosity.copycat.innerHTML = String.fromCharCode(160) // a space
    viscosity.copycat.classList.add(COPYCAT_CLASS);
    appendAfter(viscosity.copycat)(viscosity.subject);
  },

  remove(viscosity) {
    viscosity.copycat.remove();
  },

  applyStyles(viscosity) {
    const {
      position,
      display,
      leftPos,
      topPos,
      bodyMargin,
      padding,
      borderWidth,
      widthPos,
      heightPos,
      float
    } = viscosity.originalPlacement;

    Object.assign(viscosity.copycat.style, {
      width: widthPos + 'px',
      height: heightPos + 'px',
      position: this._ifNot('static')(position),
      display: !isImage(viscosity.subject) && this._ifNot('list-item', 'block')(display) && (display === 'inline' && 'inline-block'),
      left: this._ifNot('static', 'relative')(position) && (
        (position === 'absolute')
        ? (leftPos - bodyMargin + 'px')
        : (leftPos + 'px')),
      top: this._ifNot('static', 'relative')(position) && this._accounted(viscosity, topPos) + 'px',
      margin: this._getMargins(viscosity),
      padding: (padding !== '0px' && borderWidth !== '0px') && parseFloat(padding) + parseFloat(borderWidth) + 'px',
      float: this._ifNot('none')(float)
    });
  },

  _getMargins(viscosity) {
    return `${this._getMargin(viscosity, 'Top')} ${this._getMargin(viscosity, 'Right')} ${this._getMargin(viscosity, 'Bottom')} ${this._getMargin(viscosity, 'Left')}`;
  },

  _getMargin(viscosity, direction) {
    if (checkForInlineStyle(viscosity.subject)) {
      return parseFloat(viscosity.originalPlacement[`margin${direction}`]);
    }

    return (Math.max(parseFloat(viscosity.originalPlacement[`margin${direction}`]), parseFloat(this._getChildMargin(viscosity.subject, direction))) + 'px');
  },

  _getChildMargin(subject, direction) {
    const firstOrLastChild = (direction === 'Top')
      ? 'firstElementChild'
      : (direction === 'Bottom')
        ? 'lastElementChild'
        : null

    if (!subject) {
      // console.log('Found no subject, found: ', subject)
      return
    }

    if (!firstOrLastChild) {
      return parseFloat(getStyleStr(subject, `margin${direction}`));
    }

    // does first child have children?
    if (firstOrLastChild && subject[firstOrLastChild] && subject[firstOrLastChild][firstOrLastChild]) {
      // then run fn with the child
      return this._getChildMargin(subject[firstOrLastChild], direction)
    } else if (firstOrLastChild && subject[firstOrLastChild]) {
      // else return child margin
      return parseFloat(getStyleStr(subject[firstOrLastChild], `margin${direction}`))
    }

  },

  _accounted(viscosity, topPos) {
    return checkForInlineStyle(viscosity.subject)
      ? topPos + viscosity.originalPlacement.bodyMargin
      : viscosity.originalPlacement.position === 'absolute'
        ? parseFloat(viscosity.originalPlacement.top)
        : topPos + viscosity.originalPlacement.bodyMargin;
  },

  _ifNot(...values) {
    return prop => values.includes(prop)
      ? null
      : prop
  }
}
