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
