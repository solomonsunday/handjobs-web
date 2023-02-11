import React from "react";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <div>
      <header className="header">
        <div className="navbar-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg py-2">
                  <Link className="navbar-brand logo" to="index.html">
                    {/* <img className="logo1" src="assets/images/logo/applogo.jpeg" height="40px" alt="Logo" /> */}
                    <h3
                      className="app-pri-text-color"
                      style={{ fontFamily: "cursive" }}
                    >
                      HandJobs
                    </h3>
                  </Link>
                  <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                  </button>
                  <div
                    className="collapse navbar-collapse sub-menu-bar"
                    id="navbarSupportedContent"
                  ></div>

                  <div className="button">
                    <div className="d-flex">
                      <Link to="/login" className="login">
                        {" "}
                        <span>
                          <i className="lni lni-lock-alt"></i>
                        </span>
                        Login
                      </Link>
                    </div>
                    <div>
                      {" "}
                      <Link to="/register" className="btn">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingHeader;
