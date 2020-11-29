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
app.use(express.json({limit: '1000mb'}));
app.use(express.static(publicDirectoryPath))
let ballX=null;
let ballY=null;
let ballSpeedX=null;
let ballSpeedY=null;
let paddle1Y=null;
let paddle2Y=null;
let PADDLE_HEIGHT=null;
let player1Score=null;
let player2Score=null;
let WINNING_SCORE=null;
let height=null;
let width=null;
let showingWinScreen=null;

io.on('connection', (socket) => {
    console.log('New WebSocket connection');
    socket.on('me', dataP => {
        socket.broadcast.emit('opponent', dataP);
    });
    socket.on('moveEverything', data => {
        if (ballX == null
        || ballY == null
        || ballSpeedX == null
        || ballSpeedX == null
        || paddle1Y == null
        || paddle2Y == null
        || PADDLE_HEIGHT == null
        || player1Score == null
        || player2Score == null
        || WINNING_SCORE == null
        || width == null
        || height == null
        || showingWinScreen == null
        ) {
            ballX = data.ballX
            ballY = data.ballY
            ballSpeedX = data.ballSpeedX
            ballSpeedX = data.ballSpeedY
            paddle1Y = data.paddle1Y
            paddle2Y = data.paddle2Y
            PADDLE_HEIGHT = data.PADDLE_HEIGHT
            player1Score = data.player1Score
            player2Score = data.player2Score
            WINNING_SCORE = data.WINNING_SCORE
            width = data.WIDTH
            height = data.HEIGHT
            showingWinScreen = data.showingWinScreen
        }
        ballX = ballX + ballSpeedX;
        ballY = ballY + ballSpeedY;


        if (ballX < 0) {
            if (ballY > paddle1Y &&
                ballY < paddle1Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY
                    - (paddle1Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player2Score++; // must be BEFORE ballReset()
                if (player1Score >= WINNING_SCORE ||
                    player2Score >= WINNING_SCORE) {
            
                    showingWinScreen = true;
            
                }
                ballSpeedX = -ballSpeedX;
                ballX = width / 2;
                ballY = height / 2;
            }
        }
        if (ballX > width) {
            if (ballY > paddle2Y &&
                ballY < paddle2Y + PADDLE_HEIGHT) {
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY
                    - (paddle2Y + PADDLE_HEIGHT / 2);
                ballSpeedY = deltaY * 0.35;
            } else {
                player1Score++; // must be BEFORE ballReset()
                if (player1Score >= WINNING_SCORE ||
                    player2Score >= WINNING_SCORE) {
            
                    showingWinScreen = true;
            
                }
                ballSpeedX = -ballSpeedX;
                ballX = width / 2;
                ballY = height / 2;
            }

        }

        if (ballY < 0) {
            ballSpeedY = -ballSpeedY;
        }
        if (ballY > height) {
            ballSpeedY = -ballSpeedY;
        }
        let data1={};
        data1.ballX = ballX
        data1.ballY = ballY
        data1.ballSpeedX = ballSpeedX
        data1.ballSpeedY = ballSpeedY
        data1.paddle1Y = paddle1Y
        data1.paddle2Y = paddle2Y
        data1.player1Score = player1Score
        data1.player2Score = player2Score
        data1.showingWinScreen = showingWinScreen
        socket.emit('recieve', data1);
    });

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})