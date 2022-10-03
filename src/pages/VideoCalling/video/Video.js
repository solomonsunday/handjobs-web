import React, { useContext, useEffect, useState, useRef } from "react";
import "./video.css";
// import {message } from "antd";
import { io } from "socket.io-client";
// import Profile from "../../assests/profile.svg";

import * as classes from "./Options.module.css";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import Hang from "../../../../src/assets/images/hang.svg";
import Msg from "../../../../src/assets/images/msg.svg";
// import Msg_Illus from "../../../../src/assets/images/msg_Illus.svg";
import Phone from "../../../../src/assets/images/phone.gif";
import Teams from "../../../../src/assets/teams.mp3";
import VideoOff from "../../../../src/assets/images/video-off.svg";
import Peer from "simple-peer";
import { FaPhoneAlt, FaMicrophoneAltSlash, FaMicrophoneAlt } from "react-icons/fa";
import { IconName } from "react-icons/fa";


import VideoIcon from "../../../../src/assets/images/video.svg"
// import {
//     TwitterIcon,
//     TwitterShareButton,
//     WhatsappShareButton,
//     WhatsappIcon,
//     FacebookIcon,
//     FacebookShareButton,
// } from "react-share";
// import {
//     InfoCircleOutlined,
//     PhoneOutlined,
// } from "@ant-design/icons";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useHistory } from "react-router";
import { videoCallSocket } from "App";

// const socket = io()

const URL = "https://fathomless-tundra-67025.herokuapp.com/";
// const SERVER_URL = "http://localhost:5000/";

const socket = videoCallSocket;

