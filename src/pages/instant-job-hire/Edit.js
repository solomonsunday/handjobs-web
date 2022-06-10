import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import InstantHeader from './instant-header';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { createInstantJob, editInstantJob, loadInstantJob } from 'store/modules/instantJob';
import { Calendar } from 'primereact/calendar';
import Job from './Job';

import './InstantJobHire.css'
import moment from 'moment';
import { Redirect } from 'react-router';
import agentService from 'services/agent.service';
import { loadServices } from 'store/modules/admin';
import { FaMapMarkerAlt } from "react-icons/fa";

import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng, } from 'react-places-autocomplete';
import { loadLga, loadStates } from 'store/modules/location';

const Categories = [
    { name: 'Machine', code: 'Mec' },
    { name: 'Plumber', code: 'Plu' },
    { name: 'Tailor', code: 'Tai' },
    { name: 'chef', code: 'chef' },
    { name: 'Dry-cleaners', code: 'Lan' },
    { name: 'Painter', code: 'Pai' },
    { name: 'Janitor', code: 'Jan' },
    { name: 'Massage', code: 'Mas' },

];

const Edit = (props) => {

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const instantjob = useSelector(state => state.instantJob.instantjob);
    const loading = useSelector(state => state.instantJob.loading);
    const services = useSelector(state => state.admin.services).data;
    const states = useSelector(state => state.location.states);
    const Lgas = useSelector(state => state.location.lgas);

    const [desc, setDesc] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isJobDateNow, setIsJobDateNow] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [itemToEdit, setItemToEdit] = useState({});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

    const [selectedState, setSelectedState] = useState("");
    const [selectLga, setSelectLga] = useState("");




    const loggedInUserId = agentService.Auth.current().id

    const instantJobId = props.match.params.id;

    useEffect(() => {
        dispatch(loadInstantJob(instantJobId))
    }, [dispatch])

    useEffect(() => {
        setItemToEdit(instantjob)
        if (itemToEdit) {
            itemToEdit.startDate = new Date(itemToEdit.startDate);
            itemToEdit.endDate = new Date(itemToEdit.endDate);
            let category = Categories.find(category => category.name === itemToEdit.service);
            setSelectedCategory(category)

            setValue("service", itemToEdit.service);
            setValue("location", itemToEdit.location);
            setValue("address", itemToEdit.address);
            setValue("phoneNumber", itemToEdit.phoneNumber);
            setValue("endDate", itemToEdit.endDate);
            setValue("startDate", itemToEdit.startDate);
            setValue("description", itemToEdit.description);
            setValue("state", itemToEdit.state);
            setValue("lga", itemToEdit.lga);
        }
    }, [instantjob, itemToEdit])

    console.log(itemToEdit, "itemToEdit")

    useEffect(() => {
        dispatch(loadServices(page, limit, "loadServices", search));
    }, [])

    useEffect(() => {
        if (selectedState) {
            dispatch(loadLga(selectedState?.id))
        }
    }, [selectedState])

    const handleSelect = async (value) => {
        const results = await geocodeByAddress(value);
        setLocation(value);
        setValue("location", location, { shouldValidate: true })
    }

    let id = 1
    useEffect(() => {
        dispatch(loadStates(id));
    }, [id]);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setItemToEdit({ ...itemToEdit, [name]: value ?? JSON.parse(value) });
        setValue(name, value, { shouldValidate: true });

    }
    const handleChange = (e) => {
        const { name, value } = e.target;

        setSelectedCategory(e.value);
        setValue(name, value, { shouldValidate: true });
    };


    const handleSelectAddress = async (value) => {
        const results = await geocodeByAddress(value);
        const ll = await getLatLng(results[0]);
        setAddress(value);
        setValue("address", address, { shouldValidate: true })
        setCoordinates(ll);
    }


    const handleStateChange = (e) => {
        const { name, value } = e.target;
        setSelectedState(e.value);
        setValue(name, value, { shouldValidate: true });
    }


    const handleLgaChange = (e) => {
        const { name, value } = e.target;
        setSelectLga(e.value);
        setValue(name, value, { shouldValidate: true })
    }

    useEffect(() => {
        register("location", { required: "Location is required" })
        register("address", { required: "Address is required" })
    }, [register])


    // const toggleJobDate = (e) => {
    //     if (e.target.checked) {
    //         let period = new Date();
    //         let instantJobDate = period.getUTCFullYear() + "/" + (period.getUTCMonth() + 1) + "/" + period.getUTCDate() + " " + period.getUTCHours() + ":" + period.getUTCMinutes() + ":" + period.getUTCSeconds();
    //         setValue("jobDate", instantJobDate, { shouldValidate: true })
    //         setJobDateNow(true);
    //         console.log({ instantJobDate });

    //     } else {
    //         setValue("jobDate", " ", { shouldValidate: true })
    //         setJobDateNow(false);
    //     }
    // }


    let period = new Date();
    let instantJobDate = period.getUTCFullYear() + "/" + (period.getUTCMonth() + 1) + "/" + period.getUTCDate() + " " + period.getUTCHours() + ":" + period.getUTCMinutes() + ":" + period.getUTCSeconds();

    const toggleJobDate = (e) => {
        if (e.target.checked) {
            setValue("startDate", instantJobDate, { shouldValidate: true })
            // setValue("time", new Date().toLocaleTimeString(), { shouldValidate: false })

            setIsJobDateNow(true);
        } else {
            setValue("startDate", "", { shouldValidate: true })
            setIsJobDateNow(!isJobDateNow);
        }
    }

    const onSubmit = (data) => {
        if (isJobDateNow) {
            data.startDate = new Date().toISOString()
            data.now = true;
        } else {
            data.now = false;
        }
        data.service = data.service.name;

        data.requesterLocation = { lat: coordinates.lat, long: coordinates.lng };
        data.location = location;
        data.address = address;
        data.state = selectedState.id;
        data.lga = selectLga.id;
        console.log(data, "create Data");

        dispatch(editInstantJob(instantJobId, data, "loading"));
    }
    // if (instantjob.accountId !== loggedInUserId) {
    //     return <Redirect to={"/instant-jobs"} />
    // }

    return (

        <>
            <div className="background instant" >
                <div className="content-container">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-9">
                            <div className="card card-size-list" style={{ borderRadius: "1rem" }}>
                                <div className="card-body">

                                    <InstantHeader
                                        title="Edit instant hire"
                                        showBack={true}
                                    />
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="row">
                                            <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="service">Select Type of Service Needed <span className='text-danger'>*</span></label>
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
                                                        {...register("service", { required: `Please Select a service` })}
                                                        onChange={handleChange}
                                                    />
                                                    {errors.service && <span className="text-danger font-weight-bold "> <p>{errors.service.message}</p>
                                                    </span>}
                                                </div>

                                            </div>
                                            {/* <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="location">Location * </label>
                                                    <InputText
                                                        type="text"
                                                        placeholder="Location"
                                                        name="location"
                                                        defaultValue={itemToEdit?.location}
                                                        onChange={(e) => handleOnChange(e)}

                                                        {...register("location", { required: "Location is required" })}
                                                    />
                                                    {errors.location && <span className="text-danger font-weight-bold "> <p>{errors.location.message}</p>
                                                    </span>}
                                                </div>
                                            </div> */}
                                            <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="location">Service Location <span className='text-danger'>*</span></label>
                                                    <PlacesAutocomplete
                                                        value={location}
                                                        onChange={setLocation}
                                                        onSelect={handleSelect}
                                                    >
                                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                            <div style={{ position: 'relative' }}>
                                                                <InputText
                                                                    {...getInputProps({
                                                                        // placeholder: 'Enter Location ...',
                                                                        className: 'location-search-input',
                                                                        name: "location"
                                                                    })}

                                                                />
                                                                <div className="autocomplete-dropdown-container" style={{ position: 'absolute', top: '40px', boxShadow: '1px 3px 2px #eee', width: '100%' }}>
                                                                    {loading && <div>Loading...</div>}
                                                                    {suggestions.map(suggestion => {
                                                                        const className = suggestion.active
                                                                            ? 'suggestion-item--active'
                                                                            : 'suggestion-item';
                                                                        // inline style for demonstration purpose
                                                                        const style = suggestion.active
                                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer', padding: '4px', }
                                                                            : { backgroundColor: '#ffffff', cursor: 'pointer', padding: '4px', };
                                                                        return (
                                                                            <div
                                                                                {...getSuggestionItemProps(suggestion, {
                                                                                    className,
                                                                                    style,
                                                                                })}
                                                                            >
                                                                                <FaMapMarkerAlt /> <span>{suggestion.description}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </PlacesAutocomplete>
                                                    {errors.location && <span className="text-danger font-weight-bold "> <p>{errors.location.message}</p>
                                                    </span>}
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

                                            {/* 
                                            <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="address">Meet Up Location * </label>
                                                    <InputText
                                                        type="text"
                                                        placeholder="Address"
                                                        name="address"
                                                        defaultValue={itemToEdit?.address}
                                                        onChange={(e) => handleOnChange(e)}
                                                        {...register("address", { required: "Address is required" })}
                                                    />
                                                    {errors.address && <span className="text-danger font-weight-bold "> <p>{errors.address.message}</p>
                                                    </span>}
                                                </div>
                                            </div> */}
                                            <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="address">Meet-up Location (if different from service location) </label>
                                                    <PlacesAutocomplete
                                                        value={address}
                                                        onChange={setAddress}
                                                        onSelect={handleSelectAddress}
                                                    >
                                                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                            <div style={{ position: 'relative' }}>
                                                                <InputText
                                                                    {...getInputProps({
                                                                        // placeholder: 'Enter meet-up location ...',
                                                                        className: 'location-search-input',
                                                                        name: "address"
                                                                    })}

                                                                />
                                                                <div className="autocomplete-dropdown-container" style={{ position: 'absolute', top: '40px', boxShadow: '1px 3px 2px #eee', width: '100%', zIndex: 1 }}>
                                                                    {loading && <div>Loading...</div>}
                                                                    {suggestions.map(suggestion => {
                                                                        const className = suggestion.active
                                                                            ? 'suggestion-item--active'
                                                                            : 'suggestion-item';
                                                                        // inline style for demonstration purpose
                                                                        const style = suggestion.active
                                                                            ? { backgroundColor: '#fafafa', cursor: 'pointer', padding: '4px' }
                                                                            : { backgroundColor: '#ffffff', cursor: 'pointer', padding: '4px' };
                                                                        return (
                                                                            <div
                                                                                {...getSuggestionItemProps(suggestion, {
                                                                                    className,
                                                                                    style,
                                                                                })}
                                                                            >
                                                                                <FaMapMarkerAlt /> <span>{suggestion.description}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </PlacesAutocomplete>
                                                    {errors.address && <span className="text-danger font-weight-bold "> <p>{errors.address.message}</p>
                                                    </span>}
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

                                            <div className="p-fluid p-md-3 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="state"> State <span className='text-danger'>*</span></label>
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
                                                        {...register("state", { required: ` Please Select a state` })}
                                                        onChange={handleStateChange}
                                                    />

                                                    {errors.state && <span className="text-danger font-weight-bold "> <p>{errors.state.message}</p>
                                                    </span>}
                                                </div>

                                            </div>
                                            <div className="p-fluid p-md-3 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="lga"> LGA <span className='text-danger'>*</span></label>

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
                                                        {...register("lga", { required: ` Please Select a LGA` })}
                                                        onChange={handleLgaChange}
                                                    />

                                                    {errors.lga && <span className="text-danger font-weight-bold "> <p>{errors.lga.message}</p>
                                                    </span>}
                                                </div>

                                            </div>
                                            <div className="p-fluid p-md-6 p-sm-12">

                                                <div className="p-field">
                                                    <label htmlFor="startDate">  Start Date <span className='text-danger'>*</span> &nbsp;
                                                        ( <input type="checkbox" onClick={toggleJobDate} name="instance" defaultChecked={isJobDateNow}
                                                            className="align-text-bottom" />
                                                        <small className="font-weight-bold"> NOW </small>  )  &nbsp; {isJobDateNow && (<span className="appcolor text-white px-3"> {instantJobDate}</span>)}
                                                    </label>
                                                    <Calendar
                                                        id="startDate"
                                                        type="date"
                                                        value={itemToEdit?.startDate}
                                                        disabled={isJobDateNow}
                                                        name="startDate"
                                                        {...register("startDate", {
                                                            required: `Start Date is required`,
                                                        })}
                                                        onSelect={(e) => {
                                                            const inputName = "startDate";
                                                            const value = new Date(e.value).toISOString();
                                                            setValue(inputName, value, { shouldValidate: true });
                                                        }}
                                                        // name="startDate"
                                                        {...register("startDate", { required: `Start date is required` })}
                                                    />
                                                    {errors.startDate && <span className="text-danger font-weight-bold "> <p>{errors.startDate.message}</p>
                                                    </span>}
                                                </div>
                                            </div>

                                            <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="endDate">End Date <span className='text-danger'>*</span> </label>
                                                    <Calendar
                                                        id="endDate"
                                                        type="date"
                                                        value={itemToEdit?.endDate}
                                                        name="endDate"
                                                        {...register("endDate", {
                                                            required: `End Date is required`,
                                                        })}
                                                        onSelect={(e) => {
                                                            const inputName = "endDate";
                                                            const value = new Date(e.value).toISOString();
                                                            setValue(inputName, value, { shouldValidate: true });
                                                        }}
                                                        // name="endDate"
                                                        {...register("endDate", { required: `* End date is required` })}
                                                    />
                                                    {errors.endDate && (<span className="text-danger font-weight-bold">&nbsp; {errors.endDate.message}</span>)}
                                                </div>
                                            </div>

                                            {/* {!isJobDateNow && <div className="p-fluid p-md-6 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="lastname"> Time *</label>
                                                    <InputText type="time"
                                                        placeholder="Time"
                                                        value={itemToEdit?.time}
                                                        name="time"
                                                        onChange={(e) => handleOnChange(e)}
                                                        {...register("time", { required: "Time is required" })}
                                                    />
                                                    {errors.time && <span className="text-danger font-weight-bold "> <p>{errors.time.message}</p>
                                                    </span>}
                                                </div>
                                            </div>} */}
                                            <div className="p-fluid p-md-12 p-sm-12">
                                                <div className="p-field">
                                                    <label htmlFor="description"> Description <span className='text-danger'>*</span></label>
                                                    <InputTextarea
                                                        // defaultValue={desc}
                                                        // onChange={(e) => setDesc(e.target.value)}
                                                        rows={3}
                                                        cols={30}
                                                        placeholder="Job Description"
                                                        defaultValue={itemToEdit?.description}
                                                        onChange={(e) => handleOnChange(e)}
                                                        name="description"
                                                        {...register("description", { required: "Description is required" })}
                                                    />
                                                    {errors.description && <span className="text-danger font-weight-bold "> <p>{errors.description.message}</p>
                                                    </span>}
                                                </div>
                                            </div>
                                        </div>
                                        <Button icon="pi pi-check"
                                            iconPos="left"
                                            // label="Submit"
                                            label={loading ? "Please wait..." : "Update"}
                                            disabled={loading}
                                            // id="saveButton"
                                            type="submit"
                                            className="float-right rounded-pill" />
                                    </form>

                                </div>
                            </div>
                        </div>
                        <Job />

                    </div>
                </div>
            </div>

        </>
    )
}

export default Edit;
