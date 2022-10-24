import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { CONNECTED_USER, JOINED } from 'constants/video-call';
import agentService from 'services/agent.service';

const SocketContext = createContext();

// const socket = io('http://localhost:5000');
// const socket = io('https://warm-wildwood-81069.herokuapp.com');
const socket = io('http://localhost:8080/videocallgateway');

const mapUsersToObject = (users) => {
  let obj = {};
  Object.values(users).forEach((user) => {
    obj[user.accountId] = user;
  })
  return obj;
}


const VideoContextProvider = ({ children }) => {
  const [showCallRinging, setShowCallRinging] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({})
  const [currentOnlineUser, setCurrentOnlineUser] = useState()
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  // const myVideo = useRef();
  // const userVideo = useRef();
  const connectionRef = useRef();

  const [myVideoStream, setMyVideoStream] = useState(null)
  const [userVideoStream, setUserVideoStream] = useState(null)

  const user = agentService.Auth.current();
  useEffect(() => {
    if (user !== null && me !== '') {
      console.log({ accountId: user.id, socketId: me })
      socket.emit(JOINED, { accountId: user.id, socketId: me })
    }

  }, [me])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setMyVideoStream(currentStream)
      });

    socket.on('me', (id) => {
      setMe(id);
      console.log('ME', id)
    });

    socket.on('callUser', ({ from, name, signal }) => {
      setCall({ isReceivingCall: true, from, name, signal });
      console.log('caller ', name, 'from', from)
    });

    socket.on("connected-users", (users) => {
      console.log('connected-users', users)
      setOnlineUsers(mapUsersToObject(users));
    })

    socket.on("current-online-user", (data) => {
      console.log('[current online user]', data)
      setCurrentOnlineUser(data)
    })

  }, []);

  //remember to add this myVideo.current?.srcObject = currentStream;

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { type: "video", signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      // userVideo.current.srcObject = currentStream;
      setUserVideoStream(currentStream);
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log('calling user func: ', id)
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      console.log('You should now emit the call')
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      // userVideo.current.srcObject = currentStream;
      setUserVideoStream(currentStream)
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      // myVideo,
      // userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,

      myVideoStream,
      userVideoStream,

      socket,
      onlineUsers,
      currentOnlineUser,
      showCallRinging,
      setShowCallRinging,


    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { VideoContextProvider, SocketContext };
