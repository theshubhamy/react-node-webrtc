import { Server } from 'socket.io';

const io = new Server(8800, {
  cors: true,
});

const userIdToSocketIdMap = new Map();
const socketidTouserIdMap = new Map();

io.on('connection', socket => {
  console.log(`Socket Connected`, socket.id);

  socket.on('room:join', data => {
    const { userId, room } = data;
    userIdToSocketIdMap.set(userId, socket.id);
    socketidTouserIdMap.set(socket.id, userId);

    socket.join(room);

    io.to(room).emit('user:joined', { userId, id: socket.id });

    io.to(socket.id).emit('room:join', data);
  });

  socket.on('user:call', ({ to, offer }) => {
    console.log('user:call to socket', to, 'from', socket.id);
    io.to(to).emit('incomming:call', { from: socket.id, offer });
  });

  socket.on('call:accepted', ({ to, ans }) => {
    console.log('call:accepted to socket', to, 'from', socket.id);
    io.to(to).emit('call:accepted', { from: socket.id, ans });
  });

  socket.on('peer:nego:needed', ({ to, offer }) => {
    console.log('peer:nego:needed', offer);
    io.to(to).emit('peer:nego:needed', { from: socket.id, offer });
  });

  socket.on('peer:nego:done', ({ to, ans }) => {
    console.log('peer:nego:done', ans);
    io.to(to).emit('peer:nego:final', { from: socket.id, ans });
  });
});
