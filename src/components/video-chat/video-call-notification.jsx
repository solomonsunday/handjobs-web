import React, { useContext, useEffect } from "react";
import { SocketContext } from "../../contexts/VideoContext";

const VideoCallNotification = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      // setShowCallRinging(true)
      console.log(
        "VIDEO CALL NOTIFICATION",
        call,
        "call accepted",
        callAccepted
      );
      console.log(`${call.name} is calling...`);
    }
  }, [call?.isReceivingCall, callAccepted]);
  console.log("call?.isReceivingCall", call?.isReceivingCall);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <>
          <h3 className="my-4">Ringing...</h3>
          <div className="bouncing-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <h1>{call.name} is calling:</h1>
            <button onClick={answerCall}>Answer</button>
          </div>
        </>
      )}
    </>
  );
};

export default VideoCallNotification;
