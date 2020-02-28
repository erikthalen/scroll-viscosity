# 🍯 [wip] Viscosity

Makes an element react slower to scrolling,  
like it was put into honey.

```javascript
import viscosity from 'scroll-viscosity'

const element = document.querySelector('#viscosity')

// with an element
viscosity(element)

// with an object
viscosity({
  element,
  easing: 0.2,
})

// with a selector
viscosity('#viscosity')
```

## Options
Available when initializing with an object

```javascript
| Name   | type      | Default | Description                                        |
| ------ | --------- | ------- | -------------------------------------------------- |
| easing | {Number}  | 0.3     | How fast the element comes back in place           |
| wacky  | {Boolean} | false   | Gives the element a random easing between .05 - .2 |
```

## Hooks
```javascript
viscosity.destroy() // remove everything related to viscosity
viscosity.init() // only needed after destroy() has been called
viscosity.toggle() // either runs init() or destroy(), respectively
```
