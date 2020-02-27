# 🍯 [wip] Viscosity

Makes an element react slower to scrolling,  
like it was put into honey.

```javascript
import viscosity from 'scroll-viscosity'

// with an element
const element = document.querySelector('#viscosity')
viscosity(element)

// with an object
viscosity({
  element,
  easing: 0.2,
})

// with a selector
viscosity('#viscosity')
```

## Hooks
```javascript
viscosity.destroy() // remove everything related to viscosity
viscosity.init() // only needed after destroy() has been called
viscosity.toggle() // either runs init() or destroy(), respectively
```
