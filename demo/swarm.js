import beeImg from './bee.png'

const makeOne = (fragment) => {
  const img = document.createElement('img')
  const size = Math.floor(Math.random() * 30 + 15)
  img.src = beeImg

  Object.assign(img.style, {
    top: Math.random() * (window.innerHeight / (window.innerHeight / 100)) * .7 + '%',
    left: Math.random() * (window.innerWidth / (window.innerWidth / 100)) * .9 + 5 + '%',
    width: size,
    height: size,
    transform: (Math.random() > .5) && 'scaleX(-1)'
  })
  img.classList.add('viscosity')
  img.dataset.amount = (Math.random() * 1.5 + .5) / 10 // size / 100
  fragment.appendChild(img)
}

export default function swarm(container, amount) {
  const fragment = new DocumentFragment()
  const swarm = Array(amount).fill('')
  swarm.map(() => makeOne(fragment))
  container.appendChild(fragment)
}
