import { SocketContext } from "../../contexts/VideoContext";
import React, { useContext } from "react";

const VideoSidebar = ({ children, idToCall }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);

  const [toCallId, setToCallId] = React.useState("");
  return (
    <div>
      <div>
        <input
          placeholder="ID to call"
          value={toCallId}
          onChange={(e) => setToCallId(e.target.value)}
        />
      </div>
      <div>
        {callAccepted && !callEnded ? (
          <button onClick={leaveCall}>Hang Up</button>
        ) : (
          <button onClick={() => callUser(toCallId)}>Call</button>
        )}
      </div>
      {children}
    </div>
  );
};

export default VideoSidebar;
