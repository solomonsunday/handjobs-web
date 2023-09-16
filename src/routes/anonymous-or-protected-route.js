import AnonymousNavBar from "components/AnonymousNavBar";
import AppNavBar from "components/AppNavBar";
import { Redirect, Route } from "react-router";
import agent from "../services/agent.service";

const AnonymousRouteOrProtectedRoute = ({ children, ...rest }) => {
  if (!agent.Auth.isAuth()) {
    return (
      <>
        <AnonymousNavBar />
        <Route {...rest}>{children}</Route>
      </>
    );
  } else {
    if (agent.Auth.isAdmin()) {
      return <Redirect to={{ pathname: "/admin" }} />;
    } else {
      return (
        <>
          <div className="d-flex flex-column">
            <AppNavBar />
            <Route {...rest}>{children}</Route>
          </div>
        </>
      );
    }
  }
};

export default AnonymousRouteOrProtectedRoute;
