import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import io from "socket.io-client";

import agent, { API_ROOT } from "./services/agent.service";
import { UserNotifications } from './store/modules/appNotification';
import { getConversationList, getConversationWithPartnerId } from './store/modules/chat'

import './styles/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import AppLoading from './components/AppLoading';
import AppAlert from 'components/AppAlert';

const AppRouter = React.lazy(() => import("./routes/app-router"));
const notificationSocket = io(`${API_ROOT}/notigateway`);


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (agent.Auth.isAuth()) {
      //dispatch(loadApp())
    }
  }, [dispatch])

  const user = agent.Auth.current();
  useEffect(() => {
    notificationSocket.on('connect', () => {
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
    })
    return () => notificationSocket.disconnect();
  }, [notificationSocket]);

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