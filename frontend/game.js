import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import fruitsInfo from "../common/fruits.js";

console.log(fruitsInfo);

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "white",
    width: 620,
    height: 850,
  },
});
