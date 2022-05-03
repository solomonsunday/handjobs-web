import React, { useEffect, useState } from 'react';
import ProgressTrackerBar from './ProgressTrackerBar';
import moment from "moment";
import './Dashboard.css'
import agentService from 'services/agent.service';
import { UserPostCount, UserContact, InstantService, UserJob, UserActivities } from 'store/modules/dashboard';
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
  const userActivities = activities.data

  console.log("id", id)
  console.log("postiii", userPost.data)
  useEffect(() => {
    dispatch(UserPostCount(id));
    dispatch(UserContact());
    dispatch(InstantService());
    dispatch(UserJob());
    dispatch(UserActivities());
  }, [])

  console.log("activity", userActivities)

  return (
    <div className="dashboard-container">
      <h3 className="p-pb-2"><i className="pi pi-chart-line p-pr-2"></i>Dashboard</h3>
      <h6 className="p-mb-4">Welcome <strong  className='text-green'>{name}</strong></h6>
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
                  <span className='px-3' style={{fontWeight: 'bold'}}>
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
                  Profile Completion
                </span>
                <span>
                  20%
                </span>
              </div>
              <ProgressTrackerBar value={20} className="progressBar progressBar1" />
              <div className="progressBar-title">
                <span>
                  Profile Completion
                </span>
                <span>
                  40%
                </span>
              </div>
              <ProgressTrackerBar value={40} className="progressBar progressBar2" />
              <div className="progressBar-title">
                <span>
                  Profile Completion
                </span>
                <span>
                  60%
                </span>
              </div>
              <ProgressTrackerBar value={60} className="progressBar progressBar3" />
              <div className="progressBar-title">
                <span>
                  Profile Completion
                </span>
                <span>
                  80%
                </span>
              </div>
              <ProgressTrackerBar value={80} className="progressBar progressBar4" />
              <div className="progressBar-title">
                <span>
                  Profile Completion
                </span>
                <span>
                  Complete!
                </span>
              </div>
              <ProgressTrackerBar value={100} className="progressBar progressBar5" />
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default EmployeeDashboard;