import { Bodies, Detector } from "matter-js";
import fruitsInfo from "../common/fruits.js";

class Fruit {
    constructor(fruitCode, x, y) {
        console.log(fruitCode);
        this.fruitCode = fruitCode;
        this.evolutionIndex = fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).evolutionIndex;
        this.radius = fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).radius;
        this.sprite = `../${fruitsInfo.find((fruit) => fruit.fruitCode === fruitCode).sprite}`;
        // TODO put sprite
        this.body = Bodies.circle(x, y, this.radius, {
            isSleeping: true,
            render: { fillStyle: "orange" }, restitution: 0.2
        })
        this.canFuse = false;

        detectCollisions();
    }

    detectCollisions() {

    }
}

export default Fruit;