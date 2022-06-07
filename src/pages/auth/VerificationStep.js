import AccountTypesOptions from 'components/AccountTypeOptions/AccountTypesOptions';
import { ACCOUNT_TYPE } from 'constants/accountType';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { isArtisanApp } from 'services/agent.service';

import './Register.css'

const VerificationStep = ({ goto, accountType, setAccountType }) => {

    const [corporateCard, setCorporateCard] = useState(false);
    const [artisanCard, setArtisanCard] = useState(false);
    const [companyCard, setCompanyCard] = useState(false);
    const [instantHireCard, setInstantHireCard] = useState(false);

    const history = useHistory()

    const setSelectedAccountType = (type, e) => {
        if (type) {
            setAccountType(type);
        }
        if (type === ACCOUNT_TYPE.JOB_SEEKER) {
            setCorporateCard(true);
            setArtisanCard(false);
            setCompanyCard(false);
            setInstantHireCard(false);
        }
        if (type === ACCOUNT_TYPE.ARTISAN) {
            setArtisanCard(true);
            setCorporateCard(false);
            setCompanyCard(false);
            setInstantHireCard(false);
        }
        if (type === ACCOUNT_TYPE.CORPORATE) {
            setCompanyCard(true);
            setCorporateCard(false);
            setArtisanCard(false);
            setInstantHireCard(false);
        }
        if (type === ACCOUNT_TYPE.INSTANT_HIRE) {
            setInstantHireCard(true);
            setCorporateCard(false);
            setArtisanCard(false);
            setCompanyCard(false);
        }

    };

    const handleGoto = () => {
        if (accountType === null) {
            window.alert('Please select an account type!')
            return;
        }
        goto(2)
    }

    return (
        <>
            <div className="p-fluid">
                <div className="verificationContainer">
                    <div className='d-flex'>

                        <i className="pi pi-arrow-left font-weight-bold px-4 finger" onClick={() => history.goBack()}></i> <h5>Sign-up as</h5>
                    </div>
                    <div className="verificationStep">
                        {isArtisanApp && <>
                            <AccountTypesOptions
                                onClick={(e) =>
                                    setSelectedAccountType(ACCOUNT_TYPE.INSTANT_HIRE, e)
                                }
                                image="/assets/images/accountTypes/thinkingman.png"
                                body="Customer"
                                customstyle={` artisan ${instantHireCard ? "active-card" : ""}`}
                                style={{ border: "4px solid yellow" }}
                            />
                            <AccountTypesOptions
                                onClick={(e) => setSelectedAccountType(ACCOUNT_TYPE.ARTISAN, e)}
                                image="/assets/images/accountTypes/handworker.png"
                                body="Service Provider"
                                customstyle={` artisanService ${artisanCard ? "active-card" : ""}`}
                            />
                        </>}
                        {!isArtisanApp && <>
                            <AccountTypesOptions
                                onClick={(e) => setSelectedAccountType(ACCOUNT_TYPE.CORPORATE, e)}
                                image="/assets/images/accountTypes/recruiter.png"
                                body="To Recruit Corporate Jobseekers."
                                customstyle={` company ${companyCard ? "active-card" : ""}`}
                            />
                            <AccountTypesOptions
                                onClick={(e) =>
                                    setSelectedAccountType(ACCOUNT_TYPE.JOB_SEEKER, e)
                                }
                                image="/assets/images/accountTypes/jobseekers.png"
                                body="To Look for Corporate Job Opportunities"
                                customstyle={` job-seker ${corporateCard ? "active-card" : ""}`}
                            />
                        </>}
                    </div>
                    <button className="btn-proceed" onClick={handleGoto}>Proceed</button>
                </div>
            </div>
        </>
    );
};

export default VerificationStep;
