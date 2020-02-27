import {appendAfter, getStyleStr, isInline, isImage, checkForInlineStyle} from "./utils";

// the copycat takes the subjects place
export default {
  // setup the element that will take up space in the dom tree
  create(viscosity) {
    viscosity.copycat = document.createElement("div");
    viscosity.copycat.classList.add("viscosity-copycat");
    this.applyStyles(viscosity);
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
      position: position !== "static" && position,
      display: !isImage(viscosity.subject) && display !== "list-item" && display,
      left: position === "absolute"
        ? leftPos - bodyMargin
        : leftPos + "px",
      top: this.accounted(viscosity, topPos) + "px",
      margin: this.getMargins(viscosity),
      padding: padding !== "0px" && padding
    });
  },

  getMargins(viscosity) {
    return `${this.getMargin(viscosity, "Top")} ${this.getMargin(viscosity, "Right")} ${this.getMargin(viscosity, "Bottom")} ${this.getMargin(viscosity, "Left")}`;
  },

  getMargin(viscosity, direction) {
    if (checkForInlineStyle(viscosity.subject)) {
      return parseFloat(viscosity.originalPlacement[`margin${direction}`]);
    }

    return (Math.max(parseFloat(viscosity.originalPlacement[`margin${direction}`]), parseFloat(this.getChildMargin(viscosity, direction))) + "px");
  },

  getChildMargin(viscosity, direction) {
    return viscosity.firstElementChild
      ? parseFloat(getStyleStr(viscosity.firstElementChild, `margin${direction}`))
      : 0;
  },

  accounted(viscosity, topPos) {
    return checkForInlineStyle(viscosity.subject)
      ? topPos + viscosity.originalPlacement.bodyMargin
      : viscosity.originalPlacement.position === "absolute"
        ? parseFloat(viscosity.originalPlacement.top)
        : topPos;
  }
}
