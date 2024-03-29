import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button";
import { FaMicrophoneAlt, FaPhone } from "react-icons/fa";
import Hang from "../../../src/assets/images/hang.svg";
import VideoSidebar from "components/video-chat/video-sidebar";
import VideoCallNotification from "components/video-chat/video-call-notification";
import VideoPlayer from "components/video-chat/video-player";

const VideoCallRingingModal = ({ show, onHide, idToCall }) => {
  return <Dialog visible={show} position={'bottom'} modal style={{ width: '50vw' }} onHide={() => onHide()}
    draggable={false} resizable={false}>
    <VideoPlayer />

    <VideoSidebar idToCall={idToCall}>
      <VideoCallNotification />
    </VideoSidebar>

  </Dialog>
}

export default VideoCallRingingModal;