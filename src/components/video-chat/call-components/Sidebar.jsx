import React, { useState, useContext } from "react";

import { SocketContext } from "../../../contexts/VideoContext";

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  console.log("mE", me);

  const handleCall = (e) => {
    e.preventDefault();
    callUser(idToCall);
  };

  return (
    <div>
      <div>
        <form>
          <div>
            <div>
              <h6>Account Info</h6>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <h6>Make a call</h6>
              <input
                label="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
              />
              {callAccepted && !callEnded ? (
                <button onClick={leaveCall}>Hang Up</button>
              ) : (
                <button onClick={handleCall}>Call</button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
