import { PROFILE } from "constants/profile";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getSmsShortCode, verifyPhoneNumber } from "store/modules/account";
import { loadContacts } from "store/modules/contact";
import agent from "../../services/agent.service";
import SectionHeader from "./SectionHeader";
import "./UserProfile.css";

const ContactInformation = ({
  openCreate,
  openEdit,
  profileInfo,
  isViewApplicant,
  isApplicantAccepted,
}) => {
  const isRequestLoading = useSelector((state) => state.account.loading);
  const [isConnected, setIsConnected] = useState(false);
  const loggedInUserID = agent?.Auth?.current().id;
  const contacts = useSelector((state) => state.contact.contacts);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    dispatch(loadContacts(1, 10, "loadingContacts"));
  }, [dispatch]);

  useEffect(() => {
    if (loggedInUserID === profileInfo?.id) return;
    if (contacts) {
      const isContact = contacts?.ids?.find((a) => a === profileInfo?.id);
      if (isContact) {
        setIsConnected(() => true);
      } else {
        setIsConnected(() => false);
      }
    }
  }, [contacts]);

  const handleVerifyNumber = () => {
    let data = {
      toNumbers: [profileInfo?.phoneNumber],
      accountId: profileInfo?.id,
    };
    dispatch(getSmsShortCode(data));
  };

  const onSubmit = (code) => {
    document.getElementById("closeModal")?.click();
    let userResponse = code.code;
    dispatch(verifyPhoneNumber(userResponse));
  };

  return (
    <>
      {(loggedInUserID === profileInfo?.id ||
        isConnected ||
        (isApplicantAccepted && isApplicantAccepted === "true")) && (
        <div className="p-card p-mt-2" style={{ borderRadius: "1rem" }}>
          <SectionHeader
            icon="phone"
            sectionTitle="Contact Information"
            id="contactInfoEdit"
            showAddButton="true"
            showEditButton="true"
            openModalOnCreate={() => openEdit(PROFILE.CONTACT_INFO)}
            openModalOnEdit={() => openCreate(PROFILE.CONTACT_INFO)}
            hasData={profileInfo?.profile}
            isViewApplicant={isViewApplicant}
          />
          <div className="p-card-body p-text-secondary">
            <span>
              <b>Phone Number:</b>&nbsp;
              {profileInfo.contactPhoneNumber}&nbsp;
              {profileInfo?.phoneNumberVerified && (
                <Tag
                  className="ml-1"
                  severity="success"
                  value="Verified"
                  rounded
                ></Tag>
              )}
              {profileInfo.phoneNumber &&
              !profileInfo?.phoneNumberVerified &&
              loggedInUserID === profileInfo?.id ? (
                <span
                  className="text-warning p-ml-2 font-weight-bolder"
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="modal"
                  data-bs-target="#verifyModal"
                  onClick={() => handleVerifyNumber()}
                >
                  Verify
                </span>
              ) : profileInfo.phoneNumber &&
                !profileInfo?.phoneNumberVerified ? (
                <span className="text-warning p-ml-2 font-weight-bolder">
                  <Tag severity="danger" value="Not verified" rounded></Tag>
                </span>
              ) : (
                ""
              )}
            </span>
            <br />
            <span>
              <b>Email: </b>
              {profileInfo.email}
            </span>
            <br />
            <span>
              <b>Location: </b>
              {profileInfo.address}
            </span>
          </div>
        </div>
      )}

      {/* <!--Phone Number Verification Modal --> */}
      <div
        className="modal fade"
        id="verifyModal"
        tabIndex="-1"
        aria-labelledby="verifyModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Verify Phone Number
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h6 className="p-mb-2">
                Enter the code that was sent to your phone number.
              </h6>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                  <div className="p-field">
                    <label htmlFor="code" className="">
                      {errors.code && (
                        <span className="text-danger font-weight-bold ">
                          <p>{errors.code.message}</p>
                        </span>
                      )}
                    </label>
                    <InputText
                      type="text"
                      placeholder="Enter verification code"
                      {...register("code", {
                        required: "Verification code is required",
                      })}
                      name="code"
                    />
                  </div>
                </div>
                <div className="float-right">
                  <button
                    type="button"
                    id="closeModal"
                    className="btn btn-secondary py-2 rounded-pill mr-2"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <Button
                    type="submit"
                    label={`${isRequestLoading ? "Verifying..." : "Submit"}`}
                    className="appcolor rounded-pill on-hover"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactInformation;
