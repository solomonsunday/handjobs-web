import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import "./InstantJobHire.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllInstantJobs } from "store/modules/instantJob";

const InstantHeader = ({
  title,
  showCreateButton = false,
  showBack = false,
  showGoBack = false,
  count,
  showSearchBar = false,
  placeholder = "Search instant jobs",
}) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const loading = useSelector((state) => state.contact.loadingContact);
  const history = useHistory();

  const handleSearchInputChange = (e) => {
    const inputValue = e.target.name === "clear" ? "" : e.currentTarget.value;
    if (inputValue) {
      setSearchValue(inputValue);
      dispatch(fetchAllInstantJobs(page, take));
    } else {
      setSearchValue("");
      // dispatch(loadFreeUsers(1, 10, "loadingFreeUsers"))
    }
  };

  return (
    <>
      <header className="instant d-flex">
        <div className="title-container w-100">
          <h2 className="title sm-screen ">
            {title} {count > 0 && `(${count})`}{" "}
          </h2>
        </div>

        {showSearchBar && (
          <div className="d-flex align-items-baseline">
            <div className="p-input-icon-right searchInput-container-contact">
              <div className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  className="p-mr-2 p-pr-5 contact-searchInput"
                  placeholder={placeholder}
                  value={searchValue}
                  onChange={handleSearchInputChange}
                />
              </div>
              {loading === "searchUsers" && (
                <i className="pi pi-spin pi-spinner p-mr-2" />
              )}
              {searchValue && loading !== "searchUsers" && (
                <i className="pi pi-times p-mr-2" name="clear" />
              )}
            </div>
          </div>
        )}
        <div className="flex-shrink-0">
          {showCreateButton && (
            <Link to="/create-instant-hire">
              {" "}
              <Button
                iconPos="left"
                label="Create Request"
                className="create-btn on-hover rounded-pill"
                type="button"
              />
            </Link>
          )}
          {showGoBack && (
            <div
              onClick={() => history.goBack()}
              className="bk-btn p-pt-2 app-color"
            >
              <i className="pi pi-arrow-left on-hover"></i>
            </div>
          )}
          {showBack && (
            <Link to="/artisans" className="bk-btn p-pt-2 app-color">
              <i className="pi pi-arrow-left on-hover"></i>
            </Link>
          )}
        </div>
      </header>
      <hr className="font-weight-bolder appcolor" />
    </>
  );
};

export default InstantHeader;
