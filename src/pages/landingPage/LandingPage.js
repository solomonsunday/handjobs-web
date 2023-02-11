import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import {
  getServicesByServiceGroupId,
  loadServiceGroups,
  loadServicesById,
} from "store/modules/service";
import { Button } from "primereact/button";
import { BsSortAlphaDown } from "react-icons/bs";
import LandingHeader from "components/LandingHeader/LandingHeader";

const LandingPage = () => {
  const dispatch = useDispatch();

  const servicesbyGroupID = useSelector(
    (state) => state.service?.servicesById
  ).data;
  const serviceGroups = useSelector(
    (state) => state.service.servicesGroup
  ).data;

  const busy = useSelector((state) => state.service?.busy);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ mode: "onChange", reValidateMode: "onChange" });

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (servicesbyGroupID) {
      setServices(servicesbyGroupID);
    }
  }, [servicesbyGroupID]);

  useEffect(() => {
    dispatch(loadServiceGroups());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroup) {
      let groupID = selectedGroup?.id;
      console.log({ groupID });
      dispatch(loadServicesById(groupID));
    }
  }, [selectedGroup]);

  const handleServiceType = (e) => {
    const { name, value } = e.target;
    setSelectedCategory(e.value);
    setValue(name, value, { shouldValidate: true });
  };

  const handleServiceGroupChange = (e) => {
    const { name, value } = e.target;
    console.log("val", name);
    setSelectedGroup(e.value);
    setValue(name, value, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    let serviceName = data.service.name;
    // return console.log(serviceName, "serviceName");
    dispatch(
      getServicesByServiceGroupId(page, limit, search, sort, serviceName)
    );
  };

  return (
    <>
      <LandingHeader />
      <section className="hero-area style2">
        <div className="hero-inner">
          <div className="home-slider">
            <div className="single-slider">
              <div className="container">
                <div className="row ">
                  <div className="col-lg-6 co-12">
                    <div className="inner-content">
                      <div className="hero-text">
                        <h1 className="wow fadeInUp prim" data-wow-delay=".3s">
                          Join our community of Artisan-Job seekers
                          <br /> and connect to the right vendor for yourself
                        </h1>
                        <p className="wow fadeInUp" data-wow-delay=".5s">
                          Connect with skilled craft workers instantly at your
                          service with ease. Showcase your creativity with the
                          world and gain more work exposure.
                        </p>
                        <div
                          className="button wow fadeInUp"
                          data-wow-delay=".7s"
                        >
                          <Link to="/login" className="btn">
                            Request for an Instant Service
                          </Link>
                          {/* <Link to="#" className="btn btn-alt green-back">See latest  all hires</Link> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 co-12">
                    <div
                      className="hero-image wow fadeInRight"
                      data-wow-delay=".4s"
                    >
                      <img src="assets/images/hero/handyman.png" alt="#" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="single-slider">
              <div className="container">
                <div className="row ">
                  <div className="col-lg-6 co-12">
                    <div className="inner-content">
                      <div className="hero-text">
                        <h1 className="wow fadeInUp" data-wow-delay=".3s">
                          Find Your Career
                          <br />
                          to Make a Better Life
                        </h1>
                        <p className="wow fadeInUp" data-wow-delay=".5s">
                          Connect with skilled craft workers instantly at your
                          service with ease. Showcase your creativity with the
                          world and gain more work exposure.
                        </p>
                        <div
                          className="button wow fadeInUp"
                          data-wow-delay=".7s"
                        >
                          <Link to="/login" className="btn">
                            Request for an Instant Service
                          </Link>
                          {/* <Link to="#" className="btn btn-alt">See latest  all hires</Link> */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 co-12">
                    <div
                      className="hero-image wow fadeInRight"
                      data-wow-delay=".ss"
                    >
                      <img src="assets/images/hero/job-searcher.jpg" alt="#" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="apply-process section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12">
              <div className="process-item">
                <i className="lni lni-cog"></i>
                <h4>Artisan Job-Seekers</h4>
                <p>
                  Set up ypur profile in minutes and make yourself available by
                  those that requires your services.
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="process-item">
                <i className="lni lni-fireworks"></i>
                <h4>Instant Applicant Hire</h4>
                <p>
                  Find hand-workers near you by either searching for them or
                  create a service for them to apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-area style3 bg-white">
        <div className="hero-inner">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 co-12">
                <div className="inner-content">
                  <div className="hero-text">
                    <h1 className="wow fadeInUp" data-wow-delay=".3s">
                      Find the Most Exciting
                      <br />
                      Artisan Jobs to Make a Better Life
                    </h1>
                    <p className="wow fadeInUp" data-wow-delay=".5s">
                      Creating a beautiful job website is not easy always. To
                      make
                      <br />
                      your life easier, we are introducing Jobcamp template,
                      <br />
                      Leverage agile frameworks to provide a robust
                      <br />
                      synopsis for high level overviews.
                    </p>
                    <div className="button wow fadeInUp" data-wow-delay=".7s">
                      <Link to="/login" className="btn">
                        Request for an Instant Service
                      </Link>
                      {/* <Link to="#" className="btn btn-alt">See latest  all hires</Link> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 offset-lg-0 col-md-8 offset-md-2 co-12">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="home-search wow fadeInRight"
                  data-wow-delay=".5s"
                >
                  <div className="form-group select-border">
                    <label className="font-weight-bold text-dark">
                      Choose Category?
                    </label>
                    <div className="p-fluid p-md-12 p-sm-12">
                      <div className="p-field">
                        <Dropdown
                          options={serviceGroups}
                          optionLabel="name"
                          filter
                          showClear
                          filterBy="name"
                          icon="pi pi-plus"
                          id="serviceGroup"
                          name="serviceGroup"
                          value={selectedGroup}
                          {...register("serviceGroup", {
                            required: ` Please Select a service Group`,
                          })}
                          onChange={handleServiceGroupChange}
                        />
                        {errors.service && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.service.message}</p>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold text-dark">
                      Service Type?
                    </label>
                    <div className="p-fluid p-md-12 p-sm-12">
                      <div className="p-field">
                        {/* {services &&
                          services > 0 &&
                          services.map((service, id) => {
                            <select key={id}>
                              <option value={service.id}>{service.name}</option>
                            </select>;
                          })} */}
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
                          onChange={handleServiceType}
                        />

                        {errors.service && (
                          <span className="text-danger font-weight-bold ">
                            {" "}
                            <p>{errors.service.message}</p>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* <div className="form-group">
                    <label className="font-weight-bold text-dark">Where?</label>
                    <div className="form-location">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Where..."
                      />
                    </div>
                  </div> */}

                  <div className="max-weight">
                    <Button
                      icon="pi pi-check"
                      iconPos="left"
                      label={busy ? "Searching..." : "Search"}
                      id="saveButton"
                      disabled={busy}
                      type="submit"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="call-action overlay section">
        <div className="container">
          <div className="row ">
            <div className="col-lg-8 offset-lg-2 col-12">
              <div className="inner">
                <div className="section-title">
                  <span className="wow fadeInDown" data-wow-delay=".2s">
                    GETTING STARTED TO WORK
                  </span>
                  <h2 className="wow fadeInUp" data-wow-delay=".4s">
                    Don’t just find. Be found. Sign up and update your portfolio
                    with your works
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".6s">
                    It helps you to increase your chances of getting a suitable
                    HandJobs and let instant service seeker contact you for your
                    service.
                  </p>
                  <div className="button wow fadeInUp" data-wow-delay=".8s">
                    <Link to="/register" className="btn">
                      {/* <i className="lni lni-upload"></i> */}
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <div className="client-logo-section">
                <div className="container">
                    <div className="client-logo-wrapper">
                        <div className="client-logo-carousel d-flex align-items-center justify-content-between">
                            <div className="client-logo">
                                <img src="assets/images/clients/client1.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client2.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client3.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client4.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client5.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client6.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client2.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client3.png" alt="#" />
                            </div>
                            <div className="client-logo">
                                <img src="assets/images/clients/client4.png" alt="#" />
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

      <div
        className="modal fade form-modal"
        id="login"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog max-width-px-840 position-relative">
          <button
            type="button"
            className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
            data-dismiss="modal"
          >
            <i className="lni lni-close"></i>
          </button>
          <div className="login-modal-main">
            <div className="row no-gutters">
              <div className="col-12">
                <div className="row">
                  <div className="heading">
                    <h3>Login From Here</h3>
                    <p>
                      Log in to continue your account
                      <br />
                      and explore new jobs.
                    </p>
                  </div>
                  <div className="social-login">
                    <ul>
                      <li>
                        <Link className="linkedin" to="#">
                          <i className="lni lni-linkedin-original"></i>Log in
                          with LinkedIn
                        </Link>
                      </li>
                      <li>
                        <Link className="google" to="#">
                          <i className="lni lni-google"></i>Log in with Google
                        </Link>
                      </li>
                      <li>
                        <Link className="facebook" to="#">
                          <i className="lni lni-facebook-original"></i>Log in
                          with Facebook
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="or-devider">
                    <span>Or</span>
                  </div>
                  <form action="https://demo.graygrids.com/">
                    <div className="form-group">
                      <label htmlFor="email" className="label">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="example@gmail.com"
                        id="email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="label">
                        Password
                      </label>
                      <div className="position-relative">
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Enter password"
                        />
                      </div>
                    </div>
                    <div className="form-group d-flex flex-wrap justify-content-between">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Remember password
                        </label>
                      </div>
                      <Link
                        to="#"
                        className="font-size-3 text-dodger line-height-reset"
                      >
                        Forget Password
                      </Link>
                    </div>
                    <div className="form-group mb-8 button">
                      <button className="btn ">Log in</button>
                    </div>
                    <p className="text-center create-new-account">
                      Don’t have an account?
                      <Link to="#">Create a free account</Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade form-modal"
        id="signup"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog max-width-px-840 position-relative">
          <button
            type="button"
            className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
            data-dismiss="modal"
          >
            <i className="lni lni-close"></i>
          </button>
          <div className="login-modal-main">
            <div className="row no-gutters">
              <div className="col-12">
                <div className="row">
                  <div className="heading">
                    <h3>
                      Create a free Account
                      <br />
                      Today
                    </h3>
                    <p>
                      Create your account to continue
                      <br />
                      and explore new jobs.
                    </p>
                  </div>
                  <div className="social-login">
                    <ul>
                      <li>
                        <Link className="linkedin" to="#">
                          <i className="lni lni-linkedin-original"></i>Import
                          from LinkedIn
                        </Link>
                      </li>
                      <li>
                        <Link className="google" to="#">
                          <i className="lni lni-google"></i>Import from Google
                        </Link>
                      </li>
                      <li>
                        <Link className="facebook" to="#">
                          <i className="lni lni-facebook-original"></i>Import
                          from Facebook
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="or-devider">
                    <span>Or</span>
                  </div>
                  <form action="https://demo.graygrids.com/">
                    <div className="form-group">
                      <label htmlFor="email" className="label">
                        E-mail
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="example@gmail.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="label">
                        Password
                      </label>
                      <div className="position-relative">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter password"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="label">
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Enter password"
                        />
                      </div>
                    </div>
                    <div className="form-group d-flex flex-wrap justify-content-between">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          Agree to the
                          <Link to="#">Terms & Conditions</Link>
                        </label>
                      </div>
                    </div>
                    <div className="form-group mb-8 button">
                      <button className="btn ">Sign Up</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer apply-process">
        <div className="footer-top apply-process">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-6 col-12">
                <div className="download-text text-white">
                  <h3 className="text-white">Download HandJobs Now</h3>
                  <p>
                    Showcase your crafts and connect with <br />
                    people in need of your services.
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="download-button">
                  <div className="button">
                    <Link className="btn bg-white text-dark" to="#">
                      <i className="lni lni-apple"></i>
                      App Store
                    </Link>
                    <Link className="btn bg-white text-dark" to="#">
                      <i className="lni lni-play-store"></i>
                      Google Play
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                <div className="f-about single-footer">
                  <div className="logo">
                    <Link className="navbar-brand logo" to="index.html">
                      {/* <img className="logo1" src="assets/images/logo/applogo.jpeg" height="40px" alt="Logo" /> */}
                      <h2
                        className="app-pri-text-color"
                        style={{ fontFamily: "cursive" }}
                      >
                        HandJobs
                      </h2>
                    </Link>
                  </div>

                  <p>Start connecting with people who need your services.</p>
                  <ul className="contact-address">
                    <li>
                      <span>Address:</span>
                      Ikeja, Lagos
                    </li>
                    <li>
                      <span>Email:</span>
                      <Link
                        to="https://demo.graygrids.com/cdn-cgi/l/email-protection"
                        className="__cf_email__"
                        data-cfemail="b7d2cfd6dac7dbd2f7d6c7c2c499d4d8da"
                      >
                        [email&#160;protected]
                      </Link>
                    </li>
                    <li>
                      <span>Call:</span>
                      555-555-1234
                    </li>
                  </ul>
                  <div className="footer-social">
                    <ul>
                      <li>
                        <Link to="#">
                          <i className="lni lni-facebook-original"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="lni lni-twitter-original"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="lni lni-linkedin-original"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="lni lni-pinterest"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-12">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="single-footer f-link">
                      <h3>For Artisans</h3>
                      <ul>
                        <li>
                          <Link to="#">User Dashboard</Link>
                        </li>
                        <li>
                          <Link to="#">Jobs Featured</Link>
                        </li>
                        <li>
                          <Link to="#">Jobs Urgent</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="single-footer f-link">
                      <h3>For Instant Service Seekers</h3>
                      <ul>
                        <li>
                          <Link to="#">Post New</Link>
                        </li>
                        <li>
                          <Link to="#">Jobs Listing</Link>
                        </li>
                        <li>
                          <Link to="#">Jobs Featured</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="single-footer newsletter">
                      <h3>Join Our Newsletter</h3>
                      <p>
                        Subscribe to get the latest jobs posted, candidates...
                      </p>
                      <form target="_blank" className="newsletter-inner">
                        <input
                          name="EMAIL"
                          placeholder="Your email address"
                          className="common-input"
                          required=""
                          type="email"
                        />
                        <div className="button">
                          <button className="btn">
                            Subscribe Now!
                            <span className="dir-part"></span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <div className="inner">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="left">
                    <p>
                      Designed and Developed by
                      <Link to="#" rel="nofollow" target="_blank">
                        RightClicks
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="right">
                    <ul>
                      <li>
                        <Link to="#">Terms of use</Link>
                      </li>
                      <li>
                        <Link to="#">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link to="#">Faq</Link>
                      </li>
                      <li>
                        <Link to="#">Contact</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
