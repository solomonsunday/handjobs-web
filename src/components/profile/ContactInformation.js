import React from "react";
import SectionHeader from "./SectionHeader";
import { PROFILE } from "constants/profile";
import "./UserProfile.css";
import { Tag } from "primereact/tag";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { getSmsShortCode, verifyPhoneNumber } from "store/modules/account";


const ContactInformation = ({ openCreate, openEdit, profileInfo, isViewApplicant }) => {

  const isRequestLoading = useSelector(state => state.account.loading);
  const userVerificationCode = useSelector(state => state.account.userVerificationCode);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    mode: "onChange",
    reValidateMode: "onChange"
  });

  console.log({ userVerificationCode })
  console.log({ profileInfo })

  useEffect(() => {
    dispatch(getSmsShortCode());
  }, []);

  const handleVerifyNumber = () => {
    let data = {
      toNumbers: [
        profileInfo?.phoneNumber
      ],
      accountId: profileInfo?.id
    }
    dispatch(getSmsShortCode(data));
  }

  console.log({ profileInfo })
  const onSubmit = (code) => {
    let userResponse = code.code;
    dispatch(verifyPhoneNumber(userResponse));
    document.getElementById("closeModal")?.click();
  }

  return (
    <>
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
            {profileInfo?.phoneNumberVerified && <Tag className="ml-1" severity="success" value="Verified" rounded></Tag>}
            {!profileInfo?.phoneNumberVerified && <b className="text-warning p-ml-2" style={{ cursor: "pointer" }} data-bs-toggle="modal" data-bs-target="#verifyModal" onClick={handleVerifyNumber}>Verify</b>}
          </span><br />
          <span>
            <b>Email: </b>
            {profileInfo.email}
          </span><br />
          <span>
            <b>Location: </b>
            {profileInfo.address}
          </span>
        </div>
      </div>

      {/* <!--Phone Number Verification Modal --> */}
      <div className="modal fade" id="verifyModal" tabIndex="-1" aria-labelledby="verifyModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Verify Phone Number</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h6 className="p-mb-2">Enter the code that was sent to your phone number.</h6>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                  <div className="p-field">
                    <label htmlFor="code" className="">
                      {errors.code && <span className="text-danger font-weight-bold "><p>{errors.code.message}</p>
                      </span>}
                    </label>
                    <InputText type="text"
                      placeholder="Enter verification code"
                      {...register("code", { required: "Verification code is required" })}
                      name="code"
                    />
                  </div>
                </div>
                <div className="float-right">
                  <button type="button" id="closeModal" className="btn btn-secondary py-2 rounded-pill mr-2" data-bs-dismiss="modal">Close</button>
                  <Button type="submit" label={`${isRequestLoading ? "Verifying..." : "Submit"}`} className="appcolor rounded-pill on-hover" />
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
