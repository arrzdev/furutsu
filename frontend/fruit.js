import { Bodies, Detector } from "matter-js";
import fruitsInfo from "../common/fruits.js";

const colors = ["red", "orange", "yellow", "black", "blue", "purple", "pink", "brown", "black", "white", "gray"];

class Fruit {
    constructor(fruitCode, x, y) {
        this.fruitCode = fruitCode;
        this.name = fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).name;
        this.evolutionIndex = fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).evolutionIndex;
        this.radius = fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).radius;
        // this.sprite = `../${fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).sprite}`;
        // TODO put sprite
        this.body = Bodies.circle(x, y, this.radius, {
            isSleeping: true,
            render: { fillStyle: colors[this.fruitCode] }, restitution: 0.2
        })
        this.canFuse = false;
    }
}

export default Fruit;