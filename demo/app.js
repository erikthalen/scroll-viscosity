import "./style.scss";

import viscosity from "./../src/index.js";

import ui from "./ui";
import swarm from "./swarm";

// init
swarm(document.querySelector(".swarm"), 50);

setTimeout(() => {
  const els = [...document.body.querySelectorAll(".viscosity")];
  const Vs = els.map(el =>
    viscosity({ element: el, easing: el.dataset.amount })
  );

  ui(Vs); // activate ui elements
});
