export default function ui(Vs) {
  // const toggle = e => Springies.forEach(s => s.toggle())
  const toggleEl = document.querySelector(".toggle-viscosity")
  if (toggleEl)
    toggleEl.addEventListener("change", () => Vs.forEach(s => s.animation.stop()))

  const borders = e => document.body.classList.toggle("borders")
  const bordersEl = document.querySelector(".toggle-borders")
  if (bordersEl)
    bordersEl.addEventListener("change", borders)

  const ruler = e => document.body.classList.toggle("ruler")
  const rulerEl = document.querySelector(".toggle-ruler")
  if (rulerEl)
    rulerEl.addEventListener("change", ruler)
}
