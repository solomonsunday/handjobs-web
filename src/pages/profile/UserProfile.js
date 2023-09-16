import PersonalInfo from "components/profile/PersonalInfo";
import Portfolio from "components/profile/Portfolio";
import ProfileTab from "components/profile/ProfileTab";
import { ACCOUNT_TYPE } from "constants/accountType";
import CustomBreadCrumb from "helpers/BreadCrumb";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router";
import agentService from "services/agent.service";
import { openModal } from "store/modules/modal";
import ContactsTab from "./tabs/ContactsTab";
import GroupsTab from "./tabs/GroupsTab";
import InfoTab from "./tabs/InfoTab";
import JobsTab from "./tabs/JobsTab";
import ReviewTab from "./tabs/ReviewTab";

// import BreadCrumbPane from 'helpers/BreadCrumb';

const UserProfile = ({ match }) => {
  const profileInfo = useSelector((state) => state.account.profileInfo);

  const dispatch = useDispatch();
  const [, setMode] = useState("");
  const accountType = agentService.Auth.current().accountType;
  const userID = agentService.Auth.current().id;
  console.log({ userID });

  const openCreate = (name) => {
    setMode("create");
    dispatch(openModal(name));
  };

  const openEdit = (name) => {
    setMode("edit");
    // setItemToEdit(data);
    dispatch(openModal(name));
  };

  // useEffect(() => {
  //   dispatch(loadProfileInfo());
  // }, [])

  return (
    // <ErrorBoundary
    //   FallbackComponent={CustomError}
    //   onReset={() => {
    //     //reset the state of your app state
    //     console.log('reset the app state')
    //   }}
    // >
    <>
      <div className="background">
        <div className="">
          <CustomBreadCrumb />
        </div>
        <div className="content-container" style={{ width: "87%" }}>
          {/* personal info */}
          <div className="d-flex justify-content-center">
            <PersonalInfo
              openCreate={openCreate}
              openEdit={openEdit}
              data={profileInfo}
            />
          </div>
          <div>
            {/* <Button onClick={testNotification} type="submit" label="Test" className="appcolor rounded-pill on-hover" /> */}
          </div>
          <div className="p-grid">
            <div className="p-col-12 p-md-9 content-smallscreen">
              <div className="content-tab" style={{ borderRadius: "1rem" }}>
                {/* ProfileTab */}
                <ProfileTab />
              </div>
              <div className="content-body">
                {/* biography */}

                <Route path={`${match.path}/`} exact component={InfoTab} />
                <Route path={`${match.path}/info`} component={InfoTab} />
                <Route path={`${match.path}/jobs`} component={JobsTab} />
                <Route
                  path={`${match.path}/contacts`}
                  component={ContactsTab}
                />
                <Route path={`${match.path}/groups`} component={GroupsTab} />
                <Route path={`${match.path}/review`} component={ReviewTab} />
              </div>
            </div>
            {/* portfolio */}
            {accountType === ACCOUNT_TYPE.ARTISAN && (
              <Portfolio openCreate={openCreate} openEdit={openEdit} />
            )}
          </div>
        </div>
      </div>
    </>
    // </ErrorBoundary>
  );
};

export default UserProfile;
