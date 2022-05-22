import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { confirmDialog } from 'primereact/confirmdialog';
import InstantHeader from './instant-header';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInstantJob, loadInstantJobs } from '../../store/modules/instantJob'
import moment from 'moment';

import './InstantJobHire.css'
import RecentInstantJobs from 'pages/instant-jobs/Recent_instant_Jobs';
import Spinner from 'components/spinner/spinner.component'
import JobSidePanel from 'components/JobSidePanel';
import agentService from 'services/agent.service';
import { loadAllJobs } from 'store/modules/job';
import { ACCOUNT_TYPE } from 'constants/accountType';


const InstantHires = () => {
    const dispatch = useDispatch();
    const instantJobs = useSelector(state => state.instantJob.instantjobs);
    const allJobs = useSelector(state => state.job.allJobs);

    const userAccountType = agentService.Auth.current().accountType;


    useEffect(() => {
        dispatch(loadInstantJobs())
    }, [])

    useEffect(() => {
        dispatch(loadAllJobs());
    }, [dispatch]);

    const deleteRequest = (id) => {
        return confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                dispatch(deleteInstantJob(id));
                dispatch(loadInstantJobs());
            },
            reject: () => {
                return;
            }
        });
    }

    // if (instantJobs && !instantJobs.length)
    //     return <Spinner />

    return (
        <div>
            <div className="background instant" >
                <div className="content-container">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-9">
                            <div className="card card-size-list" style={{ borderRadius: "1rem" }}>
                                <div className="card-body">
                                    <InstantHeader
                                        title="My Instant Service History"
                                        showCreateButton={true}
                                        count={instantJobs?.length}
                                        showSearchBar={true}
                                    />
                                    {instantJobs && instantJobs.length > 0 && instantJobs.map(instantjob =>

                                        <div key={instantjob.id}>
                                            <div className="panel-login text-center"></div>
                                            <div className="highlight-card p-p-2">
                                                <div className="float-right d-flex">
                                                    <div className='px-3'>
                                                        <Link to={`/instant-hire/edit/${instantjob.id}`}> <span><i className="pi pi-pencil" ></i></span></Link>
                                                    </div>
                                                    <div>
                                                        <i className="pi pi-trash" style={{ fontSize: '0.8rem', padding: '.2rem' }} onClick={() => deleteRequest(instantjob.id)}></i>
                                                    </div>

                                                </div>
                                                <Link to={`/instant-hire-applicants/${instantjob.id}`}>
                                                
                                                    <small className="p-text-secondary">
                                                        <div className='row'>
                                                            <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">Service : </p></div>  <div className='col-md-10'> <p>{instantjob.service} </p> </div>
                                                            {/* <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">Location : </p></div>  <div className='col-md-10'> <p>{instantjob.location} </p> </div> */}
                                                         <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">Address : </p></div>  <div className='col-md-10'> <p>{instantjob.address ? instantjob.address :instantjob.location } </p> </div>
                                                            <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">Job Description : </p></div>  <div className='col-md-10'> <p>{instantjob.description} </p> </div>
                                                            <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">Start Date  : </p></div>  <div className='col-md-3'> <p>{moment(instantjob.startDate).format('MMMM DD, YYYY')} </p> </div>
                                                            <div className='col-md-2'> <p className="font-weight-bold app-color text-capitalize">End Date  : </p></div>  <div className='col-md-3'> <p>{moment(instantjob.endDate).format('MMMM DD, YYYY')} </p> </div>
                                                        </div>
                                                    </small>
                                                
                                                </Link>
                                            </div>
                                            <hr />
                                        </div>
                                    )}
                                    {
                                        instantJobs?.length === 0 && <strong className="mx-auto">No Instant Job Created</strong>
                                    }
                                </div>
                            </div>
                        </div>
                        {userAccountType === ACCOUNT_TYPE.ARTISAN ? <RecentInstantJobs /> :
                            <JobSidePanel data={allJobs} />}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstantHires;
