import './style.scss'

import imagesLoaded from 'images-loaded'
import Springy from './springy/springy'
import test from './springy/springy.test'
import ruler from './ruler'

ruler(100)

var imgs = document.querySelectorAll('img')

imagesLoaded('body').then(imgs => {
  // init
  const els = [...document.body.querySelectorAll(".springy")]
  const Ss = els.map(el => new Springy({
    element: el,
    easing: el.dataset.amount || 0.2
  }))

  // ui
  // const toggle = e => Springies.forEach(s => s.toggle())
  const toggleEl = document.querySelector(".toggle-springy")
  toggleEl.addEventListener("change", () => Ss.forEach(s => s.toggle()))

  const borders = e => document.body.classList.toggle("borders")
  const bordersEl = document.querySelector(".toggle-borders")
  bordersEl.addEventListener("change", borders)

  const ruler = e => document.body.classList.toggle("ruler")
  const rulerEl = document.querySelector(".toggle-ruler")
  rulerEl.addEventListener("change", ruler)
})
