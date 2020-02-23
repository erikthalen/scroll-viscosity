import './style.scss'

import imagesLoaded from 'images-loaded'

import viscosity from './viscosity/viscosity'

import ui from './demo/ui'
import ruler from './demo/ruler'

var imgs = document.querySelectorAll('img')

imagesLoaded('body').then(imgs => {
  // init
  const els = [...document.body.querySelectorAll(".viscosity")]
  const Vs = els.map(el => viscosity({
    element: el,
    easing: el.dataset.amount
  }))

  // used for troubleshooting
  ruler(100) // create visual 'ruler'
  ui(Vs) // activate ui elements
})
