import React, { useEffect, useState } from 'react';
import ProgressTrackerBar from './ProgressTrackerBar';
import moment from "moment";
import './Dashboard.css'
import agentService from 'services/agent.service';
import { UserPostCount, UserContact, InstantService, UserJob, UserActivities, UserAccountStatus } from 'store/modules/dashboard';
import { useDispatch, useSelector } from 'react-redux';


const EmployeeDashboard = () => {

  const dispatch = useDispatch();
  const id = agentService.Auth.current().id;
  const name = agentService.Auth.current().name;
  const userPost = useSelector(state => state.dashboard.userPost);
  const userContact = useSelector(state => state.dashboard.userContact);
  const instantService = useSelector(state => state.dashboard.instantService);
  const userJob = useSelector(state => state.dashboard.userJob);
  const activities = useSelector(state => state.dashboard.userActivities);
  const userActivities = activities.data;
  const accountStatus = useSelector(state => state.dashboard.userAccountStatus);
  const userAccountStatus = accountStatus?.data;
  const [value, setValue] = useState();
  const [profileValue, setProfileValue] = useState();

  useEffect(() => {
    dispatch(UserPostCount(id));
    dispatch(UserContact());
    dispatch(InstantService());
    dispatch(UserJob());
    dispatch(UserActivities());
    dispatch(UserAccountStatus());
  }, [])

  useEffect(() => {
    (profileInfo())
  }, [userAccountStatus]);

  const profileInfo = () => {
    let addressCompleted;
    let namesCompleted;
    let professionCompleted;
    let profileImageUploaded;
    if (userAccountStatus?.profileInfo.addressCompleted === false) {
      addressCompleted = 0
    } else {
      addressCompleted = 25
    }
    if (userAccountStatus?.profileInfo.namesCompleted === false) {
      namesCompleted = 0
    } else {
      namesCompleted = 25
    }
    if (userAccountStatus?.profileInfo.professionCompleted === false) {
      professionCompleted = 0
    } else {
      professionCompleted = 25
    }
    if (userAccountStatus?.profileInfo.profileImageUploaded === false) {
      profileImageUploaded = 0
    } else {
      profileImageUploaded = 25
    }
    const profileInfoValue = addressCompleted + namesCompleted + professionCompleted + profileImageUploaded
    setValue(profileInfoValue);

    let experienceCompleted;
    let locationCompleted;
    let portfolioUploadCompleted;
    let profileInfoCompleted;
    let servicesCompleted;
    if (userAccountStatus?.experienceCompleted === false) {
      experienceCompleted = 0
    } else {
      experienceCompleted = 20
    }
    if (userAccountStatus?.locationCompleted === false) {
      locationCompleted = 0
    } else {
      locationCompleted = 20
    }
    if (userAccountStatus?.portfolioUploadCompleted === false) {
      portfolioUploadCompleted = 0
    } else {
      portfolioUploadCompleted = 20
    }
    if (userAccountStatus?.servicesCompleted === false) {
      servicesCompleted = 0
    } else {
      servicesCompleted = 20
    }
    profileInfoCompleted = (profileInfoValue / 100) * 20;
    const profileValue = experienceCompleted + locationCompleted + portfolioUploadCompleted + profileInfoCompleted + servicesCompleted;
    setProfileValue(profileValue)
  }


  return (
    <div className="dashboard-container">
      <h3 className="p-pb-2"><i className="pi pi-chart-line p-pr-2"></i>Dashboard</h3>
      <h6 className="p-mb-4">Welcome <strong className='text-green'>{name}</strong></h6>
      <div className="row">
        <div className="col-xl-4 col-md-6 p-mb-2">
          <div className="card mini-stat">
            <div className="card-body dashboard-item">
              <div className="mb-4 text-green">
                <div className="float-left mini-stat-img mr-4 col-3">
                  <i className="pi pi-comment" style={{ fontSize: "2rem" }}></i>
                </div>
                <div className='text-green'>
                  <h5 className="font-size-16 text-uppercase mt-0 dashboard-item mb-2 text-green">Posts</h5>
                  <h4 className="font-weight-medium font-size-24 dashboard-item text-green">{userPost?.data}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 p-mb-2">
          <div className="card mini-stat">
            <div className="card-body dashboard-item">
              <div className="mb-4">
                <div className="float-left mini-stat-img mr-4 col-3 text-green">
                  <i className="pi pi-user-plus" style={{ fontSize: "2rem" }}></i>
                </div>
                <div className='text-green'>
                  <h5 className="font-size-16 text-uppercase mt-0 dashboard-item mb-2 text-green">Connections</h5>
                  <h4 className="font-weight-medium dashboard-item font-size-24 text-green">{userContact?.data}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6 p-mb-2">
          <div className="card mini-stat">
            <div className="card-body dashboard-item">
              <div className="mb-4">
                <div className="float-left mini-stat-img mr-4 col-3 text-green">
                  <i className="pi pi-briefcase" style={{ fontSize: "2rem" }}></i>
                </div>
                <div>
                  <h5 className="font-size-16 text-uppercase mt-0 dashboard-item mb-2 text-green">Instant Service</h5>
                  <h4 className="font-weight-medium dashboard-item font-size-24 text-green">{instantService?.data}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-grid p-mx-lg-0 grid-margin p-py-1">
        <div className="p-col-12 p-lg-6 p-p-lg-1 p-py-0">
          <div className="p-card h-100 p-mt-2 p-rounded-lg">
            <div className="p-card-title cardtitle h6">Recent Activities</div>
            <main style={{ overflowY: 'auto' }}>
              {userActivities && userActivities.length > 0 && userActivities.map(activity =>
                <div className="p-card-body p-card-body-Activity p-px-3">
                  <i className='pi pi-paperclip pr-3  text-warning'></i><span className=' text-green'>{activity.message}</span>
                  <span className='px-3' style={{ fontWeight: 'bold' }}>
                    {/* {moment(activity.createdAt).fromNow('MMMM Do YYYY')} ago */}
                    [{moment(activity.createdAt).format("D MMMM YYYY, h:mm a")}]
                  </span>
                </div>
              )}
            </main>
            {userActivities?.length === 0 && <div className="p-card-body p-card-body-Activity p-px-3">
              <h6 className="text-center">You have no activity yet</h6>
            </div>}
          </div>
        </div>
        <div className="p-col-12 p-lg-6 p-p-lg-1">
          <div className="p-card h-100 p-mt-2 p-rounded-lg">
            <div className="p-card-title cardtitle h6">Progress Tracker</div>
            <div className="p-card-body p-pt-0">
              <div className="progressBar-title">
                <span>
                  Experience Completion
                </span>
                <span>
                  {userAccountStatus?.experienceCompleted === false ? "0%" : "100%"}
                </span>
              </div>
              <ProgressTrackerBar value={userAccountStatus?.experienceCompleted === false ? 0 : 100} className="progressBar progressBar1" />
              <div className="progressBar-title">
                <span>
                  Location Completion
                </span>
                <span>
                  {userAccountStatus?.locationCompleted === false ? "0%" : "100%"}
                </span>
              </div>
              <ProgressTrackerBar value={userAccountStatus?.locationCompleted === false ? 0 : 100} className="progressBar progressBar2" />
              <div className="progressBar-title">
                <span>
                  Portfolio Upload Completion
                </span>
                <span>
                  {userAccountStatus?.portfolioUploadCompleted === false ? "0%" : "100%"}
                </span>
              </div>
              <ProgressTrackerBar value={userAccountStatus?.portfolioUploadCompleted === false ? 0 : 100} className="progressBar progressBar3" />
              <div className="progressBar-title">
                <span>
                  Profile Information Completion
                </span>
                <span>
                  {`${value}%`}
                </span>
              </div>
              <ProgressTrackerBar value={value} className="progressBar progressBar6" />
              <div className="progressBar-title">
                <span>
                  Services Completion
                </span>
                <span>
                  {userAccountStatus?.servicesCompleted === false ? "0%" : "100%"}
                </span>
              </div>
              <ProgressTrackerBar value={userAccountStatus?.servicesCompleted === false ? 0 : 100} className="progressBar progressBar4" />
              <div className="progressBar-title">
                <span>
                  Profile Completion
                </span>
                <span>
                  {profileValue === 100 ? "Complete!" : `${profileValue}%`}
                </span>
              </div>
              <ProgressTrackerBar value={profileValue} className="progressBar progressBar5" />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default EmployeeDashboard;