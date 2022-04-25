import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import '../Login.css'

const ChangePassword = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange",
        reValidateMode: "onChange"
    });
    const dispatch = useDispatch();

    return (
        <>
            <div className="p-fluid">
                <div className="p-grid p-m-6">
                    <div className="login-pane-right p-md-4 mx-auto" style={{ borderRadius: "2rem" }}>
                        <div className="brand-logo text-center">
                            {/* <img src="/assets/images/logo/applogo.jpeg" width="150" alt="brand-logo" /> */}
                            <h3 className='app-pri-text-color' style={{ fontFamily: "cursive" }}>HandJobs</h3>
                        </div>
                        <div className="">
                            <div className="">
                                <div className="">
                                    <form >
                                        <div className="p-fluid">
                                            <label htmlFor="password" className="">
                                                <span className="text-default font-weight-bold default-color p-my-1">New Password
                                                </span>
                                            </label>
                                            <div className="p-field">
                                                <Password
                                                    toggleMask
                                                    name="password"
                                                    placeholder="New Password"
                                                    feedback={false}
                                                    {...register("password", { required: "Please enter your password." })}

                                                />
                                                <label htmlFor="password" className="">
                                                    {errors?.password?.type === "required" && <span className="text-danger font-weight-bold p-mr-6 error-msg"> <p>{errors.password.message}</p>
                                                    </span>}
                                                </label>
                                            </div>
                                            <label htmlFor="password" className="">
                                                <span className="text-default font-weight-bold default-color p-my-1">Confirm New Password
                                                </span>
                                            </label>
                                            <div className="p-field">
                                                <Password
                                                    toggleMask
                                                    name="password"
                                                    placeholder="Confirm New Password"
                                                    feedback={false}
                                                    {...register("password", { required: "Please enter your password." })}

                                                />
                                                <label htmlFor="password" className="">
                                                    {errors?.password?.type === "required" && <span className="text-danger font-weight-bold p-mr-6 error-msg"> <p>{errors.password.message}</p>
                                                    </span>}
                                                </label>
                                            </div>

                                            <br />
                                            <Button
                                                label="Save"
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