let canvas = document.querySelector('canvas')
let c = canvas.getContext('2d')

canvas.width = 800
canvas.height = 500
let socket = io()

let score = 0
let speed = 7
// if (speed < 7) {
//   setInterval(() => {
//     speed += 0.5
//   }, 10)
// }

const x = canvas.width / 2
const y = canvas.height / 2

const players = {}
let projectiless = []

let lastX = 0
let lastY = 0

let sent = false

socket.on('updatePlayers', (Players) => {
  for (const id in Players) {
    const Player = Players[id]
    if (!players[id]) {
      players[id] = new player(
        Player.x,
        Player.y,
        Player.color,
        {
          x: Player.velocity.x,
          y: Player.velocity.y,
        },
        id
      )
    }
    // else if (players[id] != Player) {
    //   players[id].hp = Player.hp
    //   players[id].x = Player.x
    //   players[id].y = Player.y
    //   players[id].raduis = Player.raduis
    //   players[id].color = Player.color
    //   players[id].velocity = {
    //     x: Player.velocity.x,
    //     y: Player.velocity.y,
    //   }
    //   players[id].id = Player.id
    // }
  }
  for (const id in players) {
    if (!Players[id]) {
      delete players[id]
    }
  }
})

socket.on('playersMove', (Players) => {
  for (const id in Players) {
    const Player = Players[id]
    if (players[id] != Player) {
      players[id].velocity = {
        x: Player.velocity.x,
        y: Player.velocity.y,
      }
    }
  }
})

socket.on('BackProjectiles', (Backprojectiles) => {
  Backprojectiles.forEach((projectile) => {
    if (!projectiless.includes(projectile)) {
      projectiless.push(
        new projectiles(
          projectile.x,
          projectile.y,
          projectile.raduis,
          projectile.color,
          projectile.velocity,
          projectile.ownerId
        )
      )
    }
  })
})

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0,0,0,0.1)'
  c.fillRect(0, 0, innerWidth, innerHeight)
  for (const id in players) {
    players[id].update()
  }
  // console.log('last x :' + lastX + ' x : ' + Math.round(players[socket.id].x))
  // console.log('last y :' + lastY + ' y : ' + Math.round(players[socket.id].y))

  if (
    (Math.round(players[socket.id].x) == Math.floor(lastX) && sent == false) ||
    (Math.round(players[socket.id].y) == Math.floor(lastY) && sent == false)
  ) {
    players[socket.id].velocity.x = 0
    players[socket.id].velocity.y = 0
    setTimeout(() => {
      socket.emit('FrontPlayer', players[socket.id])
    }, 1)
    sent = true
  }
  projectiless.forEach((projectile, index) => {
    projectile.update()
    if (
      projectile.x + projectile.raduis < 0 ||
      projectile.x - projectile.raduis > canvas.width ||
      projectile.y + projectile.raduis < 0 ||
      projectile.y - projectile.raduis > canvas.height
    ) {
      projectiless.splice(index, 1)
    }
  })
  projectiless.forEach((projectile, index) => {
    for (const id in players) {
      const player = players[id]

      if (projectile.ownerId != player.id) {
        const dx = projectile.x - player.x
        const dy = projectile.y - player.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < player.raduis + projectile.raduis) {
          projectiless.splice(index, 3)

          if (player.hp > 25) {
            player.getHit()
          } else {
            delete players[id]
          }
          console.log(player.hp)
          socket.emit('Frontplayers', players)
        }
      }
    }
  })
}
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  lastX = e.clientX
  lastY = e.clientY
  sent = false
  angle = Math.atan2(
    e.clientY - players[socket.id].y,
    e.clientX - players[socket.id].x
  )
  velocity = {
    x: Math.cos(angle) * 3,
    y: Math.sin(angle) * 3,
  }

  players[socket.id].velocity.x = velocity.x
  players[socket.id].velocity.y = velocity.y

  socket.emit('FrontPlayer', players[socket.id])
})
let cooldown = 0
window.addEventListener('click', (e) => {
  if (cooldown == 0) {
    cooldown = 1
    const angle = Math.atan2(
      e.clientY - players[socket.id].y,
      e.clientX - players[socket.id].x
    )
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    }

    projectiless.push(
      new projectiles(
        players[socket.id].x,
        players[socket.id].y,
        10,
        players[socket.id].color,
        velocity,
        socket.id
      )
    )
    socket.emit('FrontProjectiles', projectiless)
    setTimeout(() => {
      cooldown = 0
    }, 500)
  }
})
animate()
