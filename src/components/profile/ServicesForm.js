import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import ModeFooter from "./ModeFooter";
import { useDispatch, useSelector } from "react-redux";
import {
  createService,
  deleteService,
  getServices,
} from "store/modules/service";
// import { getSkills } from "store/modules/admin";

// const skillsList = ["Java", "Javascript", "Python", "Database", "Graphic Design", "Web Design", "Software Analysis"];

const ServicesForm = ({ data, closeEditMode }) => {
  const dispatch = useDispatch();
  const loading = false;
  const serviceList = useSelector((state) => state.service.services);
  const { register, handleSubmit, setValue } = useForm();

  const [currentService, setCurrentService] = useState("");
  const [services, setServices] = useState([]);
  const [duplicateError, setDuplicateError] = useState(false);

  useEffect(() => {
    dispatch(getServices());
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      setCurrentService();
      setServices(data);
      register("services");
      setValue("services", data);
    }
  }, [data]);

  const searchObjectArrayValues = (array, object) => {
    const serviceExists = array.filter((service) => service === object.name);
    return !Boolean(serviceExists.length > 0);
  };

  const handleServiceChange = (e) => {
    setCurrentService(e.value);
  };

  const handleServiceAdd = () => {
    if (services.length === 5) {
      setCurrentService("");
      return;
    }

    if (currentService) {
      if (searchObjectArrayValues(services, currentService)) {
        setServices([...services, currentService.name]);
        setValue("services", services);
        setCurrentService("");
        setDuplicateError(false);
      } else {
        setDuplicateError(true);
      }
    }
  };

  const handleServiceDelete = (serviceToDelete) => {
    const newServiceArray = services.filter(
      (service) => service !== serviceToDelete
    );

    setServices(newServiceArray);
    setValue("services", newServiceArray);
  };

  const serviceSubmit = (data) => {
    console.log("services", services, "data", data);
    if (services.length > 0) {
      dispatch(createService({ services }));
    } else {
      return window.alert("Service must be more than one")
    }

  };

  const componentStatus = { services: "add" };
  if (data?.length > 0) {
    componentStatus.services = "edit";
  }

  return (
    <>
      <div className="p-mt-2">
        <SectionHeader
          componentStatus={componentStatus}
          icon="tag"
          sectionTitle="Services"
        />
        <div className="">
          <div></div>
          <form onSubmit={handleSubmit(serviceSubmit)}>
            <label htmlFor="serviceInput" className="inputLabel p-pr-3">
              Add up to 5 services
            </label>
            {services.map((service, index) => (
              <button
                key={index}
                onClick={(e) => handleServiceDelete(service)}
                type="button"
                className="p-mr-2 p-p-0 p-mb-1 tag-container"
                id={service?.id}
              >
                {loading ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  <span></span>
                )}
                <Tag value={service} icon={`pi pi-times`} className="p-p-2"></Tag>
              </button>
            ))}
            <span className="serviceInput">
              <Dropdown
                value={currentService}
                options={serviceList}
                onChange={handleServiceChange}
                optionLabel="name"
                filter
                showClear
                filterBy="name"
                placeholder="Select Service"
                icon="pi pi-plus"
              />
              <i className="pi pi-plus ml-1" onClick={handleServiceAdd}></i>
            </span>

            <ModeFooter id="serviceEdit" onCancel={closeEditMode} />
            {duplicateError && (
              <div class="alert alert-danger">Service already exists</div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ServicesForm;
