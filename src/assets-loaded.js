const asyncAllIsLoaded = (images) => {
  return Promise.all(images.reduce((promises, img) => {
    if (img.complete)
      return promises

    promises.push(new Promise((resolve) => {
      img.onload = resolve
    }))

    return promises
  }, []))
}

export function ImagesLoaded(that) {
  const images = (that.subject.tagName === 'IMG')
    ? [that.subject]
    : [...that.subject.querySelectorAll('img')]

  return asyncAllIsLoaded(images)
}

// gets called when the first font is loaded, not the right one
export function FontsLoaded() {
  return document.fonts.status === 'loaded'
    ? Promise.resolve(true)
    : document.fonts.ready
}
