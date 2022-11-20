import React, { useContext, useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { SocketContext } from "../../../contexts/VideoContext";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setShowDialog(true);
    }
  }, [call.isReceivingCall, callAccepted]);

  const onHide = () => setShowDialog(false);

  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Answer"
          icon="pi pi-check"
          onClick={() => {
            answerCall();
            onHide();
            //show another dialog
          }}
          autoFocus
        />
      </div>
    );
  };
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <Dialog
          header="Incoming Call!"
          visible={showDialog}
          position="bottom"
          modal
          style={{ width: "50vw" }}
          footer={renderFooter()}
          onHide={() => onHide()}
          draggable={false}
          resizable={false}
        >
          <p>{call.name} is calling...</p>
        </Dialog>
        // <div style={{ display: "flex", justifyContent: "space-around" }}>
        //   <h1>{call.name} is calling:</h1>
        //   <button onClick={answerCall}>Answer</button>
        // </div>
      )}
    </>
  );
};

export default Notifications;
