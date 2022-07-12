import React, { useEffect, useState } from "react";
import "./NotificationDropdown.css";
import { Link, NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateNotification } from "store/modules/appNotification";
import { useRef } from "react";

export default ({ showNotification, hideNotification }) => {
  const dispatch = useDispatch();
  const notificationDropdownRef = useRef(null);
  // const userNotifications = useSelector(state => state.appNotification.notifications)
  const userNotifications = useSelector(
    (state) => state.appNotification.navBarNotifications.data
  );

  const [userNoti, setUserNoti] = useState([]);
  let history = useHistory();

  const handleSeen = (noti) => {
    dispatch(updateNotification(noti.id));
  };

  useEffect(() => {
    if (userNotifications) {
      setUserNoti(userNotifications);
    }
  }, [userNotifications]);

  const handleOutsideClick = (e) => {
    console.log("outside click attached");
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(e.target)
    ) {
      console.log("you have clicked outside");
      hideNotification();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () => {
      document.removeEventListener("click", handleOutsideClick, true);
    };
  });

  return (
    <div
      ref={notificationDropdownRef}
      className={`notification-dropdown__container ${
        !showNotification && "hide"
      }`}
    >
      {userNoti && userNoti.length > 0 && (
        <>
          <div className="notification-dropdown__header">
            <p>Recent Notification</p>
          </div>
          <div className="notification-dropdown__content">
            <div className="notification-dropdown__list">
              {userNoti &&
                userNoti.length > 0 &&
                userNoti.slice(0, 6).map((noti, index) => (
                  <div key={index} className="notification-dropdown-list__item">
                    <NavLink
                      to={
                        noti.url
                          ? "/" + noti.url
                          : `/${noti.notificationType}/${noti.id}`
                      }
                      onClick={() => handleSeen(noti)}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            padding: "4px",
                          }}
                        >
                          <div style={{ width: "30%", paddingRight: "8px" }}>
                            <img
                              src="https://via.placeholder.com/50x50"
                              style={{ borderRadius: "50px" }}
                            />
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <p className="text title">{noti.message}</p>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                ))}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  padding: "4px",
                  color: "black",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                <p>
                  <Link to="/notifications">See All</Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
