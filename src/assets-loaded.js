const asyncAllIsLoaded = images => {
  return Promise.all(
    images.reduce((promises, img) => {
      if (img.complete) return promises

      promises.push(
        new Promise(resolve => {
          img.onload = resolve
        })
      )

      return promises
    }, [])
  )
}

export function ImagesLoaded(viscosity) {
  const images =
    viscosity.subject.tagName === 'IMG'
      ? [viscosity.subject]
      : [...viscosity.subject.querySelectorAll('img')]

  return asyncAllIsLoaded(images)
}

export function FontsLoaded() {
  return document.fonts.status === 'loaded'
    ? Promise.resolve(true)
    : document.fonts.ready
}

export default function (viscosity) {
  return ImagesLoaded(viscosity).then(FontsLoaded)
}
