import Spinner from "components/spinner/spinner.component";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import BackgroundImage from "../../assets/bg.png";
import { applyInstantJob, loadInstantJob } from "store/modules/instantJob";
import moment from "moment";
import { confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import AppNavBar from "components/AppNavBar";
import agent from "../../services/agent.service";
import Applicants from "pages/artisans/List";

const View = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const param = useParams();

  const instantJobDetail = useSelector((state) => state.instantJob.instantjob);
  const jobApplicationRequest = useSelector(
    (state) => state.job.jobApplicationRequest
  );
  const loading = useSelector((state) => state.job.loading);
  const requestedId = agent.Auth.current();
  console.log("hel", { requestedId });
  useEffect(() => {
    dispatch(loadInstantJob(param.id));
  }, []);

  const handleApply = (id) => {
    let data = {
      jobId: id,
    };
    confirmDialog({
      message: "You are about to apply for this job?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        dispatch(applyInstantJob(data));
      },
      reject: () => {
        return;
      },
    });
  };

  if (instantJobDetail === null) return <Spinner />;

  return (
    <>
      {/* <AppNavBar /> */}
      <div style={styles.container}>
        <div className="container">
          <div className="d-flex" style={styles.topBarContainer}>
            <div className="company-logo py-2">
              <img
                src={
                  instantJobDetail?.company?.imageUrl
                    ? instantJobDetail?.company?.imageUrl
                    : "/assets/images/logo/applogo.jpeg"
                }
                alt="company-logo"
                style={{
                  borderRadius: "16%",
                  height: "140px",
                  width: "140px",
                  justifyContent: "center",
                }}
              />
            </div>
            <div className="company-caption" style={styles.topBarTextContainer}>
              <h4 style={styles.topBarHeaderTextStyle}>
                {instantJobDetail.title}
              </h4>
              {/* <p style={styles.topBarSubHeaderTextStyle}>{instantJobDetail.createdBy}</p> */}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row mt-4 mb-5">
          <div className="col-md-9">
            <div className="d-flex justify-content-end">
              <button
                onClick={() => history.goBack()}
                className="btn btn-primary on-hover"
                style={{
                  backgroundColor: "#357C3C",
                  border: "none",
                  padding: "8px 24px",
                }}
              >
                <i className="pi pi-arrow-left"></i>
              </button>
            </div>
            <div className="p-card p-4 mt-2" style={{ borderRadius: "1rem" }}>
              <h5 className="p-title">Job Description</h5>
              <p className="mt-3">{instantJobDetail?.description}</p>
            </div>
            <div className="p-card p-4 mt-3" style={{ borderRadius: "1rem" }}>
              <h5 className="p-title">Instant Job Detail</h5>
              <div className="mt-3">
                <div className="p-text-secondary">
                  <div className="row">
                    <div className="col-md-2">
                      {" "}
                      <p className="font-weight-bold app-color text-capitalize">
                        Service :{" "}
                      </p>
                    </div>{" "}
                    <div className="col-md-10">
                      {" "}
                      <p>{instantJobDetail.service} </p>{" "}
                    </div>
                    <div className="col-md-2">
                      {" "}
                      <p className="font-weight-bold app-color text-capitalize">
                        Location :{" "}
                      </p>
                    </div>{" "}
                    <div className="col-md-10">
                      {" "}
                      <p>{instantJobDetail.location} </p>{" "}
                    </div>
                    <div className="col-md-2">
                      {" "}
                      <p className="font-weight-bold app-color text-capitalize">
                        Address :{" "}
                      </p>
                    </div>{" "}
                    <div className="col-md-10">
                      {" "}
                      <p>{instantJobDetail.address} </p>{" "}
                    </div>
                    <div className="col-md-2">
                      {" "}
                      <p className="font-weight-bold app-color text-capitalize">
                        Start Date :{" "}
                      </p>
                    </div>{" "}
                    <div className="col-md-3">
                      {" "}
                      <p>
                        {moment(instantJobDetail.startDate).format(
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
                    <div className="col-md-3">
                      {" "}
                      <p>
                        {moment(instantJobDetail.endDate).format(
                          "MMMM DD, YYYY"
                        )}{" "}
                      </p>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {requestedId?.id !== instantJobDetail?.accountId &&
              requestedId?.accountType === "Artisan" && (
                <button
                  onClick={() => handleApply(instantJobDetail.id)}
                  className="btn btn-block on-hover"
                  style={styles.btnApply}
                >
                  {jobApplicationRequest ? (
                    <span>
                      <i className="pi pi-spin pi-spinner"></i> Please wait...
                    </span>
                  ) : (
                    `Apply`
                  )}
                </button>
              )}{" "}
          </div>

          <div className="col-md-3">
            {/* <div className="p-card p-4 mt-3">
                            <h4 className="p-title">Overview</h4>
                            <hr />
                            <div className="overview-list">
                                <div className="overview-list-item" style={styles.overListItem}>
                                    <p style={styles.overviewListHeader}>Offered Salary</p>
                                    <p style={styles.overviewListText}>&#x20A6;{formatValue(instantJobDetail.minSalary)} - &#x20A6;{formatValue(instantJobDetail.maxSalary)}</p>
                                </div>
                                <div className="overview-list-item" style={styles.overListItem}>
                                    <p style={styles.overviewListHeader}>Industry</p>
                                    <p style={styles.overviewListText}>{instantJobDetail.industry}</p>
                                </div>
                                <div className="overview-list-item" style={styles.overListItem}>
                                    <p style={styles.overviewListHeader}>Experience</p>
                                    <p style={styles.overviewListText}>{instantJobDetail.minYearOfExperience} year(s)</p>
                                </div>
                                <div className="overview-list-item" style={styles.overListItem}>
                                    <p style={styles.overviewListHeader}>Qualification</p>
                                    <p style={styles.overviewListText}>{instantJobDetail.minQualification}</p>
                                </div>
                                <div className="overview-list-item" style={styles.overListItem}>
                                    <p style={styles.overviewListHeader}>Job Location</p>
                                    <p style={styles.overviewListText}>{instantJobDetail.location}</p>
                                </div>
                            </div>
                        </div> */}
            {/* {!instantJobDetail.hideCompanyName && (<div className="p-card p-4 mt-3">
                            <h4 className="p-title">Company Address</h4>
                            <hr />
                            <ul className="overview-list">
                                <li style={styles.contactItem}>{instantJobDetail.address}</li>
                                <li style={styles.contactItem}>{instantJobDetail.contactPhone}</li>
                                <li style={styles.contactItem}>{instantJobDetail.email}</li>
                                <li style={styles.contactItem}>{instantJobDetail.jobUrl}</li>
                            </ul>
                        </div>)} */}
          </div>
          <div className="col-md-2">
            <Applicants service={instantJobDetail?.service} />
          </div>
        </div>
      </div>
    </>
  );
};

// style="background-image: url("/static/media/artisan_color.4359e4f8.png"); background-size: cover; background-repeat: no-repeat; width: 100%; height: 310px; position: relative; border-radius: 1rem;
const styles = {
  // container: {
  //   backgroundImage: `url(${BackgroundImage})`,
  //   backgroundSize: "cover",
  //   backgroundRepeat: "no-repeat",
  //   width: "100vw",
  //   height: "160px",
  //   position: "relative",
  // },

  container: {
    backgroundImage: `url(${"/static/media/artisan_color.4359e4f8.png"})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100vw",
    height: "160px",
    position: "relative",
    // borderRadius: "1rem",
  },
  topBarContainer: {
    width: "600px",
    marginTop: "30px",
  },
  topBarTextContainer: {
    alignSelf: "center",
  },
  topBarHeaderTextStyle: {
    fontSize: "22px",
    fontWeight: "500",
    marginLeft: "8px",
    marginBottom: "4px",
  },
  topBarSubHeaderTextStyle: {
    color: "black",
    fontSize: "16px",
    fontWeight: "500",
    marginLeft: "8px",
  },
  btnApply: {
    backgroundColor: "#357C3C",
    color: "white",
    padding: "12px 0",
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: 500,
  },
  overListItem: {
    marginBottom: "16px",
  },
  overviewListHeader: {
    fontSize: "18px",
    fontWeight: 500,
  },
  overviewListText: {
    fontSize: "16px",
    fontWeight: "normal",
  },
  contactItem: {
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: 500,
  },
};

export default View;
