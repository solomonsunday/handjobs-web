import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useState, useContext, useEffect, useRef } from "react";

import { SocketContext } from "../../../contexts/VideoContext";

const VideoCallDialog = ({}) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    userStream,
    call,
  } = useContext(SocketContext);
  const [showDialog, setShowDialog] = useState(false);
  const [stream, setStream] = useState();
  const myVideoRef = useRef();
  const userVideoRef = useRef();

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        myVideoRef.current.srcObject = stream;
      } catch (err) {
        console.log(err);
      }
    };
    getUserMedia();
  }, []);

  useEffect(() => {
    if (callAccepted && !callEnded) {
      setShowDialog(true);
    }
    if (callEnded) {
      setShowDialog(false);
    }
    if (userStream) {
      userVideoRef.current.srcObject = userStream;
    }
    if (call) {
      console.log("calling name", call);
    }
  }, [callAccepted, callEnded, userStream, call]);

  const onHide = () => {
    setShowDialog(false);
  };

  console.log("mE", me);

  // const handleCall = (e) => {
  //   e.preventDefault();
  //   callUser(idToCall);
  // };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Hang Up"
          icon="pi pi-check"
          onClick={() => {
            leaveCall();
            onHide();
            //show another dialog
          }}
          autoFocus
        />
      </div>
    );
  };

  return (
    <Dialog
      header="Ongoing Call"
      visible={showDialog}
      position="bottom"
      modal
      style={{ width: "100vw", height: "100vh" }}
      footer={renderFooter()}
      onHide={() => onHide()}
      draggable={false}
      resizable={false}
    >
      <h3>Ongoing Call</h3>
      <div className="flex flex-row">
        {callAccepted && !callEnded && (
          <Card title={`${call.name}` || "Guest User"}>
            <div>
              <video playsInline ref={userVideoRef} autoPlay />
            </div>
          </Card>
        )}

        <Card title={"You"}>
          <div>
            <video playsInline muted ref={myVideoRef} autoPlay />
          </div>
        </Card>
      </div>
    </Dialog>
  );
};

export default VideoCallDialog;
