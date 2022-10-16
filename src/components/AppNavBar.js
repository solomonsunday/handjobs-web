import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import agentService, { isArtisanApp } from "services/agent.service";
import { loadProfileInfo } from "./../store/modules/account";
import { forgotPassword, OnLogout } from "../store/modules/auth";

import "./AppNavBar.css";
import { ACCOUNT_TYPE } from "constants/accountType";
import { Container, Nav, Navbar } from "react-bootstrap";
import { ViewModuleFromNotification } from "helpers/viewModuleFromNotification";
import useWindowSize from "hooks/use-window-size";
import { toggleChatModal } from "store/modules/chat";
import NotificationDropdown from "./notification/NotificationDropdown";
import {
  updateNotification,
  UserNotifications,
} from "store/modules/appNotification";
import { push } from "connected-react-router";

const AppNavBar = ({ displaySearBar = false, instantJobAlert = false }) => {
  const profileInfo = useSelector((state) => state.account.profileInfo);
  const allUserNotifications = useSelector(
    (state) => state.appNotification.navBarNotifications.data
  );
  // notificetion
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const [width, height] = useWindowSize();
  const dispatch = useDispatch();
  const isCorporate =
    profileInfo.accountType === ACCOUNT_TYPE.CORPORATE ? true : false;

  const LogOut = () => {
    dispatch(OnLogout());
  };

  const userId = agentService.Auth.current().id;
  const userDetails = agentService.Auth.current();

  useEffect(() => {
    dispatch(loadProfileInfo());
  }, [dispatch]);

  useEffect(() => {
    if (allUserNotifications) {
      setNotifications(allUserNotifications);
    }
  }, [allUserNotifications]);

  useEffect(() => {
    dispatch(UserNotifications(userId));
  }, [dispatch]);

  const viewNot = (not, viewFrom) => {
    if (!not.id) return;
    dispatch(updateNotification(not.id));

    ViewModuleFromNotification(not, viewFrom);
  };

  const remove = (id) => {
    if (!id) return;
    dispatch(updateNotification(id));
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const hideNotification = () => {
    setShowNotification(false);
  };

  // const handleChangePassword = () => {
  //     // dispatch(push("/changepassword"));
  //     // dispatch(forgotPassword(userDetails.email))
  // }

  return (
    <div className="container-appNavbar">
      <Navbar
        collapseOnSelect
        expand="lg"
        className="navbar-area brown-color text-light py-2"
        style={{ borderRadius: "0px" }}
      >
        <Container className="d-flex justify-content-between">
          <div>
            <Navbar.Brand href="#home" className="navbar-brand logo" to="/dashboard">
              {/* <Link> */}
              {/* <img className="logo1" src="/assets/images/logo/applogo.jpeg" alt="Logo" height="35" /> */}
              <h3 className="text-white" style={{ fontFamily: "cursive" }}>
                HandJobs
              </h3>
              {/* </Link> */}
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              className="bg-white"
            />
          </div>
          <div>
            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="brown-color text-center"
            >
              <Nav className="me-auto text-align-sm-center">
                <Nav.Link className="text-white" href="/dashboard">
                  <i
                    className="pi pi-home itemIcon-appNavbar"
                    style={{ fontSize: "1.5em" }}
                  />
                  <div className="itemTitle-appNavbar mx-3">Home</div>
                </Nav.Link>
                <Nav.Link className="text-white" href="/posts">
                  <i
                    className="pi pi-comments itemIcon-appNavbar"
                    style={{ fontSize: "1.5em" }}
                  />
                  <div className="itemTitle-appNavbar mx-3">Posts</div>
                </Nav.Link>
                <Nav.Link className="text-white" href="/instant-jobs">
                  <i
                    className="pi pi-briefcase itemIcon-appNavbar"
                    style={{ fontSize: "1.5em" }}
                  />
                  <div className="itemTitle-appNavbar mx-3">Jobs</div>
                </Nav.Link>
                <Nav.Link className="text-white" href="/contacts">
                  <i
                    className="pi pi-users itemIcon-appNavbar"
                    style={{ fontSize: "1.5em" }}
                  />
                  <div className="itemTitle-appNavbar mx-3">Contact</div>
                </Nav.Link>
                {width <= 800 && (
                  <Nav.Link className="text-white" href="/instant-messaging">
                    <i
                      className="pi pi-envelope itemIcon-appNavbar"
                      style={{ fontSize: "1.5em" }}
                    />
                    <div className="itemTitle-appNavbar mx-3">Messages</div>
                  </Nav.Link>
                )}
                {width > 800 && (
                  <Nav.Link
                    className="text-white"
                    onClick={() => dispatch(toggleChatModal())}
                  >
                    <i
                      className="pi pi-envelope itemIcon-appNavbar"
                      style={{ fontSize: "1.5em" }}
                    />
                    <div className="itemTitle-appNavbar mx-3">Messages</div>
                  </Nav.Link>
                )}

                <span
                  className="text-white"
                  onClick={handleToggleNotification}
                  // onMouseEnter={() => setShowNotification(true)}
                  // onMouseLeave={() => setShowNotification(false)}
                  style={{
                    position: "relative",
                    paddingTop: ".6rem",
                    cursor: "pointer",
                  }}
                >
                  <div className="position-relative">
                    {notifications && notifications.length > 0 && (
                      <small className="badge bg-danger position-absolute alert-badge">
                        {notifications.length}
                      </small>
                    )}
                    <i
                      className="pi pi-bell itemIcon-appNavbar"
                      style={{ fontSize: "1.5em" }}
                    />
                  </div>
                  <div className="itemTitle-appNavbar mx-2">Notifications</div>
                  <NotificationDropdown
                    showNotification={showNotification}
                    hideNotification={hideNotification}
                  />
                </span>
              </Nav>
            </Navbar.Collapse>
          </div>
          <div className="d-flex">
            <div>
              <Link
                to={"/create-instant-hire"}
                className="button btn  text-white request-instant-job d-none d-lg-block"
                style={{
                  width: "14vw",
                  display: "block",
                  backgroundColor: "#357C3C",
                }}
              >
                <small>Request Instant Service</small>
              </Link>
            </div>
            <div
              id="profile-dropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              className="item-appNavbar d-sm-block d-none"
            >
              {profileInfo.imageUrl ? (
                <img
                  width="40"
                  height="40"
                  alt="Profile"
                  src={profileInfo?.imageUrl}
                  className="profile-image-appNavbar p-ml-2 profile-largescreen d-flex"
                />
              ) : (
                <div className="profile-largescreen">
                  <i className="pi pi-user empty-profilepic-appNavbar p-ml-2" />
                </div>
              )}
            </div>
            <ul
              aria-labelledby="profile-dropdown"
              className="dropdown-menu profileMenu-appNavbar"
            >
              <li className="dropdown-item profile-dropdownItem-appNavbar">
                <Link to={!isCorporate ? "/profile" : "/company"}>
                  <i className="li-icon lni lni-user"></i>
                  <span className="li-title">My Profile</span>
                </Link>
              </li>
              <li className="dropdown-item profile-dropdownItem-appNavbar">
                <Link to="/changepassword">
                  <i className="li-icon lni lni-lock"></i>
                  <span className="li-title">Change Password</span>
                </Link>
              </li>
              <li className="dropdown-item profile-dropdownItem-appNavbar">
                <Link to="/settings">
                  <i className="li-icon lni lni-cog"></i>
                  <span className="li-title">Settings</span>
                </Link>
              </li>
              <li
                className="dropdown-item profile-dropdownItem-appNavbar"
                onClick={LogOut}
              >
                <Link to="/howtostart">
                  <i className="li-icon lni lni-upload"></i>
                  <span className="li-title">Sign Out</span>
                </Link>
              </li>
            </ul>
          </div>
        </Container>
      </Navbar>
      {instantJobAlert && (
        <div className="alert-appNavbar">
          There are 9 available Plumbers for your location at Ikeja, Lagos
        </div>
      )}
      {displaySearBar && (
        <div className="search-bar mx-auto align-content-center">
          <div className="input-group py-4 mx-auto" style={{ width: "25rem" }}>
            <input
              type="text"
              className="form-control"
              placeholder="search for content"
              aria-label="search for content"
              aria-describedby="basic-addon2"
            />
            <span
              className="input-group-text btn brown-color"
              id="basic-addon2"
            >
              Search
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppNavBar;
