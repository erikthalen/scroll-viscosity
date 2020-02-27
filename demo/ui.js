export default function ui(Vs) {
  const toggleEl = document.querySelector(".toggle-effect")
  if (toggleEl)
    toggleEl.addEventListener("change", () => Vs.forEach(s => s.toggle()))
}
