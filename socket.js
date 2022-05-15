let io;

module.exports = {
  init: (server) => {
    // console.log('hddkhdskfhdlhflkdshkfhdskjfhuhdf;kdsh;fuhsdfhdfhsukhfulshjlkfhljksdhjk');
    io = require('socket.io')(server);

    // io.on("connection", (socket) => {
    //   socket.join("some room");
    // });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Connection Failed!');
    }
    return io;
  },
  // connectUser: (id) => {
  //   io.on('connection', (socket) => {
  //     socket.join(id);
  //   });
  // },
};
// io.on('connect', function (socket) {
//   console.log('connect');
//   socket.on('userConnected', socket.join(req.userId.toString()));
// });
