import './style.scss'

import viscosity from './../src/index.js'

import ui from './ui'
import swarm from './swarm'

swarm(document.querySelector('.swarm'), 50)

setTimeout(() => {
  const els = [...document.body.querySelectorAll('.viscosity')]
  const Vs = els.map(element => viscosity({element, easing: element.dataset.amount, wacky: element.dataset.wacky}))

  document.body.addEventListener('click', () => {
    if (!document.body.querySelector('.full'))
      return
    document.body.querySelector('.full').classList.toggle('hidden')
  })

  ui(Vs)
}, 100)
