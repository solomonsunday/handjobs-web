import React, { useContext, useState } from "react";
import {
  BsFillChatDotsFill,
  BsFillCameraVideoFill,
  BsFillTrashFill,
  BsFillTelephoneFill,
} from "react-icons/bs";
import { ACCOUNT_TYPE } from "constants/accountType";
import { formatter } from "../../helpers/converter";
import {
  loadContacts,
  removeContact,
  blockContact,
  unblockContact,
} from "../../store/modules/contact";
import { confirmDialog } from "primereact/confirmdialog";
import { actionSetSelectedContact } from "store/modules/chat";
import { useDispatch } from "react-redux";
import { SocketContext } from "contexts/VideoContext";
import { Link } from "react-router-dom";
import { push } from "connected-react-router";

const ContactListItem = ({ contact, setSelectedId }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    onlineUsers,
  } = useContext(SocketContext);
  const [videoCallingUser, setVideoCallingUser] = useState(false);
  const dispatch = useDispatch();

  const handleVideoCall = (id) => {
    const onlineUser = onlineUsers[id];
    if (!onlineUser) {
      alert("this user is not available at the moment");
      return;
    }
    const { socketId } = onlineUser;
    //expect name and the usr to call ID

    console.log("socket id", socketId);
    // and then route to the video call page
    callUser(socketId);
    setVideoCallingUser(true);
    dispatch(push("/videochat"));
  };

  const handleOpenChatRoom = (contact) => {
    dispatch(actionSetSelectedContact(contact));
  };

  const getCurrentJobExperience = (experiences) => {
    if (experiences && experiences.length) {
      const experience =
        experiences.find((experience) => experiences.current === true) ||
        experiences[0];
      return (
        <div>
          {experience.jobTitle} at {experience.company}
        </div>
      );
    }
    return <div></div>;
  };

  const confirmRemove = (e) => {
    let contactId = e.currentTarget.dataset.id;
    let firstName = e.currentTarget.dataset.firstName;
    let lastName = e.currentTarget.dataset.lastName;
    confirmDialog({
      message: `Are you sure you want to remove ${formatter.capitalizeFirstLetter(
        firstName
      )} ${formatter.capitalizeFirstLetter(lastName)} from your contact list?`,
      header: "Remove from Contact List",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        setSelectedId(contactId);
        dispatch(removeContact(contactId));
      },
    });
  };

  const confirmBlock = (e) => {
    let contactId = e.currentTarget.dataset.id;
    let firstName = e.currentTarget.dataset.firstName;
    let lastName = e.currentTarget.dataset.lastName;
    confirmDialog({
      message: `Are you sure you want to block ${formatter.capitalizeFirstLetter(
        firstName
      )} ${formatter.capitalizeFirstLetter(lastName)}?`,
      header: "Block Contact",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        dispatch(blockContact(contactId));
      },
    });
  };

  const confirmUnblock = (e) => {
    let contactId = e.currentTarget.dataset.id;
    let firstName = e.currentTarget.dataset.firstName;
    let lastName = e.currentTarget.dataset.lastName;
    confirmDialog({
      message: `Are you sure you want to unblock ${formatter.capitalizeFirstLetter(
        firstName
      )} ${formatter.capitalizeFirstLetter(lastName)}?`,
      header: "Unblock Contact",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        dispatch(unblockContact(contactId));
      },
    });
  };

  return (
    <div
      className="p-card contact-individualContainer"
      key={contact.id}
      style={{ borderRadius: "1rem" }}
    >
      <span className="d-flex">
        {contact.imageUrl && (
          <img
            src={contact?.imageUrl}
            width="85"
            height="85"
            alt={`${contact?.firstName}'s profile`}
            className="rounded-circle contact-profilePicture p-mr-3"
          />
        )}
        {!contact.imageUrl && (
          <i className="pi pi-user contact-emptyProfilePic p-mr-3"></i>
        )}
        <span className="">
          <span className="p-card-title contacts-contactHeader p-mb-0">
            <Link to={`/applicant/${contact.id}`}>
              {" "}
              <span className="p-mr-2 app-color" title="View user's profile">
                {`${formatter.capitalizeFirstLetter(
                  contact?.firstName
                )} ${formatter.capitalizeFirstLetter(contact?.lastName)}`}
              </span>{" "}
            </Link>
            {contact.accountType === ACCOUNT_TYPE.ARTISAN && (
              <div className="stars" style={{ "--rating": contact.rating }} />
            )}
          </span>
          {getCurrentJobExperience(contact.experiences)}
          <small>
            <b>Email:</b> {contact?.email || "Unavailable"}
          </small>
          <div>
            {onlineUsers !== null && onlineUsers[contact?.id] !== undefined && (
              <span
                style={{
                  padding: "2px",
                  backgroundColor: "green",
                  borderRadius: "4px",
                  color: "white",
                }}
              >
                Online
              </span>
            )}
          </div>
        </span>
      </span>
      <div className="contacts-actionIcons d-flex">
        {/* <i className="pi pi-phone p-pr-2" /> */}
        <div className="finger">
          <BsFillTelephoneFill fontSize={25} />
        </div>
        {/* <i className="pi pi-video p-pr-2 text-success" /> */}
        <div
          className="px-2 finger"
          onClick={() => {
            handleVideoCall(contact.id);
            setName(
              `${formatter.capitalizeFirstLetter(
                contact?.firstName
              )} ${formatter.capitalizeFirstLetter(contact?.lastName)}`
            );
          }}
        >
          {videoCallingUser ? (
            <h3>Calling...</h3>
          ) : (
            <BsFillCameraVideoFill fontSize={30} />
          )}
        </div>
        {/* <i
        className="pi pi-comments p-pr-2"
        onClick={() => handleOpenChatRoom(contact)}
      /> */}
        <div className="finger">
          <BsFillChatDotsFill
            fontSize={30}
            onClick={() => handleOpenChatRoom(contact)}
          />
        </div>
        {!contact.blocked && (
          <div>
            <i
              data-id={contact.id}
              onClick={confirmBlock}
              className="pi pi-ban p-pr-2 text-warning"
              data-last-name={contact.lastName}
              data-first-name={contact.firstName}
            />
          </div>
        )}
        {contact.blocked && (
          <div>
            <i
              data-id={contact.id}
              onClick={confirmUnblock}
              className="pi pi-ban p-pr-2 text-green"
              data-last-name={contact.lastName}
              data-first-name={contact.firstName}
            />
          </div>
        )}

        <div>
          <i
            data-id={contact.id}
            onClick={confirmRemove}
            className="pi pi-trash p-pr-2 text-danger"
            data-last-name={contact.lastName}
            data-first-name={contact.firstName}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactListItem;
