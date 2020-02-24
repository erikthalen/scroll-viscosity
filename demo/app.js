import './style.scss'

import imagesLoaded from 'imagesloaded'

import viscosity from './../src/index.js'

import ui from './ui'
import ruler from './ruler'
import swarm from './swarm'

// init
imagesLoaded('body', () => {
  swarm(document.querySelector('.swarm'), 50)
  setTimeout(() => {
    const els = [...document.body.querySelectorAll('.viscosity')]
    const Vs = els.map(el => viscosity({element: el, easing: el.dataset.amount}))
	ui(Vs) // activate ui elements
  }, 1000)

  // used for troubleshooting
  // ruler(100)  create visual 'ruler'
})
