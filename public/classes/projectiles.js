class projectiles {
  constructor(x, y, raduis, color, velocity, ownerId) {
    this.x = x
    this.y = y
    this.raduis = raduis
    this.color = color
    this.velocity = velocity
    this.ownerId = ownerId
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.raduis, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }
  update() {
    this.draw()
    this.x += this.velocity.x
    this.y += this.velocity.y
  }
}
