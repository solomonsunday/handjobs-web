import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadContacts } from "../../store/modules/contact";

import { Button } from "primereact/button";
import ConnectionRequestPanel from "./ConnectionRequestPanel";
import "./Contacts.css";


import ContactListItem from "./ContactListItem";


const List = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.contact.loadingContact);
  const error = useSelector((state) => state.contact.error);
  const meta = useSelector((state) => state.contact.contacts.meta);

  const [selectedId, setSelectedId] = useState(-1)
  const [userToCallId, setUserToCallId] = useState(undefined);

  // for contact list
  const pageLimit = 10;
  const contacts = useSelector((state) => state.contact.contacts);
  const contactContainerClassName =
    contacts.ids.length < 4 ? "containerHeight-contact" : "";
  const [pageNumber, setPageNumber] = useState(1);


  const loadMoreContacts = () => {
    dispatch(loadContacts(pageNumber + 1, pageLimit, "loadMoreContacts"));
    setPageNumber(pageNumber + 1);
  };


  useEffect(() => {
    dispatch(loadContacts(1, pageLimit, "loadingContacts"));
  }, [dispatch]);



  // if (loading) {
  //   return <div className={`contacts-container ${contactContainerClassName}`}>
  //     <div className="custom-skeleton p-p-4">
  //       <ul className="p-m-0 p-p-0">
  //         <li className="p-mb-3">
  //           <div className="p-d-flex">
  //             <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
  //             <div style={{ flex: '1' }}>
  //               <Skeleton width="100%" className="p-mb-2"></Skeleton>
  //               <Skeleton width="75%"></Skeleton>
  //             </div>
  //           </div>
  //         </li>
  //         <li className="p-mb-3">
  //           <div className="p-d-flex">
  //             <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
  //             <div style={{ flex: '1' }}>
  //               <Skeleton width="100%" className="p-mb-2"></Skeleton>
  //               <Skeleton width="75%"></Skeleton>
  //             </div>
  //           </div>
  //         </li>
  //         <li className="p-mb-3">
  //           <div className="p-d-flex">
  //             <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
  //             <div style={{ flex: '1' }}>
  //               <Skeleton width="100%" className="p-mb-2"></Skeleton>
  //               <Skeleton width="75%"></Skeleton>
  //             </div>
  //           </div>
  //         </li>
  //         <li>
  //           <div className="p-d-flex">
  //             <Skeleton shape="circle" size="4rem" className="p-mr-2"></Skeleton>
  //             <div style={{ flex: '1' }}>
  //               <Skeleton width="100%" className="p-mb-2"></Skeleton>
  //               <Skeleton width="75%"></Skeleton>
  //             </div>
  //           </div>
  //         </li>
  //       </ul>
  //     </div>
  //   </div>
  // }

  return (
    <>
      <div className={`contacts-container ${contactContainerClassName}`}>
        <div className="p-grid contacts-content">
          <div className="p-col-12 p-md-9">
            <div className="p-card" style={{ borderRadius: "1rem" }}>
              <div className="p-card-title d-flex justify-content-between align-items-center">
                <span className="contact-cardtitle">
                  <i className="pi pi-book p-pr-2" />
                  Contacts
                </span>
                <span>
                  <Link to="/contacts/create">
                    <Button className="contacts-cardsubtitle p-mr-3 rounded-pill on-hover">
                      Add New Contact
                    </Button>
                  </Link>
                </span>
              </div>
            </div>

            {contacts.ids?.map((contactId) => {
              const contact = contacts.data[contactId];
              // console.log('CONTACT TO CALL', contact)
              if (!contact) {
                return null;
              }
              return (
                <ContactListItem key={contact.id} contact={contact} setSelectedId={setSelectedId} setUserToCallId={setUserToCallId} />
              );
            })}
            {contacts.ids.length > 0 && (
              <Button
                label={
                  loading === "loadMoreContacts" ? "Loading..." : "Load More"
                }
                onClick={loadMoreContacts}
                className="p-mr-2 w-100 rounded-pill on-hover"
              />
            )}
            {contacts.ids.length === 0 && loading !== "loadingContacts" && (
              <div className="p-card p-p-4 p-mb-2 d-flex justify-content-center">
                <div className="text-center">
                  <span className="p-card-title ">
                    Oops. Contact List is Empty
                  </span>
                  <Link to="/contacts/create">
                    Find users to add to contact list
                  </Link>
                </div>
              </div>
            )}
            {loading === "loadingContacts" && contacts.ids.length === 0 && (
              <div className="p-p-5 d-flex justify-content-center">
                <i
                  className="pi pi-spin pi-spinner"
                  style={{ fontSize: "2em", color: "var(--app-primary-color)" }}
                />
              </div>
            )}
          </div>
          <ConnectionRequestPanel
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>
    </>
  );
};

export default List;
