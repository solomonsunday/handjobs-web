import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import InstantHeader from "./instant-header";
import { confirmDialog } from "primereact/confirmdialog";
import { useDispatch, useSelector } from "react-redux";
import { createInstantJob } from "store/modules/instantJob";
import { Calendar } from "primereact/calendar";
import RecentInstantJobs from "pages/instant-jobs/Recent_instant_Jobs";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import { FaMapMarkerAlt } from "react-icons/fa";

import "./InstantJobHire.css";
import { loadServices } from "store/modules/admin";
import { loadLga, loadStates } from "store/modules/location";

const New = ({ mode }) => {
  const dispatch = useDispatch();
  const states = useSelector((state) => state.location.states);
  const Lgas = useSelector((state) => state.location.lgas);
  const loading = useSelector((state) => state.instantJob.loading);
  const services = useSelector((state) => state.admin.services).data;

  const toast = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { startdate, enddate } = watch(["startDate", "endDate"]);

  const [desc, setDesc] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isJobDateNow, setIsJobDateNow] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [selectedState, setSelectedState] = useState("");
  const [selectLga, setSelectLga] = useState("");

  useEffect(() => {
    dispatch(loadServices(page, limit, "loadServices", search));
  }, []);

  let id = 1;
  useEffect(() => {
    dispatch(loadStates(id));
  }, [id]);

  useEffect(() => {
    if (selectedState) {
      dispatch(loadLga(selectedState?.id));
    }
  }, [selectedState]);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    setLocation(value);
    setValue("location", location, { shouldValidate: true });
  };

  const handleSelectAddress = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setAddress(value);
    setValue("address", address, { shouldValidate: true });
    setCoordinates(ll);
  };

  // const minDate = () => {
  //     let mindate = new Date();
  //     console.log("mindate", mindate)
  //     let fomatDate = mindate.split(" ")
  //     return mindate
  // }

  // let mindate = new Date();
  // console.log("mindate", mindate)

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSelectedCategory(e.value);
    setValue(name, value, { shouldValidate: true });
  };

  const handleStateChange = (e) => {
    const { name, value } = e.target;
    setSelectedState(e.value);
    setValue(name, value, { shouldValidate: true });
  };

  const handleLgaChange = (e) => {
    const { name, value } = e.target;
    setSelectLga(e.value);
    setValue(name, value, { shouldValidate: true });
  };

  let period = new Date();
  let instantJobDate =
    period.getUTCFullYear() +
    "/" +
    (period.getUTCMonth() + 1) +
    "/" +
    period.getUTCDate() +
    " " +
    period.getUTCHours() +
    ":" +
    period.getUTCMinutes() +
    ":" +
    period.getUTCSeconds();

  // useEffect(() => {
  // if (isJobDateNow) {
  //     isJobDateNow && setValue("startDate", instantJobDate, { shouldValidate: true })
  //     console.log("instant job => ", instantJobDate)
  // }

  // }, [])

  const toggleJobDate = (e) => {
    if (e.target.checked) {
      setValue("startDate", instantJobDate, { shouldValidate: true });
      // setValue("time", new Date().toLocaleTimeString(), { shouldValidate: false })

      setIsJobDateNow(true);
    } else {
      setValue("startDate", "", { shouldValidate: true });
      setIsJobDateNow(!isJobDateNow);
    }
  };

  // const locateUserHandler = () => {
  //     if (!navigator.geolocation) {
  //         alert('location feature is not available in your browser, please use another browser');
  //         return;
  //     }
  //     navigator.geolocation.getCurrentPosition(successResult => {
  //         const coordinates = {
  //             lat: successResult.coords.latitude,
  //             lng: successResult.coords.longitude,
  //         }
  //         console.log("user location -", coordinates)

  //         fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${API_KEY}`)

  //             .then(response => response.json())
  //             .then(data => {
  //                 let requester_location = data.results[0].formatted_address;
  //                 console.log("requester's location => ", requester_location)
  //                 return requester_location;

  //             })
  //     },
  //         error => {
  //             alert('Could not locate your address unforturnately')
  //         })

  // }

  useEffect(() => {
    register("location", { required: "Location is required" });
    register("address");
  }, [register]);

  const onSubmit = (data) => {
    confirmDialog({
      message: "Are you sure you want to make this request?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        if (isJobDateNow) {
          data.startDate = new Date().toISOString();
          data.now = true;
        } else {
          data.now = false;
        }
        data.service = data.service.name;
        // data.requesterLocation = locateUserHandler();
        data.requesterLocation = {
          lat: coordinates.lat,
          long: coordinates.lng,
        };
        data.location = location;
        data.address = address || location;
        data.state = selectedState.id;
        data.lga = selectLga.id;
        console.log(data, "create Data");
        dispatch(createInstantJob(data));
      },
      reject: () => {
        return;
      },
    });
  };

  return (
    <div>
      <div className="background instant">
        <div className="content-container">
          <div className="p-grid">
            <div className="p-col-12 p-md-9">
              <div
                className="card card-size-list"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body"></div>
                <InstantHeader
                  title="Request Instant Service"
                  showBack={true}
                />

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="p-fluid p-md-6 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="service">
                          {" "}
                          Select Type of Service Needed{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <Dropdown
                          options={services}
                          optionLabel="name"
                          filter
                          showClear
                          filterBy="name"
                          icon="pi pi-plus"
                          id="service"
                          name="service"
                          value={selectedCategory}
                          {...register("service", {
                            required: ` Please Select a service`,
                          })}
                          onChange={handleChange}
                        />

                        {errors.service && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.service.message}</p>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-fluid p-md-6 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="location">
                          Service Location{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <PlacesAutocomplete
                          value={location}
                          onChange={setLocation}
                          onSelect={handleSelect}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div style={{ position: "relative" }}>
                              <InputText
                                {...getInputProps({
                                  // placeholder: 'Enter Location ...',
                                  className: "location-search-input",
                                  name: "location",
                                })}
                              />
                              <div className="autocomplete-dropdown-container geolocation-dropdown">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion) => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                        padding: "4px",
                                      }
                                    : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer",
                                        padding: "4px",
                                      };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                    >
                                      <FaMapMarkerAlt />{" "}
                                      <span>{suggestion.description}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                        {errors.location && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.location.message}</p>
                          </span>
                        )}
                        {/* <InputText
                                                    type="text"
                                                    placeholder="Location"
                                                    name="location"
                                                    {...register("location", { required: "Location is required" })}
                                                />
                                                {errors.location && <span className="text-danger font-weight-bold "> <p>{errors.location.message}</p>
                                                </span>} */}
                      </div>
                    </div>

                    <div className="p-fluid p-md-6 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="address">
                          Meet-up Location (if different from service location){" "}
                        </label>
                        <PlacesAutocomplete
                          value={address}
                          onChange={setAddress}
                          onSelect={handleSelectAddress}
                        >
                          {({
                            getInputProps,
                            suggestions,
                            getSuggestionItemProps,
                            loading,
                          }) => (
                            <div style={{ position: "relative" }}>
                              <InputText
                                {...getInputProps({
                                  // placeholder: 'Enter meet-up location ...',
                                  className: "location-search-input",
                                  name: "address",
                                })}
                              />
                              <div
                                className="autocomplete-dropdown-container"
                                style={{
                                  position: "absolute",
                                  top: "40px",
                                  boxShadow: "1px 3px 2px #eee",
                                  width: "100%",
                                  zIndex: 1,
                                }}
                              >
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion) => {
                                  const className = suggestion.active
                                    ? "suggestion-item--active"
                                    : "suggestion-item";
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? {
                                        backgroundColor: "#fafafa",
                                        cursor: "pointer",
                                        padding: "4px",
                                      }
                                    : {
                                        backgroundColor: "#ffffff",
                                        cursor: "pointer",
                                        padding: "4px",
                                      };
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                    >
                                      <FaMapMarkerAlt />{" "}
                                      <span>{suggestion.description}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                        {errors.address && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.address.message}</p>
                          </span>
                        )}
                        {/* <InputText
                                                    type="text"
                                                    placeholder="Enter a plcae"
                                                    name="address"
                                                    {...register("address", { required: "Address is required" })}
                                                    id="autocomplete"
                                                />
                                                {errors.address && <span className="text-danger font-weight-bold "> <p>{errors.address.message}</p>
                                                </span>} */}
                      </div>
                    </div>

                    {/* <div className="p-fluid p-md-6 p-sm-12">
                                            <div className="p-field">
                                                <label htmlFor="phoneNumber">Phone Number * </label>
                                                <InputText
                                                    type="number"
                                                    // placeholder="Phone Number"
                                                    name="phoneNumber"
                                                    {...register("phoneNumber", { required: "Phone Number is required" })}

                                                />

                                                {errors.phoneNumber && <span className="text-danger font-weight-bold "> <p>{errors.phoneNumber.message}</p>
                                                </span>}
                                            </div>
                                        </div> */}
                    <div className="p-fluid p-md-3 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="state">
                          {" "}
                          State <span className="text-danger">*</span>
                        </label>
                        <Dropdown
                          options={states}
                          optionLabel="name"
                          filter
                          showClear
                          filterBy="name"
                          icon="pi pi-plus"
                          id="state"
                          name="state"
                          value={selectedState}
                          {...register("state", {
                            required: ` Please Select a state`,
                          })}
                          onChange={handleStateChange}
                        />

                        {errors.state && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.state.message}</p>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-fluid p-md-3 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="lga">
                          {" "}
                          LGA <span className="text-danger">*</span>
                        </label>

                        <Dropdown
                          options={Lgas}
                          optionLabel="name"
                          filter
                          showClear
                          filterBy="name"
                          icon="pi pi-plus"
                          id="lga"
                          name="lga"
                          value={selectLga}
                          {...register("lga", {
                            required: ` Please Select a LGA`,
                          })}
                          onChange={handleLgaChange}
                        />

                        {errors.lga && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.lga.message}</p>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-fluid p-md-6 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="startDate">
                          {" "}
                          Start Date <span className="text-danger">*</span>{" "}
                          &nbsp; ({" "}
                          <input
                            type="checkbox"
                            onClick={toggleJobDate}
                            name="instance"
                            defaultChecked={isJobDateNow}
                            className="align-text-bottom"
                          />
                          <small className="font-weight-bold"> NOW </small> )
                          &nbsp;{" "}
                          {isJobDateNow && (
                            <span className="appcolor text-white px-3">
                              {" "}
                              {instantJobDate}
                            </span>
                          )}
                        </label>
                        <Calendar
                          id="startDate"
                          type="date"
                          value={startDate}
                          disabled={isJobDateNow}
                          // maxDate={endDate}
                          name="startDate"
                          {...register("startDate", {
                            required: ` Start Date is required`,
                          })}
                          onSelect={(e) => {
                            const inputName = "startDate";
                            const value = new Date(e.value).toISOString();

                            setStartDate(value);
                            setValue(inputName, value, {
                              shouldValidate: true,
                            });
                          }}
                          // min={new Date().toISOString().split('T')[0]}

                          // name="startDate"
                          // {...register("startDate", {
                          //     required: `Start date is required`,
                          // })}
                        />
                        {errors.startDate && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.startDate.message}</p>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-fluid p-md-6 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="endDate">
                          {" "}
                          End Date <span className="text-danger">*</span>{" "}
                        </label>
                        <Calendar
                          id="endDate"
                          type="date"
                          value={endDate}
                          // minDate={minDate}
                          name="endDate"
                          {...register("endDate", {
                            required: `End Date is required`,
                          })}
                          onSelect={(e) => {
                            const inputName = "endDate";
                            const value = e.value.toISOString();
                            setEndDate(value);
                            setValue(inputName, value, {
                              shouldValidate: true,
                            });
                          }}
                          {...register("endDate", {
                            required: ` End date is required`,
                            validate: (value) =>
                              !value ||
                              !startdate ||
                              value > startdate ||
                              "End date cannot be less than Start date",
                          })}
                        />
                        {errors.endDate && (
                          <span className="text-danger font-weight-bold">
                            &nbsp; {errors.endDate.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* {!isJobDateNow && <div className="p-fluid p-md-6 p-sm-12">
                                            <div className="p-field">
                                                <label htmlFor="lastname"> Time *</label>
                                                <InputText type="time"
                                                    placeholder="Time"
                                                    name="time"
                                                    {...register("time", { required: "Time is required" })}
                                                />
                                                {errors.time && <span className="text-danger font-weight-bold "> <p>{errors.time.message}</p>
                                                </span>}
                                            </div>
                                        </div>} */}
                    <div className="p-fluid p-md-12 p-sm-12">
                      <div className="p-field">
                        <label htmlFor="lastname">
                          Describe Service Needed{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <InputTextarea
                          defaultValue={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          rows={3}
                          cols={30}
                          // placeholder="Job Description"
                          name="description"
                          {...register("description", {
                            required: "Description is required",
                          })}
                        />
                        {errors.description && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.description.message}</p>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    icon="pi pi-check"
                    iconPos="left"
                    label={loading ? "Please wait..." : "Submit"}
                    disabled={loading}
                    type="submit"
                    className="float-right rounded-pill"
                  />
                </form>

                {/* <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?"
                header="Confirmation" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
            <Button onClick={() => setVisible(true)} icon="pi pi-check" label="Confirm" /> */}
              </div>
            </div>
            <RecentInstantJobs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
