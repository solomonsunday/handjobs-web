import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import '../Login.css'
import { changePassword } from 'store/modules/auth';
import AppLoading from 'components/AppLoading';
import { Spinner } from 'react-bootstrap';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.auth.loading);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const newPassword = watch("newPassword", "");

    const onSubmit = (data) => {

        dispatch(changePassword(data));
    }

    return (
        <>
            <div className="p-fluid">
                <div className="p-grid p-m-6">
                    <div className="login-pane-right p-md-4 mx-auto" style={{ borderRadius: "2rem" }}>
                        <div className="brand-logo text-center">
                            <h3 className='app-pri-text-color' style={{ fontFamily: "cursive" }}>HandJobs</h3>
                        </div>
                        <div className="">
                            <div className="">
                                <div className="">
                                    <form onSubmit={handleSubmit(onSubmit)} >
                                        <div className="p-fluid">
                                            <label htmlFor="oldPassword" className="">
                                                <span className="text-default font-weight-bold default-color p-my-1">Old Password
                                                </span>
                                            </label>
                                            <div className="p-field">
                                                <Password
                                                    // toggleMask
                                                    type="string"
                                                    id="oldPassword"
                                                    name="oldPassword"
                                                    feedback={false}
                                                    {...register("oldPassword", { required: "Please enter your old password." })}

                                                />
                                                {errors?.oldPassword && <span className="text-danger font-weight-bold p-mr-6 error-msg"> <p>{errors.oldPassword.message}</p>
                                                </span>}
                                            </div>
                                            <label htmlFor="newPassword" className="">
                                                <span className="text-default font-weight-bold default-color p-my-1">New Password
                                                </span>
                                            </label>
                                            <div className="p-field">
                                                <InputText
                                                    // toggleMask
                                                    type="password"
                                                    id="newPassword"
                                                    name="newPassword"
                                                    feedback={false}
                                                    {...register("newPassword", {
                                                        required: "Please enter a  new password.",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must not be less than 8 characters"
                                                        }
                                                    })}

                                                />
                                                {errors?.newPassword && <span className="text-danger font-weight-bold p-mr-6 error-msg"> <p>{errors.newPassword.message}</p>
                                                </span>}
                                            </div>
                                            <label htmlFor="confirmPassword" className="">
                                                <span className="text-default font-weight-bold default-color p-my-1">Confirm New Password
                                                </span>
                                            </label>
                                            <div className="p-field">
                                                <InputText
                                                    type="password"
                                                    // toggleMask
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    feedback={false}
                                                    {...register("confirmPassword", {
                                                        required: "Please confirm your new password.",
                                                        validate: value => value === newPassword || "Passwords does not match"

                                                    })}

                                                />
                                                {errors?.confirmPassword && <span className="text-danger font-weight-bold p-mr-6 error-msg"> <p>{errors.confirmPassword.message}</p>
                                                </span>}
                                            </div>

                                            <br />
                                            <Spinner fontSize={20} />
                                            <Button
                                                label={!loading ? "Change Password" : "Updating Password ..."}
                                                type="submit"
                                                className="form-group rounded-pill on-hover"
                                            // loading={isRequestLoading}
                                            />

                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ChangePassword