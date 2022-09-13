import React, { useEffect } from 'react';
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

<<<<<<< Updated upstream
import AppLoading from './components/AppLoading';
import AppAlert from 'components/AppAlert';
=======
import AppLoading from "./components/AppLoading";
import AppAlert from "components/AppAlert";
import { CONNECTED, CONNECTED_USER, JOINED, ME } from "constants/video-call";

export const SET_CUSTOM_SOCKET_ID = "SET_CUSTOM_SOCKET_ID";
>>>>>>> Stashed changes

const AppRouter = React.lazy(() => import("./routes/app-router"));
const notificationSocket = io(`${API_ROOT}/notigateway`);
const videoCallSocket = io(`${API_ROOT}/videocallgateway`);


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (agent.Auth.isAuth()) {
      //dispatch(loadApp())
    }
  }, [dispatch])

  const user = agent.Auth.current();

  useEffect(() => {
    /**Video call socket */
    videoCallSocket.on("connect", () => {
      //initialize and set the socket id to the user id
      if (user && user.id) {
        console.log("hey user is here");
        videoCallSocket.on(ME, (id) => {
          console.log("Hey account id", user.id, "socket id", id);
          videoCallSocket.emit(JOINED, user.id, id);
        });
      }
      // videoCallSocket.emit(SET_CUSTOM_SOCKET_ID, { socketId: user.id });
      videoCallSocket.on(CONNECTED, (accountId, socketId) => {
        console.log("accoiuntn id", accountId, "scoket id", socketId);
      });
      videoCallSocket.on(CONNECTED_USER, (users) => {
        console.log("users", users);
      });
    });
  }, [user]);

  useEffect(() => {
<<<<<<< Updated upstream
    notificationSocket.on('connect', () => {
=======
    /**Notification socket */
    notificationSocket.on("connect", () => {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    })
    return () => notificationSocket.disconnect();
  }, [notificationSocket]);
=======
    });
    return () => {
      notificationSocket.disconnect();
      videoCallSocket.disconnect();
    };
  }, [notificationSocket, videoCallSocket, user]);
>>>>>>> Stashed changes

  // useEffect(() => {
  //   const chatSocket = io(`${API_ROOT}/chatgateway`);
  //   chatSocket.on('connect to', () => {
  //     if (user && user.id) {
  //       chatSocket.emit('chat_msg_to_server', {
  //         socketId: user.id,
  //       })
  //     }

  //     chatSocket.on("chat_msg_to_client", (data) => {
  //       console.log("chat message sent to clients");
  //       if (data && data?.recieverId === user?.id) {
  //         dispatch(getConversationWithPartnerId(user?.recieverId));
  //       }
  //     });
  //   })
  //   return () => chatSocket.disconnect();
  // }, []);


  return (
    <React.Suspense fallback={<AppLoading />}>
      <AppAlert />
      <AppRouter />
    </React.Suspense>
  )
}

export default App