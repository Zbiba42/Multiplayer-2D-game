class player {
  constructor(x, y, color, velocity, id) {
    this.hp = 50
    this.x = x
    this.y = y
    this.raduis = 50
    this.color = color
    this.velocity = {
      x: velocity.x,
      y: velocity.y,
    }
    this.id = id
  }
  getHit() {
    this.hp -= 25
    this.raduis -= 25
    this.update()
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
