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

var panel = new Panel(
  engine,
  30,
  700,
  0.8,
  render.options.width / 2,
  render.options.height / 2,
  "red");

Composite.add(world, panel.composite);

Composite.add(world, new Panel(
  engine,
  10,
  500,
  0.8,
  render.options.width / 2 + 500,
  render.options.height / 2,
  "orange").composite);

const placeholder_seed = "PS";
const fruits = placeholder_seed.split("-");
var currentFruit = 0;
panel.changeFruit(new Fruit(fruits[currentFruit], 0, 0));

var speed = 10

function dropFruit() {
  if (panel.currentFruit === null) {
    return;
  }
  panel.dropFruit();
  currentFruit += 1;
  if (currentFruit >= fruits.length) {
    currentFruit = 0;
  }
  setTimeout(() => {
    panel.changeFruit(
      new Fruit(fruits[currentFruit], 0, 0));
  }, "1000")
}

window.onkeydown = (event) => {
  if (event.key === "ArrowLeft") {
    panel.goLeft(speed);
  } else if (event.key === "ArrowRight") {
    panel.goRigth(speed);
  } else if (event.key === " ") {
    dropFruit();
  }
}
