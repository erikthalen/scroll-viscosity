![Screenshot of the plugin](https://i.ibb.co/CBnbxXQ/screenshot.jpg "Screenshot")

# Viscosity

### 🐝 [Demo](http://www.erikthalen.com/bodega/viscosity)  🐝

Makes an element react slower to scrolling,  
like it was put into honey.

```bash
npm install --save scroll-viscosity
```

```bash
yarn add scroll-viscosity
```

```javascript
import viscosity from 'scroll-viscosity'

const element = document.querySelector('#viscosity')

// with an element
let instance = viscosity(element)

// with an object
let instance = viscosity({
  element,
  easing: 0.2,
})

// with a selector
let instance = viscosity('#viscosity')
```

## Options
Available when initializing with an object

| Name   | type      | Default | Description                                          |
| ------ | --------- | ------- | ---------------------------------------------------- |
| easing | {Number}  | 0.3     | How fast the element comes back in place             |
| wacky  | {Boolean} | false   | Gives the element a random easing between .1 and .25 |

## Hooks
```javascript
instance.destroy() // remove everything related to viscosity
instance.init() // only needed after destroy() has been called
instance.restart() // restarts the application
instance.toggle() // either runs init() or destroy(), respectively
```


### Todo:
- ~~Handle inline elements (calc correct w/h)~~
- ~~Don't reposition elements that's out of view~~
- ~~MutationObserver for elements entering the dom~~
- Create bookmarklet for easier testing/it's cool
- Make into custom element(?)

#### Known bugs:
- slight displacement of content that comes after a row of inline-block subjects. (not prio)
- existing advanced transforms gets placed wrong (skew/rotate)
- when element changes 'display', it isn't updated (out of scope?)
