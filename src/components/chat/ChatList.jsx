import React, { useEffect } from "react";
import { Avatar } from "primereact/avatar";
import chatJSON from "./chat.json";
import {
  actionSetSelectedContact,
  actionSetTotalUnread,
  markAsRead,
} from "../../store/modules/chat";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import ChatAvatar from "../../assets/avatar-chat.png";

const ChatList = () => {
  const dispatch = useDispatch();
  const selectedContact = useSelector((state) => state.chat.contact);
  const contact = useSelector((state) => state.contact.contacts);
  const [contacts, setContacts] = React.useState([]);
  const conversationList = useSelector((state) => state.chat.conversationList);
  const [conversations, setConversations] = React.useState([]);
  const [filteredContacts, setFilteredContact] = React.useState([]);

  useEffect(() => {
    if (contact) {
      const localContacts = transformObjToList(contact);
      setContacts(localContacts);
      setFilteredContact(localContacts);
    }
  }, [contact]);

  useEffect(() => {
    if (conversationList) {
      setConversations(conversationList);
      const totalUnread = conversationList.filter(
        (x) => x.unReadCount > 0
      ).length;
      dispatch(actionSetTotalUnread(totalUnread));
    }
  }, [conversationList]);

  const transformObjToList = (contact) => {
    return contact.ids.map((id) => contact.data[id]);
  };
  const handleSelected = (contact, unReadCount = 0) => {
    dispatch(actionSetSelectedContact(contact));
    if (unReadCount > 0) {
      dispatch(markAsRead(contact.id));
    }
  };

  const [toggleContact, setToggleContact] = React.useState(false);

  const handleShowContacts = () => {
    setToggleContact(!toggleContact);
  };

  const handleSearchContactInList = (e) => {
    const query = e.target.value;

    if (query.length) {
      let newContacts = contacts.filter((contact) =>
        contact.firstName.toLowerCase().includes(query)
      );
      setFilteredContact(newContacts);
    } else {
      setFilteredContact(contacts);
    }
  };

  const handleSearchConversationInList = (e) => {
    const query = e.target.value;
  };

  if (!toggleContact)
    return (
      <>
        <div className="p-d-flex p-ai-center searchbox">
          <div className=" " style={{ width: "100%" }}>
            <input
              type="text"
              placeholder="search conversation"
              className="search-input"
              style={{ width: "100%" }}
              onChange={handleSearchConversationInList}
            />
          </div>
          <div
            className="p-2 ml-2"
            style={{ boxShadow: "2px 1px 2px #eee", backgroundColor: "#eee" }}
          >
            <i onClick={handleShowContacts} className="pi pi-plus"></i>
          </div>
        </div>
        <div className="contact-list">
          {conversations.length === 0 && (
            <div className="p-d-flex p-jc-center p-ai-center">
              <p>No recent conversation</p>
            </div>
          )}
          {conversations.map((item) => {
            console.log("item chat", item);
            return (
              <div
                key={item.id}
                onClick={() => {
                  // console.log("item selected", item);
                  handleSelected(item.partner, item.unReadCount);
                }}
                className={`contact-item ${
                  selectedContact && item?.partner.id === selectedContact.id
                    ? "selected"
                    : ""
                }`}
              >
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={item?.partner?.imageUrl ?? ChatAvatar}
                />
                <div className="contact-detail">
                  <h4>
                    {item?.partner?.firstName} {item?.partner?.lastName}
                    {item.unReadCount ? (
                      <span className="mx-1 px-1 py-1 text-white badge bg-danger">
                        {item.unReadCount}
                      </span>
                    ) : (
                      <></>
                    )}
                  </h4>
                  <p>{item.message}</p>
                </div>
                <div className="last-seen">
                  <small>{moment(item.createdAt).format("hh:mma")}</small>{" "}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );

  return (
    <>
      <div className="p-d-flex p-ai-center searchbox">
        <div className=" " style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="search contact"
            className="search-input"
            style={{ width: "100%" }}
            onChange={handleSearchContactInList}
          />
        </div>
        <div
          className="p-2 ml-2"
          style={{ boxShadow: "2px 1px 2px #eee", backgroundColor: "#eee" }}
        >
          <i onClick={handleShowContacts} className="pi pi-times"></i>
        </div>
      </div>
      <div className="contact-list">
        {filteredContacts.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              console.log("item seleected", item);
              handleSelected({ ...item, messages: [] });
            }}
            className={`contact-item ${
              selectedContact && item.id === selectedContact.id
                ? "selected"
                : ""
            }`}
          >
            <img
              style={{ width: "40px", height: "40px" }}
              src={item.imageUrl ?? ChatAvatar}
            />
            <div className="contact-detail">
              <h4>
                {item.firstName} {item.lastName}
              </h4>
              <p>{item.email}</p>
            </div>
            <div className="last-seen">
              <p>{item.lastSeen}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default ChatList;
/**
 *
 */
