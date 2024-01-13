import { Bodies, Body, Engine, Events, Render, Runner, World, Composite } from "matter-js";
import Panel from "/panel.js";
import Fruit from "/fruit.js";

const engine = Engine.create(),
  world = engine.world;

// TODO change width and height to be dynamic
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "black",
    width: 1500,
    height: 900,
  },
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

var panel = new Panel(30, 700, 0.8, render.options.width / 2, render.options.height / 2, "red");
Composite.add(world, panel.composite);

var fruit = new Fruit("Cherries", panel.left, 0);
panel.changeFruit(fruit);

var speed = 10

window.onkeydown = (event) => {
  if (event.key === "ArrowLeft") {
    panel.goLeft(speed);
  } else if (event.key === "ArrowRight") {
    panel.goRigth(speed);
  } else if (event.key === " ") {
    panel.dropFruit();
  }
}
