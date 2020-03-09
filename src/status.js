export default {
  get(subject) {
    return subject.dataset.viscosity
  },
  set(subject, newStatus) {
    subject.dataset.viscosity = newStatus
  }
}
