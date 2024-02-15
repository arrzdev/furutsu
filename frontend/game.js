import { Engine, Render, Runner, World, Composite } from "matter-js";
import Panel from "/panel.js";
import fruitsInfo from "../common/fruits.js";

class GameMode {
  constructor(fruitsInfo) {
    this.inputDelay = 900;
    this.engine = Engine.create({
      gravity: { x: 0, y: 0.2 },
      timing: {
        deltaTime: 16.67, // Set the fixed time step in milliseconds
        timeScale: 1, // Adjust time scale if needed
      },
    });

    this.world = this.engine.world;
    this.state = "loading";

    // TODO change width and height to be dynamic
    let render = Render.create({
      engine: this.engine,
      element: document.body,
      options: {
        wireframes: false,
        background: "black",
        width: 1500,
        height: 900,
      },
    });
    render.isFixed = false;
    Render.run(render);

    const gameLoop = () => {
      Engine.update(this.engine, 16.67); // Use the same fixed time step
      // Add other game logic here

      // Request the next animation frame
      requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    gameLoop();

    let runner = Runner.create();
    Runner.run(runner, this.engine);
    this.speed = 5;

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
        this.fruitsInfo
      );

      Composite.add(this.world, this.panel.composite);

      this.nextFruit = this.getRandomFruit(5);
      this.panel.changeFruit(this.getRandomFruit(5));
      this.state = "play";
    });
  }

  getRandomFruit(max) {
    let int = Math.floor(Math.random() * max);
    // console.log(int);
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
      this.panel.changeFruit(this.nextFruit);
      this.nextFruit = this.getRandomFruit(5);
      this.panel.changeNextFruit(this.nextFruit);
    }, this.inputDelay)
  }

  gameOver() {
    this.panel.fruitsInGame.forEach(fruit => {
      World.remove(this.panel.composite, fruit.body);
    });
    Composite(this.composite, this.nextFruit.body);
    this.nexttFruit = null;
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
    let canDrop = true;
    let intervalR = null;
    let intervalL = null;

    window.onkeydown = (event) => {
      if (!gameMode.state == "play") { return }
      switch (event.code) {
        case this.goLeft:
          if (intervalL) return;
          clearInterval(intervalR);
          intervalR = null;
          intervalL = setInterval(() => {
            gameMode.panel.goLeft(gameMode.speed);
          }, 1000 / 60);
          break;
        case this.goRight:
          if (intervalR) return;
          clearInterval(intervalL);
          intervalL = null;
          intervalR = setInterval(() => {
            gameMode.panel.goRigth(gameMode.speed);
          }, 1000 / 60);
          break;
        case this.dropFruit:
          if (canDrop) {
            gameMode.dropFruit();
            canDrop = false;
          }
      }
    }

    window.onkeyup = (event) => {
      if (!gameMode.state == "play") { return }
      switch (event.code) {
        case this.goLeft:
          clearInterval(intervalL);
          intervalL = null;
          break;
        case this.goRight:
          clearInterval(intervalR);
          intervalR = null;
          break;
        case this.dropFruit:
          canDrop = true;
      }
    };
  }
}

const defaultSettings = {
  goLeft: "ArrowLeft",
  goRight: "ArrowRight",
  dropFruit: "Space",
}

let gameMode = new GameMode(fruitsInfo);
new InputManager(
  gameMode,
  defaultSettings.goLeft,
  defaultSettings.goRight,
  defaultSettings.dropFruit
);