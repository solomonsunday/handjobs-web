import { Card } from "primereact/card";
import React, { useContext } from "react";

import { SocketContext } from "../../../contexts/VideoContext";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);

  return (
    <div>
      {stream && (
        <Card title={name || "Name"}>
          <div>
            <video playsInline muted ref={myVideo} autoPlay />
          </div>
        </Card>
      )}
      {callAccepted && !callEnded && (
        <div>
          <div>
            <h5>{call.name || "Name"}</h5>
            <video playsInline ref={userVideo} autoPlay />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
