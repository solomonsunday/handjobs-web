import React, { useEffect } from "react";
import { Switch, Redirect, useLocation, Route } from "react-router";
import { useDispatch } from "react-redux";
import { clearMessage } from "../store/modules/notification";
import AppLoading from "../components/AppLoading";
import AnonymousRoute from "./anonymous-route";
import ProtectedRoute from "./protected-route";
import CompanyProfile from "pages/company/CompanyProfile";
import CreateJob from "pages/job/CreateJob";
import AdminDashboard from "pages/admin/dashboard/AdminDashboard";
import ProtectedAdminRoute from "./protected-admin-route";
import AdminSkill from "pages/admin/dashboard/AdminSkills";
import AdminContractType from "pages/admin/dashboard/AdminContractType";
import AdminQualification from "pages/admin/dashboard/AdminQualification";
import AnonymousRouteOrProtectedRoute from "./anonymous-or-protected-route";
import ModalRoute from "components/chat/ModalRoute";
import OfflinePage from "pages/error-page/OfflinePage";

const Dashboard = React.lazy(() => import("../pages/dashboard/Dashboard"));
const UserProfile = React.lazy(() => import("pages/profile/UserProfile"));
// const CompanyProfile = React.lazy(() => import('../pages/profile/companyProfile/CompanyProfile'));
const LandingPage = React.lazy(() =>
  import("../pages/landingPage/LandingPage")
);
const JobSearchResults = React.lazy(() =>
  import("../pages/landingPage/JobSearchResults")
);
const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const ConfirmationPage = React.lazy(() =>
  import("../pages/auth/ConfirmationPage")
);
const EmailConfirmation = React.lazy(() =>
  import("../pages/auth/EmailConfirmation")
);

const AccountType = React.lazy(() => import("../pages/auth/AccountTypeStep"));
const SecurityVerification = React.lazy(() =>
  import("../pages/auth/SecurityVerification")
);
const EmployerAccountType = React.lazy(() =>
  import("../pages/auth/EmployerAccountType")
);
const EmployeeAccountType = React.lazy(() =>
  import("../pages/auth/EmployeeAccountType")
);
const RecoverByNumber = React.lazy(() =>
  import("../pages/auth/forgotPassword/RecoverByNumber")
);
const RecoverByEmail = React.lazy(() =>
  import("../pages/auth/forgotPassword/RecoverByEmail")
);
const ForgotPassword = React.lazy(() =>
  import("../pages/auth/forgotPassword/ForgotPassword")
);
const NewPassword = React.lazy(() =>
  import("../pages/auth/forgotPassword/NewPassword")
);
const PageNotFound = React.lazy(() =>
  import("../pages/error-page/PageNotFound")
);
const InternalServerError = React.lazy(() =>
  import("../pages/error-page/InternalServerError")
);
const BadRequest = React.lazy(() => import("../pages/error-page/BadRequest"));
const CreateInstantJobHire = React.lazy(() =>
  import("../pages/instant-job-hire/Create")
);
const ListInstantJobHire = React.lazy(() =>
  import("../pages/instant-job-hire/List")
);
const ViewInstantJobHire = React.lazy(() =>
  import("../pages/instant-job-hire/View")
);
const EditInstantJobHire = React.lazy(() =>
  import("../pages/instant-job-hire/Edit")
);
const Applicant = React.lazy(() =>
  import("../pages/instant-job-hire/Applicant")
);
const ApplicantProfile = React.lazy(() =>
  import("pages/view-profile/ApplicantProfile")
);
const ViewCompanyProfile = React.lazy(() =>
  import("pages/view-profile/CompanyProfile")
);
const InstantJobs = React.lazy(() => import("../pages/instant-jobs/List"));
const Review = React.lazy(() => import("../pages/instant-job-hire/Review"));
const Timeline = React.lazy(() => import("../pages/timeline/Timeline"));
const ViewPost = React.lazy(() => import("../pages/timeline/ViewPost"));
const CreateContacts = React.lazy(() => import("../pages/contacts/Create"));
const ListContacts = React.lazy(() => import("../pages/contacts/List"));
const Notification = React.lazy(() => import("../pages/notification/List"));
const AdminServicesAndServiceGroups = React.lazy(() =>
  import("pages/admin/dashboard/AdminServicesAndServiceGroups")
);

// const HOWTOSTART = React.lazy(() => import('../pages/generate-CV/HowToStart'));
// const CVTEMPLATE = React.lazy(() => import('../pages/generate-CV/CV-Template'));

const InstantMessaging = React.lazy(() =>
  import("pages/instant-messaging/InstantMessaging")
);

const Artisan = React.lazy(() => import("../pages/artisans/List"));

const ListJob = React.lazy(() => import("../pages/job/ListJob"));
const ListJobDetail = React.lazy(() => import("pages/job/ListJobDetail"));
const Accounts = React.lazy(() => import("pages/admin/dashboard/Accounts"));

const VideoChat = React.lazy(() => import("../pages/VideoCalling/VideoScreen"));
const Home = React.lazy(() => import("../Home"));

const ChangePassword = React.lazy(() =>
  import("../pages/auth/chanagepassword/ChangePassword")
);
const Settings = React.lazy(() => import("../pages/settings/settings"));
const Policy = React.lazy(() => import("pages/policy"));

