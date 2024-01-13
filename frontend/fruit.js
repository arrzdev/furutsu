import { Bodies } from "matter-js";
import fruitsInfo from "../common/fruits.js";

class Fruit {
    constructor(name, x, y) {
        this.name = name;
        this.radius = fruitsInfo.find((fruit) => fruit.name === name).radius;
        this.sprite = fruitsInfo.find((fruit) => fruit.name === name).sprite;
        // TODO put sprite
        this.body = Bodies.circle(x, y, this.radius, { isSleeping: true, render: { fillStyle: "orange" } })
        this.canFuse = false;
    }
}

export default Fruit;