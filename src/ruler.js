const setStyle = el => {
  Object.assign(el.style, {
    position: 'absolute',
    right: 0,
    color: 'rgba(255, 0, 0, 0.3)',
    width: '100%',
    textAlign: 'right',
    borderTop: '1px dashed',
    zIndex: '-1'
  })
}

// easy way of making a long html list
export default function(n) {
  const fragment = new DocumentFragment()
  const container = document.createElement('ul')
  container.id = 'ruler'
  const els = Array(n).fill(0)
  els.forEach((slot, i) => {
    const el = document.createElement('li')
    el.innerHTML = i * 100
    setStyle(el)
    el.style.top = i * 100 + 'px'
    fragment.appendChild(el)
  })
  document.body.appendChild(container)
  container.appendChild(fragment)
}
