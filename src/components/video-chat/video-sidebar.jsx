import { SocketContext } from "../../contexts/VideoContext";
import React, { useContext, useEffect } from "react";

const VideoSidebar = ({ children, idToCall }) => {
  const {
    me,
    call,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
  } = useContext(SocketContext);

  useEffect(() => {
    if (call?.Ended && !callAccepted) {
      // setShowCallRinging(true)
      console.log("answer call");
    }
  }, [call?.Ended, callAccepted]);

  const [toCallId, setToCallId] = React.useState(idToCall);
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
