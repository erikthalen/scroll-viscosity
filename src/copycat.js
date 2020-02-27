import { appendAfter, getStyleStr } from "./utils";

// the copycat takes the subjects place
export default class Copycat {
  constructor({ element, styles }) {
    this.subject = element;
    this.styles = styles;

    // relevant for inline-styled subjects
    this.child = this.subject.firstElementChild;
    this.isCollapsing = this.checkForInlineStyle();
  }

  // setup the subject that will take up space in the dom tree
  create() {
    this.copycat = document.createElement("div");
    this.copycat.classList.add("viscosity-copycat");
    this.applyStyles();
    appendAfter(this.copycat)(this.subject);
  }

  update({ styles }) {
    this.styles = styles;
    this.applyStyles.bind(this);
  }

  remove() {
    this.copycat.remove();
  }

  applyStyles() {
    const {
      position,
      width,
      height,
      display,
      leftPos,
      topPos,
      bodyMargin,
      padding
    } = this.styles;

    Object.assign(this.copycat.style, {
      width,
      height,
      position: position !== "static" && position,
      display:
        !this.isImage(this.subject) && display !== "list-item" && display,
      left: position === "absolute" ? leftPos - bodyMargin : leftPos + "px",
      top: this.accounted(topPos) + "px",
      margin: this.getMargins(),
      padding: padding !== "0px" && padding
    });
  }

  getMargins() {
    return `${this.getMargin("Top")} ${this.getMargin("Right")} ${this.getMargin("Bottom")} ${this.getMargin("Left")}`;
  }

  getMargin(direction) {
    if (this.isCollapsing) {
      return parseFloat(this.styles[`margin${direction}`]);
    }

    return (
      Math.max(
        parseFloat(this.styles[`margin${direction}`]),
        parseFloat(this.getChildMargin(direction))
      ) + "px"
    );
  }

  getChildMargin(direction) {
    return this.child
      ? parseFloat(getStyleStr(this.child, `margin${direction}`))
      : 0;
  }

  accounted(topPos) {
    return this.isCollapsing
      ? topPos + this.styles.bodyMargin
      : this.styles.position === "absolute"
      ? parseFloat(this.styles.top)
      : topPos;
  }

  checkForInlineStyle() {
    // todo: wtf is going on here
    return (
      this.isInline(this.subject) ||
      (this.child && this.isInline(this.child) && !this.isImage(this.child))
    );
  }

  isInline(el) {
    return getStyleStr(el, `display`).includes("inline");
  }

  isImage(el) {
    return el.tagName === "IMG";
  }
}
