import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import agent, { API_ROOT } from "./services/agent.service";
import { UserNotifications } from './store/modules/appNotification';
import { getConversationList, getConversationWithPartnerId } from './store/modules/chat';

import './styles/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import AppLoading from "./components/AppLoading";
import AppAlert from "components/AppAlert";
import { CALL_USER, CONNECTED, CONNECTED_USER, JOINED, ME } from "constants/video-call";
import { socketIdSaved } from 'store/modules/videoCall';
import VideoCallRingingModal from 'pages/VideoCalling/VideoCallModal';
import { push } from 'connected-react-router';
import VideoContext from 'contexts/VideoContext';
import { SocketContext } from 'contexts/VideoContext'

export const SET_CUSTOM_SOCKET_ID = "SET_CUSTOM_SOCKET_ID";

const AppRouter = React.lazy(() => import("./routes/app-router"));
const notificationSocket = io(`${API_ROOT}/notigateway`);
export const videoCallSocket = io(`${API_ROOT}/videocallgateway`);


function App() {
  const { socket, me, answerCall, call, callAccepted, show, leaveCall } = useContext(SocketContext);
  const dispatch = useDispatch();
  const account = useSelector(state => state.account.profileInfo)

  const [connectedUsers, setConnectedUsers] = useState({})

  useEffect(() => {
    if (agent.Auth.isAuth()) {
      //dispatch(loadApp())
    }
  }, [dispatch])

  const user = agent.Auth.current();
  // useEffect(() => {
  //   if (user !== null && me !== '') {
  //     console.log({ accountId: user.id, socketId: me })
  //     socket.emit(JOINED, { accountId: user.id, socketId: me })
  //   }
  // }, [user])

  useEffect(() => {
    /**Notification socket */
    notificationSocket.on("connect", () => {
      if (user && user.id) {
        notificationSocket.emit('notification_msg_to_server', {
          socketId: user.id,
        })
      }

      notificationSocket.on("notification_msg_to_client", (data) => {
        console.log("message sent to clients");
        if (data && data?.recieverId === user?.id) {
          dispatch(UserNotifications(user?.id));
        }
      });

      notificationSocket.on("chat_msg_to_client", (data) => {
        console.log("chat message sent to clients");
        if (data && data?.recieverId === user?.id) {
          dispatch(getConversationWithPartnerId(data?.senderId));
          dispatch(getConversationList());
        }
      });
    });
    return () => {
      notificationSocket.disconnect();

    };
  }, [notificationSocket, user]);



  /**
   * Ring when the current logged in user has a call to receive
   * 
   */
  const openVideoCallRoom = () => {
    dispatch(push("/videochat"))
  };

  const onHideCallRinging = () => {
    // setShowCallRinging(false)
  }

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      // setShowCallRinging(true)

    }


  }, [call, callAccepted])


  return (
    <React.Suspense fallback={<AppLoading />}>
      <AppAlert />
      <AppRouter />

      {/* <VideoCallRingingModal
        openVideoCallRoom={openVideoCallRoom}
        onHide={onHideCallRinging}
      /> */}

    </React.Suspense>
  )
}

export default App