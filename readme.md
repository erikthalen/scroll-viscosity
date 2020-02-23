# 🍯 Viscosity

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
