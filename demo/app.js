import './style.scss'

import viscosity from './../src/index.js'

import ui from './ui'
import swarm from './swarm'

swarm(document.querySelector('.swarm'), 50)

setTimeout(() => {
  const els = [...document.body.querySelectorAll('.viscosity')]
  const Vs = els.map(element => viscosity({element, easing: element.dataset.amount}))

  ui(Vs)
}, 100)
