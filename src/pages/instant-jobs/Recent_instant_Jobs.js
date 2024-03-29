import SectionHeader from "components/profile/SectionHeader";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllInstantJobs } from "store/modules/instantJob";
import "../profile/UserProfile.css";

import "./Instant-Jobs.css";

const RecentInstantJobs = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [copyAlert, setCopyAlert] = useState(null);

  const allCurrentInstantJobs = useSelector(
    (state) => state.instantJob.allCurrentInstantJobs?.data
  );

  useEffect(() => {
    dispatch(fetchAllInstantJobs(page, take));
  }, [dispatch]);

  const handleShareButton = (e) => {
    const jobId = e.currentTarget.dataset.id;
    const el = document.createElement("input");
    el.value = window.location.host + `/instant-hire/view/${jobId}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopyAlert(jobId);
    setTimeout(function () {
      setCopyAlert(false);
    }, 1000);
  };

  function truncate(str, no_words) {
    return str.split(" ").splice(0, no_words).join(" ");
  }

  return (
    <>
      <div
        className="p-col-12 p-md-3 p-pt-2"
        style={{ position: "sticky", top: "0" }}
      >
        <div className="p-card" style={{ borderRadius: "1rem" }}>
          <SectionHeader
            icon="briefcase"
            sectionTitle="Recent Instant Jobs"
            id="portfolioEdit"
            showEditButton="false"
          />
          <div
            className="p-card-body p-grid p-mt-1 overflow-auto"
            style={{ maxHeight: 500 }}
          >
            {allCurrentInstantJobs &&
              allCurrentInstantJobs.length > 0 &&
              allCurrentInstantJobs.map((instantjob) => (
                <div key={instantjob.id} className="">
                  <div className="panel-login text-center"></div>
                  <div className="highlight-card p-p-1">
                    <div
                      className="row "
                      style={{ flexWrap: "nowrap !important" }}
                    >
                      <div className="col-3">
                        {instantjob?.poster?.imageUrl ? (
                          <img
                            src={instantjob?.poster?.imageUrl}
                            className="img-fluid rounded-circle"
                            alt="user-image"
                            style={{ width: "50px", height: "50px" }}
                          />
                        ) : (
                          <img
                            src="https://res.cloudinary.com/dfyj9xgw9/image/upload/v1692829898/handworker-assets/Handworker-h-logo_lmyb3w.png"
                            className="img-fluid rounded-circle border"
                            alt="user-image"
                            style={{ width: "50px", height: "50px" }}
                          />
                        )}
                      </div>
                      <div className="col-9">
                        <small>
                          <Link
                            className="p-text-secondary"
                            to={`/instant-hire/view/${instantjob.id}`}
                          >
                            <p className="font-weight-bold">
                              {" "}
                              <span
                                className="app-color text-capitalize"
                                style={{ fontSize: 15 }}
                              >
                                {" "}
                                {instantjob.service}
                              </span>
                            </p>
                            <p className="font-weight-bold text-capitalize">
                              {instantjob.location}{" "}
                            </p>
                            <p>
                              <span className="font-weight-bold text-capitalize">
                                {" "}
                              </span>{" "}
                              {`${truncate(
                                instantjob.description,
                                20
                              )} ${"..."}`}
                            </p>
                          </Link>
                          {/* <div className="d-flex justify-content-between">
                            <div>
                              <p className="p-pt-2 float-right">
                                {" "}
                                {moment(instantjob.createdAt).fromNow()}{" "}
                              </p>
                            </div>
                            <div>
                              <div>
                                <i
                                  className="pi pi-share-alt p-pt-2 icon-size"
                                  data-id={instantjob.id}
                                  onClick={handleShareButton}
                                >
                                  {" "}
                                  Share
                                </i>
                              </div>
                              <span
                                className={
                                  copyAlert === instantjob.id
                                    ? "job-copyModalAlert--active"
                                    : "job-copyModalAlert"
                                }
                              >
                                Link copied
                              </span>
                            </div>
                          </div> */}
                        </small>
                      </div>
                      <div className="col-3"></div>
                      <div className="col-9">
                        <small>
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="p-pt-2 float-right">
                                {" "}
                                {moment(instantjob.createdAt).fromNow()}{" "}
                              </p>
                            </div>
                            <div>
                              <div>
                                <i
                                  className="pi pi-share-alt p-pt-2 icon-size"
                                  data-id={instantjob.id}
                                  onClick={handleShareButton}
                                >
                                  {" "}
                                  Share
                                </i>
                              </div>
                              <span
                                className={
                                  copyAlert === instantjob.id
                                    ? "job-copyModalAlert--active"
                                    : "job-copyModalAlert"
                                }
                              >
                                Link copied
                              </span>
                            </div>
                          </div>
                        </small>
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
              ))}
            {allCurrentInstantJobs?.length === 0 && (
              <strong className="mx-auto">No Recent Job Yet</strong>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentInstantJobs;
