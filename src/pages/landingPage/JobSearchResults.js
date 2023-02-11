import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InstantHeader from "pages/instant-job-hire/instant-header";
import { Button } from "primereact/button";
import { applyInstantJob, fetchAllInstantJobs } from "store/modules/instantJob";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import agent from "../../services/agent.service";
import { showMessage } from "store/modules/notification";

import "./LandingPage.css";

import "../instant-jobs/Instant-Jobs.css";
import LandingHeader from "components/LandingHeader/LandingHeader";
import { getServicesByServiceGroupId } from "store/modules/service";
import { push } from "connected-react-router";
import Spinner from "components/spinner/spinner.component";

const InstantJobs = () => {
  const dispatch = useDispatch();
  const servicesResults = useSelector(
    (state) => state.service.serviceByServiceGroup
  ).data;
  const busy = useSelector((state) => state.service?.busy);

  const selectedServiceName = useSelector(
    (state) => state.service.serviceValue
  );
  console.log(servicesResults, "selectedServiceName");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    if (!selectedServiceName) return;
    localStorage.setItem("selectedServiceName", selectedServiceName);
  }, [selectedServiceName]);

  useEffect(() => {
    let serviceName = localStorage.getItem("selectedServiceName");
    dispatch(
      getServicesByServiceGroupId(page, limit, search, sort, serviceName)
    );
  }, []);

  const handleApply = (id, i) => {
    confirmDialog({
      message: "kindly login to apply for this job",
      header: "Authetication Required",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        dispatch(push("/login"));
        const element = document.getElementById(i);
        const element2 = document.getElementById(`${i}_int`);

        element.hidden = false;
        element2.hidden = true;
      },
      reject: () => {
        return;
      },
    });
  };

  return (
    <>
      <div className="background">
        <LandingHeader />
        <div className="">
          <div className="search-result-content-container">
            <div
              className="p-col-12 p-md-9 mt-5"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <div
                className="card card-max-size-list"
                style={{ borderRadius: "0.5rem" }}
              >
                <InstantHeader
                  title="All Instant Jobs"
                  showCreateButton={false}
                  count={servicesResults?.length}
                  showSearchBar={true}
                  showGoBack={true}
                />
                {busy ? (
                  <div>
                    {" "}
                    <Spinner />
                  </div>
                ) : servicesResults && servicesResults.length > 0 ? (
                  servicesResults.map((instantjob, i) => (
                    <div className="" key={i}>
                      <div className="panel-login text-center"></div>
                      <div className="highlight-card p-p-2">
                        <div
                          className="row"
                          style={{ flexWrap: "nowrap !important" }}
                        >
                          <div className="col-2">
                            {instantjob.poster !== undefined ? (
                              <img
                                src={instantjob.poster.imageUrl}
                                className="img-fluid rounded-circle"
                                alt="user-pic"
                                style={{ width: "70px", height: "70px" }}
                              />
                            ) : (
                              <img
                                src="../assets/images/logo/applogo.jpeg"
                                className="img-fluid rounded-circle"
                                alt="user-pic"
                                style={{ width: "70px", height: "70px" }}
                              />
                            )}
                          </div>
                          <div className="col-10">
                            <small className="p-text-secondary">
                              <div className="row">
                                <div className="col-md-2">
                                  {" "}
                                  <p className="font-weight-bold app-color text-capitalize">
                                    Service :{" "}
                                  </p>
                                </div>{" "}
                                <div className="col-md-10">
                                  {" "}
                                  <p>{instantjob.service} </p>{" "}
                                </div>
                                <div className="col-md-2">
                                  {" "}
                                  <p className="font-weight-bold app-color text-capitalize">
                                    Location :{" "}
                                  </p>
                                </div>{" "}
                                <div className="col-md-10">
                                  {" "}
                                  <p>{instantjob.location} </p>{" "}
                                </div>
                                <div className="col-md-2">
                                  {" "}
                                  <p className="font-weight-bold app-color text-capitalize">
                                    {" "}
                                    Description:{" "}
                                  </p>
                                </div>{" "}
                                <div className="col-md-10">
                                  {" "}
                                  <p>{instantjob.description} </p>{" "}
                                </div>
                                {/* <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">Phone Number: </p></div>  <div className='col-md-3'> <p>{instantjob.phoneNumber} </p> </div> */}
                                <div className="col-md-2">
                                  {" "}
                                  <p className="font-weight-bold app-color text-capitalize">
                                    Start Date :{" "}
                                  </p>
                                </div>{" "}
                                <div className="col-md-10">
                                  {" "}
                                  <p>
                                    {moment(instantjob.startDate).format(
                                      "MMMM DD, YYYY"
                                    )}{" "}
                                  </p>{" "}
                                </div>
                                <div className="col-md-2">
                                  {" "}
                                  <p className="font-weight-bold app-color text-capitalize">
                                    End Date :{" "}
                                  </p>
                                </div>{" "}
                                <div className="col-md-10">
                                  {" "}
                                  <p>
                                    {moment(instantjob.endDate).format(
                                      "MMMM DD, YYYY"
                                    )}{" "}
                                  </p>{" "}
                                </div>
                              </div>
                              <div
                                className="p-grid p-pt-5"
                                id={`${i}_int`}
                                hidden={false}
                              >
                                <div className="p-pr-2 d-flex">
                                  <p>
                                    {" "}
                                    <span className="font-weight-bold app-color p-mt-2 interest-tx">
                                      {" "}
                                      Interested ? &nbsp;{" "}
                                    </span>{" "}
                                  </p>
                                </div>

                                <div>
                                  <Button
                                    label="Apply"
                                    id="saveButton"
                                    className="p-button-sm"
                                    onClick={() =>
                                      handleApply(instantjob.id, i)
                                    }
                                  />
                                </div>

                                {/* <div className="p-pr-1 px-2">
                                  {" "}
                                  <Link
                                    to={`/instant-hire/view/${instantjob.id}`}
                                  >
                                    <Button
                                      label="View"
                                      id="reject"
                                      className="p-button-sm on-hover"
                                    />{" "}
                                  </Link>
                                </div> */}
                              </div>
                              <p className="p-pt-2 float-right">
                                {" "}
                                {moment(instantjob.createdAt).fromNow()}{" "}
                              </p>
                              <div
                                className="p-grid p-pt-2"
                                id={`${i}`}
                                hidden={true}
                              ></div>
                            </small>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))
                ) : (
                  <div className="font-weight-bold">
                    {" "}
                    There are no job for this service yet, Kindly try letter
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* {!servicesResults?.length === meta?.itemCount && (
          <div className="p-grid">
            <div className="col-12">
              <div className="pagination center p-mb-1">
                <Button
                  label="Load more"
                  className="p-button-sm"
                  onClick={loadMoreHandler}
                />
              </div>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default InstantJobs;
