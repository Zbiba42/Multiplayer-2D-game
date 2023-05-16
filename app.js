const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 })

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
let players = {}
let Backprojectiles = []
const colors = ['#7A306C', '#FFC145', '#FFFFFB', '#A10702', '#5AFF15']
io.on('connection', (socket) => {
  console.log('a user connected')
  players[socket.id] = {
    x: Math.floor(Math.random() * 300),
    y: Math.floor(Math.random() * 300),
    color: colors[Math.floor(Math.random() * 5)],
    velocity: {
      x: 0,
      y: 0,
    },
    id: socket.id,
  }

  io.emit('updatePlayers', players)

  socket.on('FrontPlayer', (Players) => {
    players[socket.id] = Players
    io.emit('playersMove', players)
  })
  socket.on('FrontProjectiles', (projectiless) => {
    Backprojectiles = projectiless
    io.emit('BackProjectiles', Backprojectiles)
  })
  socket.on('Frontplayers', (Players) => {
    players = Players
    io.emit('updatePlayers', players)
  })
  socket.on('disconnect', (reason) => {
    console.log(reason)
    delete players[socket.id]
    io.emit('updatePlayers', players)
  })
})

server.listen('5000', '192.168.246.26', () => {
  console.log('server is listening')
})

// katl9aha b ipconfig ipv4
