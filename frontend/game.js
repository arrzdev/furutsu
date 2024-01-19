import { Engine, Render, Runner, World, Composite } from "matter-js";
import Panel from "/panel.js";
import fruitsInfo from "../common/fruits.js";

class GameMode {
  constructor(fruitsInfo) {
    this.inputDelay = 900;
    let engine = Engine.create();
    this.engine = engine;
    this.world = this.engine.world;
    this.state = "loading"

    // TODO change width and height to be dynamic
    let render = Render.create({
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

    let runner = Runner.create();
    Runner.run(runner, engine);
    this.speed = 10

    this.fruitsInfo = fruitsInfo;
    this.loadFruits().then(() => {
      this.panel = new Panel(
        this,
        30,
        700,
        0.8,
        render.options.width / 2,
        0.55 * render.options.height,
        "orange",
        this.fruitsInfo);

      Composite.add(this.world, this.panel.composite);

      // this.fruits = seed.split("-");
      // this.currentFruit = 0;
      this.panel.changeFruit(this.getRandomFruit(4));
      this.state = "play";
    });
  }

  getRandomFruit(max) {
    let int = Math.floor(Math.random() * max);
    console.log(int);
    return this.fruitsInfo.find((fruit) => fruit.evolutionIndex === int).fruitCode
  }

  dropFruit() {
    if (this.panel.currentFruit === null) {
      return;
    }
    this.panel.dropFruit();
    // this.currentFruit += 1;
    // if (this.currentFruit >= this.fruits.length) {
    //   this.currentFruit = 0;
    // }
    setTimeout(() => {
      this.panel.changeFruit(this.getRandomFruit(4));
    }, this.inputDelay)
  }

  gameOver() {
    this.panel.fruitsInGame.forEach(fruit => {
      World.remove(this.panel.composite, fruit.body);
    });
    console.log("game over");
  }

  async wait() {
    await this.loadFruits();
  }

  async loadFruits() {
    const loadPromises = this.fruitsInfo.map((fruit) => {
      return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = fruit.sprite;
        fruit.sprite = image;
        image.onload = resolve;
        image.onerror = reject;
      });
    });

    try {
      await Promise.all(loadPromises);
      console.log('All fruits loaded');
    } catch (error) {
      console.error('Error loading fruits', error);
    }
  }
}

class InputManager {
  constructor(gameMode, goLeft, goRight, dropFruit) {
    this.gameMode = gameMode;
    this.goLeft = goLeft;
    this.goRight = goRight;
    this.dropFruit = dropFruit;

    window.onkeydown = (event) => {
      if (!gameMode.state == "play") { return }
      switch (event.key) {
        case this.goLeft:
          gameMode.panel.goLeft(gameMode.speed);
          break;
        case this.goRight:
          gameMode.panel.goRigth(gameMode.speed);
          break;
        case this.dropFruit:
          gameMode.dropFruit();
          break;
      }
    }
  }
}

const defaultSettings = {
  goLeft: "ArrowLeft",
  goRight: "ArrowRight",
  dropFruit: " ",
}

let gameMode = new GameMode(fruitsInfo);
new InputManager(
  gameMode,
  defaultSettings.goLeft,
  defaultSettings.goRight,
  defaultSettings.dropFruit
);