const Video = () => {

    // const [sendMsg, setSendMsg] = useState("");

    const [callAccepted, setCallAccepted] = useState(false);
    const [userName, setUserName] = useState("");
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [chat, setChat] = useState([]);
    const [name, setName] = useState("");
    const [call, setCall] = useState({});
    const [me, setMe] = useState("");
    const [otherUser, setOtherUser] = useState("");
    const [myVdoStatus, setMyVdoStatus] = useState(true);
    const [myMicStatus, setMyMicStatus] = useState(true);
    const [userVdoStatus, setUserVdoStatus] = useState();
    const [userMicStatus, setUserMicStatus] = useState();
    const [msgRcv, setMsgRcv] = useState("");
    const [screenShare, setScreenShare] = useState(false)

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const screenTrackRef = useRef();

    const history = useHistory()



    const [idToCall, setIdToCall] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);

    socket.on("msgRcv", ({ name, msg: value, sender }) => {
        let msg = {};
        msg.msg = value;
        msg.type = "rcv";
        msg.sender = sender;
        msg.timestamp = Date.now();
        setChat([...chat, msg]);
    });


    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });
        if (localStorage.getItem("name")) {
            setName(localStorage.getItem("name"));
        }
        // socket.on("me", (id) => setMe(id));
        socket.on("endCall", () => {
            window.location.reload();
        });

        socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
            if (currentMediaStatus !== null || currentMediaStatus !== []) {
                switch (type) {
                    case "video":
                        setUserVdoStatus(currentMediaStatus);
                        break;
                    case "mic":
                        setUserMicStatus(currentMediaStatus);
                        break;
                    default:
                        setUserMicStatus(currentMediaStatus[0]);
                        setUserVdoStatus(currentMediaStatus[1]);
                        break;
                }
            }
        });

        socket.on("callUser", ({ from, name: callerName, signal }) => {
            console.log('on ringing', from, name)
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        socket.on("msgRcv", ({ name, msg: value, sender }) => {
            setMsgRcv({ value, sender });
            setTimeout(() => {
                setMsgRcv({});
            }, 2000);
        });

        return () => {
            stream?.getTracks().forEach(track => track.stop())
        }
    }, []);

    const dummy = useRef();

    useEffect(() => {
        if (dummy?.current) dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    // showModal = (showVal) => {
    //     setIsModalVisible(showVal);
    // };

    // const onSearch = (value) => {
    //     if (value && value.length) sendMsgFunc(value);
    //     setSendMsg("");
    // };

    useEffect(() => {
        if (msgRcv.value && !isModalVisible) {
            // notification.open({
            //     message: "",
            //     description: `${msgRcv.sender}: ${msgRcv.value}`,
            //     // icon: <MessageOutlined style={{ color: "#108ee9" }}
            //     // />,
            // });
        }
    }, [msgRcv]);


    // ALL SOCKET VIDEO CALL ACTIONS

    const answerCall = () => {
        setCallAccepted(true);
        setOtherUser(call.name);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("answerCall", {
                signal: data,
                to: call.from,
                userName: call.name,
                type: "both",
                myMediaStatus: [myMicStatus, myVdoStatus],
            });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
        console.log(connectionRef.current);
    };

    const updateVideo = () => {
        setMyVdoStatus((currentStatus) => {
            socket.emit("updateMyMedia", {
                type: "video",
                currentMediaStatus: !currentStatus,
            });
            stream.getVideoTracks()[0].enabled = !currentStatus;
            return !currentStatus;
        });
    };

    const updateMic = () => {
        setMyMicStatus((currentStatus) => {
            socket.emit("updateMyMedia", {
                type: "mic",
                currentMediaStatus: !currentStatus,
            });
            stream.getAudioTracks()[0].enabled = !currentStatus;
            return !currentStatus;
        });
    };


    //SCREEN SHARING 
    const handleScreenSharing = () => {

        if (!myVdoStatus) {
            // message.error("Turn on your video to share the content", 2);
            alert("Hi")
            return;
        }

        if (!screenShare) {
            navigator.mediaDevices
                .getDisplayMedia({ cursor: true })
                .then((currentStream) => {
                    const screenTrack = currentStream.getTracks()[0];


                    // replaceTrack (oldTrack, newTrack, oldStream);
                    connectionRef.current.replaceTrack(
                        connectionRef.current.streams[0]
                            .getTracks()
                            .find((track) => track.kind === 'video'),
                        screenTrack,
                        stream
                    );

                    // Listen click end
                    screenTrack.onended = () => {
                        connectionRef.current.replaceTrack(
                            screenTrack,
                            connectionRef.current.streams[0]
                                .getTracks()
                                .find((track) => track.kind === 'video'),
                            stream
                        );

                        myVideo.current.srcObject = stream;
                        setScreenShare(false);
                    };

                    myVideo.current.srcObject = currentStream;
                    screenTrackRef.current = screenTrack;
                    setScreenShare(true);
                }).catch((error) => {
                    console.log("No stream for sharing")
                });
        } else {
            screenTrackRef.current.onended();
        }
    };

    //full screen
    const fullScreen = (e) => {
        const elem = e.target;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Chrome, Safari & Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE/Edge */
            elem.msRequestFullscreen();
        }
    };

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();
        socket.emit("endCall", { id: otherUser });
        window.location.reload();
        history.goBack()
    };

    const leaveCall1 = () => {
        socket.emit("endCall", { id: otherUser });
    };
    // sendMsg = (value) => {
    //     socket.emit("msgUser", { name, to: otherUser, msg: value, sender: name });
    //     let msg = {};
    //     msg.msg = value;
    //     msg.type = "sent";
    //     msg.timestamp = Date.now();
    //     msg.sender = name;
    //     setChat([...chat, msg]);
    // };

    //OPTIONS ACTION FUNCTIONS
    useEffect(() => {
        if (isModalVisible) {
            Audio?.current?.play();
        } else Audio?.current?.pause();
    }, [isModalVisible]);

    // const showModal = (showVal) => {
    //     setIsModalVisible(showVal);
    // };

    const handleCancel = () => {
        // setIsModalVisible(false);
        leaveCall1();
        window.location.reload();
    };
    useEffect(() => {
        if (call.isReceivingCall && !callAccepted) {
            // setIsModalVisible(true);
            setOtherUser(call.from);
        }
        // else setIsModalVisible(false);
    }, [call.isReceivingCall]);
    return (
        <>
            <div className="App" style={{ height: "100%", width: "100%" }}>

                <div className="">
                    {stream ? (
                        <div
                            style={{ textAlign: "center" }}
                            className="card"
                            id={callAccepted && !callEnded ? "video1" : "video3"}
                        >
                            <div style={{ height: "2rem" }}>
                                <h3>{myVdoStatus && name}</h3>
                            </div>
                            <div className="video-avatar-container">
                                <video
                                    playsInline
                                    muted
                                    onClick={fullScreen}
                                    ref={myVideo}
                                    autoPlay
                                    className={`${callAccepted ? "video-active" : ""}`}
                                    style={{
                                        opacity: `${myVdoStatus ? "1" : "0"}`,
                                    }}
                                />

                                <div
                                    style={{
                                        backgroundColor: "#116",
                                        position: "absolute",
                                        opacity: `${myVdoStatus ? "-1" : "2"}`,
                                    }}
                                    size={98}
                                // icon={!name && <UserOutlined />}
                                >
                                    {name}
                                </div>
                            </div>

                            <div className="iconsDiv">
                                <div
                                    className="icons"
                                    onClick={() => {
                                        updateMic();
                                    }}
                                    tabIndex="0"
                                >
                                    <FaMicrophoneAlt
                                        className={`fa fa-microphone${myMicStatus ? "" : "Slash"}`}
                                        style={{ transform: "scaleX(-1)" }}
                                        aria-label={`${myMicStatus ? "mic on" : "mic off"}`}
                                        aria-hidden="true"
                                    />
                                </div>

                                {callAccepted && !callEnded && (
                                    <div
                                        className="icons"
                                        onClick={() => {
                                            // setIsModalVisible(!isModalVisible);
                                        }}
                                        tabIndex="0"
                                    >
                                        <img src={Msg} alt="chat icon" />
                                    </div>
                                )}

                                {callAccepted && !callEnded && (
                                    <div
                                        className="icons"
                                        onClick={() => handleScreenSharing()}
                                        tabIndex="0"
                                    >
                                    </div>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={leaveCall}
                                    className={classes.hang}
                                    tabIndex="0"
                                >
                                    <img src={Hang} alt="hang up" style={{ height: "15px" }} />
                                    &nbsp; End Call
                                </Button>
                                <div className="icons" onClick={() => updateVideo()} tabIndex="0">
                                    {myVdoStatus ? (
                                        <img src={VideoIcon} alt="video on icon" />
                                    ) : (
                                        <img src={VideoOff} alt="video off icon" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bouncing-loader">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    )}

                    {callAccepted && !callEnded && userVideo && (
                        <div className="card2" style={{ textAlign: "center" }} id="video2">
                            <div style={{ height: "2rem" }}>
                                <h3>{userVdoStatus && (call.name || userName)}</h3>
                            </div>

                            <div className="video-avatar-container">
                                <video
                                    playsInline
                                    ref={userVideo}
                                    onClick={fullScreen}
                                    autoPlay
                                    className="video-active"
                                    style={{
                                        opacity: `${userVdoStatus ? "1" : "0"}`,
                                    }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={leaveCall}
                                    className={classes.hang}
                                    tabIndex="0"
                                >
                                    <img src={Hang} alt="hang up" style={{ height: "15px" }} />
                                    &nbsp; Hang up
                                </Button>

                                <span
                                    style={{
                                        backgroundColor: "#116",
                                        position: "absolute",
                                        opacity: `${userVdoStatus ? "-1" : "2"}`,
                                    }}
                                    size={98}
                                    icon={!(userName || call.name) && "yes"}
                                >
                                    {userName || call.name}
                                </span>

                                {!userMicStatus && (
                                    <i
                                        style={{
                                            position: "absolute",
                                            top: "0",
                                            left: "0",
                                            padding: "0.3rem",
                                            backgroundColor: "#fefefebf",
                                        }}
                                        className="fad fa-volume-mute fa-2x"
                                        aria-hidden="true"
                                        aria-label="microphone muted"
                                    ></i>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {/* <div style={{ marginBottom: "0.5rem" }}>
                        <h2>Account Info</h2>
                        <InputText
                            size="large"
                            placeholder="Your name"
                            // prefix={<UserOutlined />}
                            maxLength={15}
                            suffix={<small>{name.length}/15</small>}
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                localStorage.setItem("name", e.target.value);
                            }}
                            className={classes.inputgroup}
                        />

                        <div className={classes.share_options}>
                        </div>
                    </div> */}
                    {/* <div style={{ marginBottom: "0.5rem" }}>

                        {callAccepted && !callEnded ? (
                            <Button
                                variant="contained"
                                onClick={leaveCall}
                                className={classes.hang}
                                tabIndex="0"
                            >
                                <img src={Hang} alt="hang up" style={{ height: "15px" }} />
                                &nbsp; Hang up
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                icon={<FaPhoneAlt />}
                                onClick={() => {
                                    if (name.length) callUser(idToCall);
                                    else alert("enter a name");
                                }}
                                className={classes.btn}
                                tabIndex="0"
                            >
                                Call
                            </Button>
                        )}
                    </div> */}

                    {call.isReceivingCall && !callAccepted && (
                        <>
                            <audio src={Teams} loop ref={Audio} />
                            <div
                                title="Incoming Call"
                                visible={isModalVisible}
                                // onOk={() => showModal(false)}
                                onCancel={handleCancel}
                                footer={null}
                            >
                                <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    <h1>
                                        {call.name} is calling you:{" "}
                                        <img
                                            src={Phone}
                                            alt="phone ringing"
                                            className={classes.phone}
                                            style={{ display: "inline-block" }}
                                        />
                                    </h1>
                                </div>
                                <div className={classes.btnDiv}>
                                    <Button
                                        variant="contained"
                                        className={classes.answer}
                                        color="#29bb89"
                                        icon={<FaPhoneAlt />}
                                        onClick={() => {
                                            answerCall();
                                            Audio.current.pause();
                                        }}
                                        tabIndex="0"
                                    >
                                        Answer
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className={classes.decline}
                                        icon={<FaPhoneAlt />}
                                        onClick={() => {
                                            // setIsModalVisible(false);
                                            Audio.current.pause();
                                        }}
                                        tabIndex="0"
                                    >
                                        Decline
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>

    );
};

export default Video;
