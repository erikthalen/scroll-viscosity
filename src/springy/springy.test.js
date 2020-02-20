// todo: this test file, if it's worth it

const styleFloat = (el, prop) => parseFloat(style(el, prop))
const getAll = (els, prop) => els.map(el => styleFloat(el, prop))
const isBelowOneDiff = (x, y) => Math.abs(x - y) < 1
const style = (el, prop) => {
	return prop === 'top'
	? el.getBoundingClientRect().top + window.pageYOffset + styleFloat(el, 'marginTop') + styleFloat(el, 'paddingTop')
	: window.getComputedStyle(el)[prop]
}

export default function(Ss) {
  const els = Ss.map(s => s.element)

  // save 'before' ref
  const tops = getAll(els, 'top')

  Ss.map(s => s.toggle())

  // save 'after' ref
  const newTops = getAll(els, 'top')

  // check if they match
  tops.forEach((top, i) => {
    if (!isBelowOneDiff(newTops[i], top)) {
      console.warn('fail: ', els[i], newTops[i], top)
    } else {
      // console.log('YEP: ', els[i], newTops[i], top)
    }
  })
}
