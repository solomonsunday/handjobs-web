import { PROFILE } from "constants/profile";
import { useState } from "react";

import SectionHeader from "components/profile/SectionHeader";
import "../profile/UserProfile.css";

const Job = ({ openCreate, openEdit, profileInfo }) => {
  const [portfolios, setPortfolios] = useState([]);

  const expandImage = (e) => {
    openEdit(PROFILE.PORTFOLIO_MODAL);
  };

  return (
    <>
      <div className="p-col-12 p-md-3 p-pt-2">
        <div className="p-card">
          <SectionHeader
            icon="briefcase"
            sectionTitle="Instant Jobs"
            id="portfolioEdit"
            // showAddButton="false"
            showEditButton="false"
          />
          <div className="p-card-body p-grid p-mt-2">
            {/* <RecentInstantJobs /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Job;
