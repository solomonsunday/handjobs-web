import React, { useContext } from "react";
import { SocketContext } from "../../contexts/VideoContext";

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);

  return (
    <div>
      <div>
        <h4>My Video</h4>
        <video
          playsInline
          muted
          ref={myVideo}
          autoPlay
          style={{ width: "400px", height: "200px" }}
        />
      </div>
      <div>
        <h4>{call.name || "Name"}</h4>
        <video
          playsInline
          ref={userVideo}
          autoPlay
          style={{ width: "400px", height: "200px" }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
