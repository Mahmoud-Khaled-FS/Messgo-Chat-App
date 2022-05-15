require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const app = express();

const mongoose = require('mongoose');

const chatRouters = require('./routers/chat');
const authRouters = require('./routers/auth');
const userRouters = require('./routers/user');
const req = require('express/lib/request');

app.use(bodyParser.json());
app.use(express.static('website'));

app.use((req, res, next) => {
  const id = randomUUID();
  req.ioId = id;
  next();
});

app.use(authRouters);
app.use(chatRouters);
app.use(userRouters);

mongoose
  .connect(process.env.MONGODB_CLIENT_URL)
  .then(() => {
    // app.listen(3000);
    const server = app.listen(3000);
    const io = require('./socket').init(server);
    io.on('connection', (socket) => {
      socket.on('join', (data) => {
        socket.join(data.userId);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