const AppRouter = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  let previousLocation = location;

  const isModal = location.state && location.state.modal;

  useEffect(() => {
    dispatch(clearMessage());
  }, [location, dispatch]);
  return (
    <React.Suspense fallback={<AppLoading />}>
      <Switch>
        <AnonymousRoute exact path="/" component={LandingPage} />
        <AnonymousRoute
          exact
          path="/job-search-results"
          component={JobSearchResults}
        />
        <AnonymousRoute path="/login" exact component={Login} />
        <AnonymousRoute path="/register" exact component={Register} />
        <AnonymousRoute
          path="/security-verification"
          exact
          component={SecurityVerification}
        />
        <AnonymousRoute
          path="/confirmationpage"
          exact
          component={ConfirmationPage}
        />
        <AnonymousRoute
          path="/emailconfirmation"
          exact
          component={EmailConfirmation}
        />
        <AnonymousRoute path="/accounttype" exact component={AccountType} />
        <AnonymousRoute
          path="/employeraccounttype"
          exact
          component={EmployerAccountType}
        />
        <AnonymousRoute
          path="/employeeaccounttype"
          exact
          component={EmployeeAccountType}
        />
        <AnonymousRoute
          path="/forgotpassword"
          exact
          component={ForgotPassword}
        />
        <AnonymousRoute
          path="/recoverbynumber"
          exact
          component={RecoverByNumber}
        />
        <AnonymousRoute
          path="/recoverbyemail"
          exact
          component={RecoverByEmail}
        />
        <AnonymousRoute path="/reset" exact component={NewPassword} />
        <Route path="/offline" exact component={OfflinePage} />

        <AnonymousRoute path="/policy" exact component={Policy} />

        <ProtectedRoute path="/pagenotfound" exact component={PageNotFound} />
        <ProtectedRoute
          path="/internalservererror"
          component={InternalServerError}
        />
        <ProtectedRoute path="/badrequest" component={BadRequest} />
        <ProtectedRoute path="/profile" component={UserProfile} />
        <ProtectedRoute path="/applicant/:id" component={ApplicantProfile} />
        <ProtectedRoute path="/company" component={CompanyProfile} />
        <ProtectedRoute path="/jobs/create" component={CreateJob} />
        <ProtectedRoute path="/jobs" exact component={ListJob} />
        <ProtectedRoute
          path="/jobs/view/:jobListId"
          component={ListJobDetail}
        />

        {/* <ProtectedRoute path="/companyprofile" component={CompanyProfile} /> */}
        <ProtectedRoute path="/dashboard" component={Dashboard} />

        {/* INSTANT HIRE ROUTE */}
        <ProtectedRoute
          path="/create-instant-hire"
          component={CreateInstantJobHire}
        />
        <ProtectedRoute path="/instant-hires" component={ListInstantJobHire} />
        <ProtectedRoute
          path="/instant-hire/view/:id"
          component={ViewInstantJobHire}
        />
        <ProtectedRoute
          path="/instant-hire/edit/:id"
          component={EditInstantJobHire}
        />
        <ProtectedRoute
          path="/instant-hire-applicants/:id"
          component={Applicant}
        />
        <ProtectedRoute path="/instant-jobs" component={InstantJobs} />
        <ProtectedRoute path="/artisans" exact component={Artisan} />
        <ProtectedRoute
          path="/review/:jobId/:applicantId"
          exact
          component={Review}
        />

        {/* NOTIFICATION */}
        <ProtectedRoute path="/notifications" component={Notification} />

        <ProtectedRoute path="/changepassword" component={ChangePassword} />

        <AnonymousRouteOrProtectedRoute
          path="/posts"
          exact
          component={Timeline}
        />
        <AnonymousRouteOrProtectedRoute
          path="/post/:id"
          exact
          component={ViewPost}
        />
        <ProtectedRoute path="/contacts" exact component={ListContacts} />
        <ProtectedRoute
          path="/contacts/create"
          exact
          component={CreateContacts}
        />

        {/* <ProtectedRoute path="/howtostart" exact component={HOWTOSTART} /> */}
        {/* <ProtectedRoute path="/cv-template" component={CVTEMPLATE} /> */}
        {/* INSTANT MESSAGING */}
        <ProtectedRoute
          path="/instant-messaging"
          children={<InstantMessaging />}
        />
        <ProtectedRoute path="/settings" component={Settings} />

        {/* VIDEO CHAT */}
        <ProtectedRoute path="/videochat" component={VideoChat} />
        {/* admin routes */}
        <ProtectedAdminRoute path="/admin" component={AdminDashboard} />
        <ProtectedAdminRoute
          path="/admin-qualification"
          component={AdminQualification}
        />
        <ProtectedAdminRoute path={`/admin-skills`} component={AdminSkill} />
        <ProtectedAdminRoute
          path="/admin-contractType"
          component={AdminContractType}
        />
        <ProtectedAdminRoute
          path="/admin-services"
          component={AdminServicesAndServiceGroups}
        />
        <ProtectedAdminRoute path="/accounts" component={Accounts} />
        <ProtectedRoute path="/new-vid-call" component={Home} />

        <Redirect to="/login" />
      </Switch>
      {/* {isModal
        && <ProtectedRoute
          path="/instant-messaging"
          component={ModalRoute}
        />
      } */}
    </React.Suspense>
  );
};

export default AppRouter;
