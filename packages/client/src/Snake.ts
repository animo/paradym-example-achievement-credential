interface Vector {
  x: number;
  y: number;
}

export class Snake {
  private bodyParts: Vector[];
  private gridSize: number;

  private constructor(bodyParts: Vector[], gridSize: number) {
    this.bodyParts = bodyParts;
    this.gridSize = gridSize;
  }

  private getHead() {
    return this.bodyParts[0];
  }

  private checkSelfCollision() {
    const head = this.getHead();
    for (let i = 1; i < this.bodyParts.length; i++) {
      if (this.bodyParts[i].x === head.x && this.bodyParts[i].y === head.y) {
        return true;
      }
    }
    return false;
  }

  private checkWallCollision(gameArea: Vector) {
    const head = this.getHead();
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= gameArea.x ||
      head.y >= gameArea.y
    )
      return true;
    return false;
  }

  private checkFoodCollision(food: Vector) {
    const head = this.getHead();
    if (head.x === food.x && head.y === food.y) {
      return true;
    }
    return false;
  }

  private getNewSnakePosition(direction: Vector) {
    return this.bodyParts.map((segment, index) => {
      if (index === 0) {
        return {
          x: segment.x + direction.x * this.gridSize,
          y: segment.y + direction.y * this.gridSize,
        };
      }
      return this.bodyParts[index - 1];
    });
  }

  public update(direction: Vector) {
    return new Snake(this.getNewSnakePosition(direction), this.gridSize);
  }

  public static new(startPosition: Vector, gridSize: number) {
    return new Snake([startPosition], gridSize);
  }
}
