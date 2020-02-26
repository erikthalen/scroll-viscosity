export default class ImagesLoaded {
  constructor({element, callback}) {
    this.subject = element
    this.callback = callback
    this.images = (this.subject.tagName === 'IMG')
      ? [this.subject]
      : [...this.subject.querySelectorAll('img')]

    this.waitForAll(this.images).then(this.callback)
  }

  waitForAll(images) {
    return Promise.all(images.reduce((promises, img) => {
      if (img.complete)
        return promises

      promises.push(new Promise((resolve) => {
        img.onload = resolve
      }))

      return promises
    }, []))
  }
}
