// import React, { useState, useEffect, useRef, useContext } from "react";
// import VideoContext from "./VideoContext";
// import { io } from "socket.io-client";
// import Peer from "simple-peer";
// import { message } from "antd";
// import Video from "./video/Video";
// import { API_ROOT } from "services/agent.service";

// const URL = `${API_ROOT}/videocallgateway`;
// // const SERVER_URL = "http://localhost:5000/";

// export const socket = io(URL);

// const VideoState = () => {
//     const videoActions = useContext(VideoContext)
//     console.log(videoActions, "Video actions values");

//     useEffect(() => {
//         navigator.mediaDevices
//             .getUserMedia({ video: true, audio: true })
//             .then((currentStream) => {
//                 setStream(currentStream);
//                 myVideo.current.srcObject = currentStream;
//             });
//         if (localStorage.getItem("name")) {
//             setName(localStorage.getItem("name"));
//         }
//         socket.on("me", (id) => setMe(id));
//         socket.on("endCall", () => {
//             window.location.reload();
//         });

//         console.log({ me })


//         socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
//             if (currentMediaStatus !== null || currentMediaStatus !== []) {
//                 switch (type) {
//                     case "video":
//                         setUserVdoStatus(currentMediaStatus);
//                         break;
//                     case "mic":
//                         setUserMicStatus(currentMediaStatus);
//                         break;
//                     default:
//                         setUserMicStatus(currentMediaStatus[0]);
//                         setUserVdoStatus(currentMediaStatus[1]);
//                         break;
//                 }
//             }
//         });

//         socket.on("callUser", ({ from, name: callerName, signal }) => {
//             setCall({ isReceivingCall: true, from, name: callerName, signal });
//         });

//         socket.on("msgRcv", ({ name, msg: value, sender }) => {
//             setMsgRcv({ value, sender });
//             setTimeout(() => {
//                 setMsgRcv({});
//             }, 2000);
//         });
//     }, []);

//     // useEffect(() => {
//     //   console.log(chat);
//     // }, [chat]);

//     const answerCall = () => {
//         setCallAccepted(true);
//         setOtherUser(call.from);
//         const peer = new Peer({ initiator: false, trickle: false, stream });

//         peer.on("signal", (data) => {
//             socket.emit("answerCall", {
//                 signal: data,
//                 to: call.from,
//                 userName: name,
//                 type: "both",
//                 myMediaStatus: [myMicStatus, myVdoStatus],
//             });
//         });

//         peer.on("stream", (currentStream) => {
//             userVideo.current.srcObject = currentStream;
//         });

//         peer.signal(call.signal);

//         connectionRef.current = peer;
//         console.log(connectionRef.current);
//     };

//     const callUser = (id) => {
//         const peer = new Peer({ initiator: true, trickle: false, stream });
//         setOtherUser(id);
//         peer.on("signal", (data) => {
//             socket.emit("callUser", {
//                 userToCall: id,
//                 signalData: data,
//                 from: me,
//                 name,
//             });
//         });

//         peer.on("stream", (currentStream) => {
//             userVideo.current.srcObject = currentStream;
//         });

//         socket.on("callAccepted", ({ signal, userName }) => {
//             setCallAccepted(true);
//             setUserName(userName);
//             peer.signal(signal);
//             socket.emit("updateMyMedia", {
//                 type: "both",
//                 currentMediaStatus: [myMicStatus, myVdoStatus],
//             });
//         });

//         connectionRef.current = peer;
//         console.log(connectionRef.current);
//     };

//     const updateVideo = () => {
//         setMyVdoStatus((currentStatus) => {
//             socket.emit("updateMyMedia", {
//                 type: "video",
//                 currentMediaStatus: !currentStatus,
//             });
//             stream.getVideoTracks()[0].enabled = !currentStatus;
//             return !currentStatus;
//         });
//     };

//     const updateMic = () => {
//         setMyMicStatus((currentStatus) => {
//             socket.emit("updateMyMedia", {
//                 type: "mic",
//                 currentMediaStatus: !currentStatus,
//             });
//             stream.getAudioTracks()[0].enabled = !currentStatus;
//             return !currentStatus;
//         });
//     };


//     //SCREEN SHARING 
//     const handleScreenSharing = () => {

//         if (!myVdoStatus) {
//             message.error("Turn on your video to share the content", 2);
//             return;
//         }

//         if (!screenShare) {
//             navigator.mediaDevices
//                 .getDisplayMedia({ cursor: true })
//                 .then((currentStream) => {
//                     const screenTrack = currentStream.getTracks()[0];


//                     // replaceTrack (oldTrack, newTrack, oldStream);
//                     connectionRef.current.replaceTrack(
//                         connectionRef.current.streams[0]
//                             .getTracks()
//                             .find((track) => track.kind === 'video'),
//                         screenTrack,
//                         stream
//                     );

//                     // Listen click end
//                     screenTrack.onended = () => {
//                         connectionRef.current.replaceTrack(
//                             screenTrack,
//                             connectionRef.current.streams[0]
//                                 .getTracks()
//                                 .find((track) => track.kind === 'video'),
//                             stream
//                         );

//                         myVideo.current.srcObject = stream;
//                         setScreenShare(false);
//                     };

//                     myVideo.current.srcObject = currentStream;
//                     screenTrackRef.current = screenTrack;
//                     setScreenShare(true);
//                 }).catch((error) => {
//                     console.log("No stream for sharing")
//                 });
//         } else {
//             screenTrackRef.current.onended();
//         }
//     };

//     //full screen
//     const fullScreen = (e) => {
//         const elem = e.target;

//         if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//         } else if (elem.mozRequestFullScreen) {
//             /* Firefox */
//             elem.mozRequestFullScreen();
//         } else if (elem.webkitRequestFullscreen) {
//             /* Chrome, Safari & Opera */
//             elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) {
//             /* IE/Edge */
//             elem.msRequestFullscreen();
//         }
//     };

//     const leaveCall = () => {
//         setCallEnded(true);

//         connectionRef.current.destroy();
//         socket.emit("endCall", { id: otherUser });
//         window.location.reload();
//     };

//     const leaveCall1 = () => {
//         socket.emit("endCall", { id: otherUser });
//     };
//     const sendMsg = (value) => {
//         socket.emit("msgUser", { name, to: otherUser, msg: value, sender: name });
//         let msg = {};
//         msg.msg = value;
//         msg.type = "sent";
//         msg.timestamp = Date.now();
//         msg.sender = name;
//         setChat([...chat, msg]);
//     };

//     return (
//         <div className="App" style={{ height: "100%", width: "100%" }}>
//             {/* <Video /> */}
//             {/* <Footer /> */}
//         </div>)
// }

// export default VideoState