import { io, Socket } from 'socket.io-client';

declare const __process: NodeJS.Process; // set in rollup.config

export default window.$linebase.io = (function () {
  'use strict';

  let socket: Socket;
  const socketUrl = `${(__process as NodeJS.Process).env.VUE_APP_SOCKET_URL}`;
  const namespace = `${window.LINEBASE_WORKSPACE_ID}`;
  const options = {
    query: {
      'org_id': window.LINEBASE_ORG_ID || '',
      'workspace_id': window.LINEBASE_WORKSPACE_ID || '',
      'contact_id': window.$linebase.contact._id || '',
      'contact_status': window.$linebase.contact.status || '',
      'convo_id': window.$linebase.contact.conversation_id || '',
    },
    resource: "socket.io",
    transports: ['websocket'],
    forceNew: true,
    upgrade: false,
  };
  // connect without namespace
  socket = io(socketUrl, options);

  socket.on("connect", () => {
    console.log('socket connected: ' + socket.connected); // true
    console.log('socketID:', socket.id);
  });


  socket.emit('joinRoom', { room_id: window.$linebase.contact.conversation_id });
  socket.emit('accessSite', window.$linebase.contact);

  socket.emit('clientEmit', { shiet: 'shiet' }); // test
  
  socket.on('serverEmit', (data) => { // test
    console.log(`================ Received signal from socket server successfully ==============`, data);
  })

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });


  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    // else the socket will automatically try to reconnect
  });

  // window.$linebase.io = socket;
  return socket;
})();
