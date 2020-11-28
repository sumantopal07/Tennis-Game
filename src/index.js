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

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('me',data=>{
        socket.broadcast.emit('opponent',data);
    });
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})