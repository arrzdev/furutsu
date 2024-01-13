import { Bodies, Composite } from "matter-js";

class Panel {
    constructor(thickness, height, ratio, centerX, centerY, color) {
        var composite = Composite.create();

        var leftBar = Bodies.rectangle(
            centerX - height * ratio / 2 + thickness / 2,
            centerY, thickness, height, {
            isStatic: true,
            render: { fillStyle: color }
        });

        var rightBar = Bodies.rectangle(
            centerX + height * ratio / 2 - thickness / 2,
            centerY,
            thickness,
            height, {
            isStatic: true,
            render: { fillStyle: color }
        });

        var bottomBar = Bodies.rectangle(
            centerX,
            centerY + height / 2 - thickness / 2,
            height * ratio,
            thickness, {
            isStatic: true,
            render: { fillStyle: color }
        });

        Composite.add(composite, [bottomBar, leftBar, rightBar]);

        this.composite = composite;
        this.left = centerX - height * ratio / 2 + thickness / 2;
        this.right = centerX + height * ratio / 2 - thickness / 2;
        this.currentFruit = null;
    }

    changeFruit(fruit) {
        this.currentFruit = fruit;
        fruit.body.position.x = this.left + (this.right - this.left) / 2;
        fruit.body.position.y = fruit.radius + 5;
        Composite.add(this.composite, fruit.body);
    }

    goLeft(speed) {
        this.currentFruit.body.position.x -= speed;
        if (this.currentFruit.body.position.x < this.left + this.currentFruit.radius * 2) {
            this.currentFruit.body.position.x = this.left + this.currentFruit.radius * 2;
        }

    }

    goRigth(speed) {
        this.currentFruit.body.position.x += speed;
        if (this.currentFruit.body.position.x > this.right - this.currentFruit.radius * 2) {
            this.currentFruit.body.position.x = this.right - this.currentFruit.radius * 2;
        }
    }

    dropFruit() {
        if (this.currentFruit === null) {
            return;
        }
        this.currentFruit.body.isSleeping = false;
        this.currentFruit.canFuse = true;
        this.currentFruit = null;
    }
}
export default Panel