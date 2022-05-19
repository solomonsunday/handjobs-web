import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useDispatch, useSelector } from "react-redux";
import ModeFooter from './ModeFooter';
import { loadCountry, loadLga, loadStates } from 'store/modules/location';
import { updateContactInfo } from 'store/modules/account';
import SectionHeader from './SectionHeader';
import { Dropdown } from 'primereact/dropdown';
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng, } from 'react-places-autocomplete';
import { FaMapMarkerAlt } from 'react-icons/fa';


const ContactInfoForm = ({ closeEditMode, data }) => {
  const { register, handleSubmit, setValue, trigger, clearErrors, formState: { errors } } = useForm({
    mode: "onChange",
    reValidateMode: "all"
  });
  const dispatch = useDispatch();
  const countries = useSelector(state => state.location.countries);
  const states = useSelector(state => state.location.states);
  const lgas = useSelector(state => state.location.lgas);

  const [contactInfo, setContactInfo] = useState({
    phoneNumber: '',
    country: "",
    email: "",
    city: "",
    postalCode: "",
    address: "",
    state: "",
    lga: ""
  });
  const profileInfo = useSelector(state => state.account.profileInfo);
  const loading = useSelector(state => state.account.submitting);
  const [selectCountry, setSelectedCountry] = useState(null);
  const [newSelectedState, setNewSelectedState] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    dispatch(loadCountry());
  }, []);

  useEffect(() => {
    if (countries) {
      dispatch(loadStates(countries[0]?.id));
    }
  }, [countries]);

  useEffect(() => {
    if (location) {
      let results = location.split(",");

      setRegion(results[1])
      console.log({ results })
    }
  }, [location])



  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    setLocation(value);
    setValue("location", location, { shouldValidate: true })
  }
  console.log({ location });

  const handleSelectAddress = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setLocation(value);
    setValue("address", address, { shouldValidate: true })
    setCoordinates(ll);
  }

  console.log({ location });
  console.log({ coordinates });




  let stateObj;
  useEffect(() => {
    if (states) {
      stateObj = contactInfo.state ? states.find(state => state.name === contactInfo.state.name) : null

      setContactInfo({
        ...contactInfo,
        state: stateObj
      })
      setValue("state", stateObj?.name)
      setContactInfo(stateObj)
    }
  }, [states])

  //fetech LGA useing selected state
  useEffect(() => {
    if (contactInfo.state.id) {
      setNewSelectedState(contactInfo.state.id)
      dispatch(loadLga(newSelectedState))

    }

  }, [contactInfo?.state?.id, newSelectedState])


  useEffect(() => {

    if (profileInfo) {
      setContactInfo({
        ...profileInfo,
        // country: profileInfo.country ? countries.find(c => c.name === profileInfo.country) : countries[0].name,
        state: profileInfo.state ? states.find(s => s.name === profileInfo.state) : states[0].name,
        phoneNumber: profileInfo.contactPhoneNumber || "",
        email: profileInfo.email || "",
        lga: profileInfo.lga || "",
        postalCode: profileInfo.postalCode || "",
        address: profileInfo.address || ""
      });

      for (const [key, value] of Object.entries(profileInfo)) {
        setValue(key, value);
      }
      setValue('phoneNumber', profileInfo.contactPhoneNumber); //`contactPhoneNumber` is variable to bind to `phoneNumber`
      setValue('state', profileInfo.state);
      setValue('lga', profileInfo.lga);
    }

  }, [profileInfo, states]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    const contactData = { ...contactInfo, [name]: value };

    setContactInfo(contactData);
    setValue(name, value)
  }

  const contactInfoSubmit = () => {
    contactInfo.postalCode = 1234; // Postal code not needed but is still required from the back end.
    contactInfo.latLong = coordinates
    contactInfo.region = region;
    contactInfo.address = location
    console.log({ contactInfo })
    dispatch(updateContactInfo(contactInfo));
  }

  const { phoneNumber, email, state, lga, postalCode, address } = contactInfo;

  return (
    <>
      <div className="p-mt-2">
        <SectionHeader icon="phone" sectionTitle="Contact Information" />
        <div className="">
          <form onSubmit={handleSubmit(contactInfoSubmit)}>
            <span className="skillInput p-mb-4 p-fluid p-formgrid p-grid">
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="phoneNumber" className="inputLabel p-pr-3">Phone Number  <span className='text-danger'> * {errors.phoneNumber && <span className="text-danger font-weight-bold"> Phone number is required</span>}</span>
                  {errors?.phoneNumber?.type === 'required' && <small className="text-danger font-weight-bold">&nbsp; {errors.phoneNumber.message}</small>}
                </label>
                <InputText
                  id="phoneNumber"
                  name="phoneNumber"
                  {...register("phoneNumber",
                    {
                      required: true,
                      pattern: /(^[0]\d{10}$)|(^[\+]?[234]\d{12}$)/,
                      validate: value => value?.length > 0 || phoneNumber?.length > 0 || "* Phone Number is required"
                    }
                  )}
                  onChange={handleChange}
                  value={phoneNumber}
                />
              </div>
              <div className="p-field p-col-12 p-md-6">
                <label htmlFor="email" className="inputLabel p-pr-3">Email Address  <span className='text-danger'> * {errors.email && <span className="text-danger font-weight-bold"> Email is required</span>}</span>
                  {errors?.email?.type === 'required' && <small className="text-danger font-weight-bold">&nbsp;
                    {errors?.email?.message}</small>}
                </label>
                <InputText
                  name="email"
                  id="email"
                  type="email"
                  {...register("email",
                    {
                      required: true,
                      validate: value => value?.length > 0 || email?.length > 0 || "* Email is required",
                      pattern: {
                        value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "* Entered value does not match email format"
                      }
                    })}
                  onChange={handleChange}
                  value={email}
                />
              </div>

              <div className="p-field p-col-12 p-md-6 p-py-0 p-pl-2 p-pr-2">
                <label htmlFor="state" className="inputLabel p-pr-3">State  <span className='text-danger'> *</span>
                  {errors?.state?.type === 'required' && <small className="text-danger font-weight-bold">&nbsp; {errors.state.message}</small>}
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
                  {...register("state", { required: 'state is required' })}
                  value={state}
                  onChange={handleChange}

                />
              </div>

              <div className="p-field p-col-12 p-md-6 p-py-0 p-pl-2 p-pr-2">
                <label htmlFor="lga" className="inputLabel p-pr-3">LGA  <span className='text-danger'> *</span>
                  {errors?.lga?.type === 'required' && <small className="text-danger font-weight-bold">&nbsp; {errors.lga.message}</small>}
                </label>

                <Dropdown
                  options={lgas}
                  optionLabel="name"
                  filter
                  showClear
                  filterBy="name"
                  icon="pi pi-plus"
                  id="lga"
                  name="lga"
                  {...register("lga", { required: 'lga is required' })}
                  value={lga}
                  onChange={handleChange}

                />
              </div>

              {/* <div className="p-field p-col-12 p-md-4 p-py-0 p-pl-2 p-pr-2" >
                <label htmlFor="postalCode" className="inputLabel p-pr-3">Postal Code *
                  {errors?.postalCode?.type === 'required' && <span className="text-danger font-weight-bold">&nbsp; {errors.postalCode.message}</span>}
                </label>
                <InputText
                  id="postalCode"
                  name="postalCode"
                  placeholder="Postal Code"
                  {...register("postalCode", { required: "Postal code is required" })}
                  onChange={handleChange}
                  value={postalCode}
                />
              </div> */}

              {/* <div className="p-field p-col-12 p-md-12">
                <label htmlFor="address" className="inputLabel">Address  <span className='text-danger'> *</span>
                  {errors?.address?.type === "required" && <span className="text-danger font-weight-bold">&nbsp; {errors.address.message}</span>}
                </label>
                <InputTextarea
                  id="address"
                  name="address"
                  type="text"
                  rows="2"
                  className="inputField"
                  placeholder="Address"
                  {...register("address", {
                    required: `Address is required`,
                  })}
                  value={address}
                  onChange={e => {
                    setContactInfo({ ...contactInfo, address: e.target.value });
                    setValue('address', e.target.value);
                  }}
                />
              </div> */}
              <div className="p-fluid p-md-12 p-sm-12">
                <div className="p-field">
                  <label htmlFor="location">Address <span className='text-danger'>*</span></label>
                  <PlacesAutocomplete
                    value={location}
                    onChange={setLocation}
                    onSelect={handleSelectAddress}
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
            </span>
            <div>
            </div>
            <ModeFooter id="contactInfoEdit" loading={loading} onCancel={closeEditMode} />
          </form>
        </div>
      </div>
    </>);
}

export default ContactInfoForm;