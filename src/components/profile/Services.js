import React from "react";
import SectionHeader from "./SectionHeader";
import { PROFILE } from "constants/profile";
import "./UserProfile.css";
import { Badge } from "primereact/badge";
import { Tag } from "primereact/tag";

const Services = ({ openEdit, openCreate, profileInfo, isViewApplicant }) => {
  const formatServices = (services) => {
    // console.log(services);
    if (services != undefined && services.length) {
      return services.map((service, i) => (
        <span key={i}>
          <Tag>{service}</Tag>&nbsp;&nbsp;
        </span>
      ));
    }
    return <div></div>;
    const serviceTemp =
      services.length > 0
        ? services.map((service, i) => (
          <span key={i}>
            <Tag>{service}</Tag>&nbsp;&nbsp;
          </span>
        ))
        : "";
    return serviceTemp;
  };

  return (
    <>
      <div className="p-card p-mt-2" style={{ borderRadius: "1rem" }}>
        <SectionHeader
          icon="tag"
          sectionTitle="Services"
          id="servicesEdit"
          showAddButton="true"
          showEditButton="true"
          openModalOnCreate={() => openEdit(PROFILE.SERVICE)}
          openModalOnEdit={() => openCreate(PROFILE.SERVICE)}
          isViewApplicant={isViewApplicant}
        // onClick={mode}
        />
        <div className="p-card-body">
          <strong>{formatServices(profileInfo?.services)}</strong>
        </div>
      </div>
    </>
  );
};

export default Services;
