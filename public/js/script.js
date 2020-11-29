
const socket = io('http://localhost:5000');
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
var WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
var PADDLE_THICKNESS = 10;
var PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}
function computerMovement() {
    socket.on('opponent', data => {
        paddle2Y = data;
    })
}

window.onload = function () {
            canvas = document.getElementById('gameCanvas');
            canvasContext = canvas.getContext('2d');

            var framesPerSecond = 30;
            setInterval(function () {
                socket.emit('me', paddle1Y);
                computerMovement();
                if (!showingWinScreen) {
                    let XXX = {
                        ballX: ballX,
                        ballY: ballY,
                        ballSpeedX: ballSpeedX,
                        ballSpeedY: ballSpeedY,
                        paddle1Y: paddle1Y,
                        paddle2Y: paddle2Y,
                        PADDLE_HEIGHT: PADDLE_HEIGHT,
                        player1Score: player1Score,
                        player2Score: player2Score,
                        WINNING_SCORE: WINNING_SCORE,
                        WIDTH: canvas.width,
                        HEIGHT: canvas.height,
                        showingWinScreen: showingWinScreen
                    };
                    socket.emit('moveEverything', XXX);
                    socket.on('recieve', data => {
                        ballX = data.ballX
                        ballY = data.ballY
                        ballSpeedX = data.ballSpeedX
                        ballSpeedY = data.ballSpeedY
                        paddle1Y = data.paddle1Y
                        paddle2Y = data.paddle2Y
                        player1Score = data.player1Score
                        player2Score = data.player2Score
                        WINNING_SCORE = data.WINNING_SCORE
                        showingWinScreen = data.showingWinScreen
                    });
                }
                drawEverything();
            }, 1000 / framesPerSecond);

            canvas.addEventListener('mousedown', handleMouseClick);

            canvas.addEventListener('mousemove',
                function (evt) {
                    var mousePos = calculateMousePos(evt);
                    paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
                });
        }



function drawNet() {
            for (var i = 0; i < canvas.height; i += 40) {
                colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
            }
        }

function drawEverything() {
            // next line blanks out the screen with black
            colorRect(0, 0, canvas.width, canvas.height, 'black');

            if (showingWinScreen) {
                canvasContext.fillStyle = 'white';

                if (player1Score >= WINNING_SCORE) {
                    canvasContext.fillText("Left Player Won", 350, 200);
                } else if (player2Score >= WINNING_SCORE) {
                    canvasContext.fillText("Right Player Won", 350, 200);
                }

                canvasContext.fillText("click to continue", 350, 500);
                return;
            }

            drawNet();

            // this is left player paddle
            colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

            // this is right computer paddle
            colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

            // next line draws the ball
            colorCircle(ballX, ballY, 10, 'white');

            canvasContext.fillText(player1Score, 100, 100);
            canvasContext.fillText(player2Score, canvas.width - 100, 100);
        }

function colorCircle(centerX, centerY, radius, drawColor) {
            canvasContext.fillStyle = drawColor;
            canvasContext.beginPath();
            canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
            canvasContext.fill();
        }

function colorRect(leftX, topY, width, height, drawColor) {
            canvasContext.fillStyle = drawColor;
            canvasContext.fillRect(leftX, topY, width, height);
        }