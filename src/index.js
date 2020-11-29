const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
app.set('view engine', 'ejs')

const port = process.env.PORT || 5000
const publicDirectoryPath = path.join(__dirname, '../public')
const crash = path.join(__dirname, '../crash')

app.use(express.static(publicDirectoryPath))

let users = 0;
io.on('connection', (socket) => {
    users++;

    console.log("users ", users);
    socket.on('me', data => {
        socket.broadcast.emit('opponent', data);
    });
    socket.on('disconnect', () => {
        users--;
        console.log("users ", users);
    });
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
setInterval(() => {
    io.emit('playing mode', users);
}, 1000 / 30);
