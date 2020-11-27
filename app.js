require('./db/mongoose');
const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//sudo killall -9 node
const publicDirectoryPath = path.join(__dirname, '/public');
app.use(express.static(publicDirectoryPath));

app.use(express.json({limit: '1mb'}));

app.get('', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    //runs when  server is up and running
    console.log('Server is up on port 3000.');
})