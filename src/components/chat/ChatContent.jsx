import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  actionSetSelectedContact,
  createChat,
  getConversationWithPartnerId,
  markAsRead,
} from "../../store/modules/chat";
import "./ChatContent.css";
import moment from "moment";
import { useHistory } from "react-router";
import agent from "../../services/agent.service";
import agentService from "../../services/agent.service";

const ownerStyle = {
  borderRadius: "4px",
  padding: "6px",
  margin: "4px",
  maxWidth: "70%",
  marginLeft: "auto",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 400,
  boxShadow: "2px 1px 2px #eee",
  backgroundColor: "#357C3C40",
  color: "black",
};
const partnerStyle = {
  justifyContent: "flex-start",
  display: "inline",
  borderRadius: "4px",
  padding: "6px",
  margin: "4px",
  maxWidth: "70%",
  marginRight: "auto",
  textAlign: "left",
  fontSize: "13px",
  fontWeight: 400,
  boxShadow: "2px 1px 2px #eee",
  backgroundColor: "#fff",
  color: "black",
};

const dayStyle = {
  display: "block",
  borderRadius: "4px",
  padding: "6px",
  margin: "4px",
  maxWidth: "70%",
  margin: "auto",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 400,
  boxShadow: "2px 1px 2px #eee",
  backgroundColor: "#dee2e6",
  color: "black",
};

const ChatContentItem = ({ conversation, partner, owner }) => {
  console.log(
    "realConveration ",
    conversation,
    "partner",
    partner,
    "owner",
    owner,
    "profile user",
    agentService.Auth.current().id
  );
  if (partner?.id === conversation.senderId) {
    return (
      <div style={partnerStyle}>
        <p>{conversation.message}</p>
        <time style={{ float: "right", fontStyle: "italic" }}>
          {moment(conversation.createdAt).format("h:mm a")}
        </time>
      </div>
    );
  } else if (owner?.id === conversation.senderId) {
    return (
      <div style={ownerStyle}>
        <p>{conversation.message}</p>
        <time style={{ float: "right", fontStyle: "italic" }}>
          {moment(conversation.createdAt).format("h:mm a")}
        </time>
      </div>
    );
  }
  return <div></div>;
};

const sameDay = (d1, d2) => {
  const firstDate = new Date(d1);
  const secondDate = new Date(d2);
  const same =
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();
  return same;
};

const isToday = (currDate) => {
  if (!currDate) {
    return false;
  }
  var todaysDate = new Date();
  var currentDate = new Date(currDate);

  // call setHours to take the time out of the comparison
  return currentDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0);
};

const showDate = (currDate, previousDate) => {
  if (!currDate && !previousDate) {
    return;
  }

  let result = "";
  let today = isToday(currDate);
  let isSameDay = sameDay(currDate, previousDate);

  if (previousDate && isSameDay) {
    result = "";
  } else if (!previousDate && !today) {
    result = moment(currDate).format("LL");
  } else if (!isSameDay && today) {
    result = "Today";
  } else if (!isSameDay) {
    result = moment(currDate).format("LL");
  }

  return result;
};

const ChatContent = () => {
  const history = useHistory();
  const chatMessageRef = useRef(null);
  const user = agent.Auth.current();
  const dispatch = useDispatch();
  const contact = useSelector((state) => state.chat.selectedContact);
  const handleClose = () => dispatch(actionSetSelectedContact(null));

  const getName = (contact) => {
    console.log("contact me", contact);
    return `${contact.firstName} ${contact.lastName}`;
  };

  //   const [conversations, setConversations] = React.useState([]);
  const conversations = useSelector((state) => state.chat.conversations);
  // console.log("conversations", conversations);

  useEffect(() => {
    dispatch(getConversationWithPartnerId(contact.id));
  }, [contact.id]);

  const handleRefreshConversation = () => {
    // console.log("refresh");
    dispatch(getConversationWithPartnerId(contact.id));
  };

  // console.log("contact to mess", contact);

  React.useEffect(() => {
    chatMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contact]);
  React.useEffect(() => {
    if (conversations?.conversation) {
      const hasUnreadMessges = conversations?.conversation?.some(
        (x) => x.read == false
      );
      if (hasUnreadMessges) {
        dispatch(markAsRead(conversations?.partner.id));
      }
      chatMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  const handleSendChat = (message) => {
    const partner = conversations?.partner;
    const owner = conversations?.owner;
    const newConversation = {
      conversation: {
        title: getName + "-" + new Date().toISOString(),
        recieverId: contact.id,
        senderId: agentService.Auth.current().id,
        message,
        imageUrl: "",
        audioUrl: "",
        videoUrl: "",
        createdAt: new Date().toISOString(),
      },
      partner,
      owner,
    };
    // const reply = {
    //   title: "Chat",
    //   recieverId: "",
    //   message: "Replying your message",
    //   imageUrl: "",
    //   audioUrl: "",
    //   videoUrl: "",
    // };
    dispatch(createChat(newConversation));
    // setConversations([...conversations, newConversation, reply]);
    chatMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`chat-content-container`}>
      <div className="chat-content-header">
        <div className="left">
          <img
            className="rounded-image"
            style={{ width: "40px", height: "40px" }}
            src={contact.imageUrl ?? "https://source.unsplash.com/random/50x50"}
          />
          <h4
            style={{ cursor: "pointer" }}
            onClick={() => history.push(`/applicant/${contact.id}`)}
          >
            {getName(contact)}
          </h4>
        </div>
        <div className="right">
          <i onClick={handleClose} className="pi pi-times"></i>
        </div>
      </div>
      <div className="chat-content-body">
        <div className="chat-content-messages" style={{ display: "flex" }}>
          {conversations?.conversation?.map((conversation, index) => {
            console.log("conversation object", conversation);
            // return <p>{conversation.message}</p>;
            return (
              <>
                {showDate(
                  conversation.createdAt,
                  conversations.conversation[index - 1]?.createdAt
                ) ? (
                  <div style={{ ...dayStyle }}>
                    {showDate(
                      conversation.createdAt,
                      conversations.conversation[index - 1]?.createdAt
                    )}
                  </div>
                ) : (
                  <></>
                )}
                <ChatContentItem
                  key={index}
                  conversation={conversation}
                  partner={conversations?.partner}
                  owner={conversations?.owner}
                />
                <div ref={chatMessageRef}></div>
              </>
            );
          })}
        </div>
      </div>

      <ChatContentInput handleSendChat={handleSendChat} />
    </div>
  );
};

const ChatContentInput = ({ handleSendChat }) => {
  const [message, setMessage] = React.useState("");

  return (
    <div className="chat-content-input">
      <input
        type="text"
        placeholder="type your message"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleSendChat(message);
            setMessage("");
          }
        }}
      />
      <button
        disabled={!message}
        className="btn-primary"
        onClick={() => {
          handleSendChat(message);
          setMessage("");
        }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatContent;
