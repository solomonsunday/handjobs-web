import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InstantHeader from "pages/instant-job-hire/instant-header";
import { Button } from "primereact/button";
import { applyInstantJob, fetchAllInstantJobs } from "store/modules/instantJob";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { confirmDialog } from "primereact/confirmdialog";

import "./Instant-Jobs.css";
import RecentInstantJobs from "./Recent_instant_Jobs";
import { Tag } from "primereact/tag";
import agent from "../../services/agent.service";
import { showMessage } from "store/modules/notification";

const InstantJobs = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const toast = useRef(null);
  const [isApplied, setIsApplied] = useState(false);
  const allInstantJobs = useSelector(
    (state) => state.instantJob.allCurrentInstantJobs.data
  );
  const meta = useSelector(
    (state) => state.instantJob.allCurrentInstantJobs.meta
  );
  const applicants = useSelector((state) => state.instantJob.applicants);
  const err = useSelector((state) => state.instantJob.error);

  console.log(err, "err");
  const requestedId = agent.Auth.current();
  let isApplicantHasPhoneNumber = agent.Auth.current().phoneNumber;

  useEffect(() => {
    dispatch(fetchAllInstantJobs(page, take));
  }, [dispatch]);

  useEffect(() => {
    // dispatch(loadApplicants())
  }, [dispatch]);

  const loadMoreHandler = () => {
    // setPage(page + 1)
    dispatch(fetchAllInstantJobs(page + 1, take));
  };

  const handleApply = (id, i) => {
    if (!isApplicantHasPhoneNumber) {
      console.log({ isApplicantHasPhoneNumber });
      dispatch(
        showMessage({
          type: "error",
          message:
            "Kindly add your phone number in your profile to apply for this job!!!",
          title: "Phone number required",
        })
      );
      return;
    }
    let data = {
      jobId: id,
    };
    confirmDialog({
      message: "You are about to apply for this job?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        dispatch(applyInstantJob(data));
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
    <div className="background">
      <div className="instant">
        <div className="content-container">
          <div className="p-grid">
            <div className="p-col-12 p-md-9">
              <div
                className="card card-size-list"
                style={{ borderRadius: "0.5rem" }}
              >
                <InstantHeader
                  title="All Instant Jobs"
                  showCreateButton={false}
                  count={allInstantJobs?.length}
                  showSearchBar={true}
                />
                {allInstantJobs &&
                  allInstantJobs.length > 0 &&
                  allInstantJobs.map((instantjob, i) => (
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
                                alt="user-image"
                                style={{ width: "70px", height: "70px" }}
                              />
                            ) : (
                              <img
                                src="../assets/images/logo/applogo.jpeg"
                                className="img-fluid rounded-circle"
                                alt="user-image"
                                style={{ width: "70px", height: "70px" }}
                              />
                            )}
                          </div>
                          {/* <div className="p-2" ></div> */}
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
                                  {requestedId?.id !== instantjob.accountId && requestedId?.accountType === 'Artisan' &&
                                    instantjob.company.id && (
                                      <p>
                                        {" "}
                                        <span className="font-weight-bold app-color p-mt-2 interest-tx">
                                          {" "}
                                          Interested ? &nbsp;{" "}
                                        </span>{" "}
                                      </p>
                                    )}
                                </div>
                                {requestedId?.id !== instantjob.company.id && requestedId?.accountType === 'Artisan' && (
                                  <div>
                                    <Button
                                      label="Yes"
                                      id="saveButton"
                                      className="p-button-sm"
                                      onClick={() =>
                                        handleApply(instantjob.id, i)
                                      }
                                    />
                                  </div>
                                )}
                                <div className="p-pr-1 px-2">
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
                                </div>
                              </div>
                              <p className="p-pt-2 float-right">
                                {" "}
                                {moment(instantjob.createdAt).fromNow()}{" "}
                              </p>
                              <div
                                className="p-grid p-pt-2"
                                id={`${i}`}
                                hidden={true}
                              >
                                {!err && (
                                  <Tag>
                                    {" "}
                                    <span>Waiting to be accepted...</span>
                                  </Tag>
                                )}
                              </div>
                            </small>
                          </div>
                        </div>
                      </div>
                      <hr />
                    </div>
                  ))}
                {allInstantJobs && allInstantJobs < 1 && allInstantJobs && (
                  <div className="font-weight-bold"> No Jobs created yet</div>
                )}
              </div>
            </div>
            {/* <RecentInstantJobs /> */}
          </div>
        </div>
      </div>
      {!allInstantJobs?.length === meta?.itemCount && (
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
      )}
    </div>
  );
};

export default InstantJobs;
