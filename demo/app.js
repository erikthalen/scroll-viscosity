import './style.scss'

import imagesLoaded from 'imagesloaded'

import viscosity from './../src/index.js'

import ui from './ui'
import ruler from './ruler'

var imgs = document.querySelectorAll('img')

// init
imagesLoaded('body', () => {
  const els = [...document.body.querySelectorAll('.viscosity')]
  const Vs = els.map(el => viscosity({element: el, wacky: true}))

  // used for troubleshooting
  ruler(100) // create visual 'ruler'
  ui(Vs) // activate ui elements
})
