import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { saveNotificationSetting, loadNotificationSetting } from 'store/modules/notificationSettings';

export default function NotificationSettings() {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        mode: "onChange",
        reValidateMode: "onChange"
    });

    const [sms, setSms] = useState(false);
    const [email, setEmail] = useState(false);
    const [hotDeals, setHotDeals] = useState(false);

    const dispatch = useDispatch();
    const getsettings = useSelector(state => state.notificationSettings.settings);
    const loading = useSelector(state => state.notificationSettings.loading);
    const settings = getsettings?.data

    useEffect(() => {
        dispatch(loadNotificationSetting());
    }, [])

    useEffect(() => {
        if (getsettings) {
            setSms(getsettings?.data?.allowSms);
            setEmail(getsettings?.data?.allowEmail);
            setHotDeals(getsettings?.data?.allowHotDeals)
        }
    }, [getsettings]);
    console.log("notificationSet", settings)

    // const [settings, setSettings] = useState();

    // const handleOnChange = async (e) => {
    //     const { name, value, checked } = e.target

    //     setSettings({
    //         ...settings,
    //         [name]: value === 'on' ? checked : value ?? JSON.parse(value),

    //     })
    // }

    const onSubmit = (data) => {
        data.allowSms = sms;
        data.allowEmail = email;
        data.allowHotDeals = hotDeals;
        console.log(data, "create Data");
        dispatch(saveNotificationSetting(data));

    }

    return <>
        <div className="p-col-11 p-mt-2 p-mx-auto">
            <div className="p-card rounded p-m-5">
                <div className="card-body">
                    <h5 className='text-center mb-5'>NOTIFICATION SETTINGS</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="row p-mb-5 justify-content-center">
                        <div className="form-group col-md-3">
                            <label className="font-weight-bold" htmlFor="recieveSMS">Recieve SMS</label>
                            <div className="custom-control custom-switch">
                                <InputSwitch checked={sms} onChange={(e) => setSms(e.value)} />
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="font-weight-bold" htmlFor="recieveEmail">Recieve Email</label>
                            <div className="custom-control custom-switch">
                                <InputSwitch checked={email} onChange={(e) => setEmail(e.value)} />
                            </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="font-weight-bold" htmlFor="hotdeals">Get Hot Deals</label>
                            <div className="custom-control custom-switch">
                                <InputSwitch checked={hotDeals} onChange={(e) => setHotDeals(e.value)} />
                            </div>
                        </div>
                        <div className="p-mt-5">
                            <Button icon="pi pi-check"
                                iconPos="left"
                                label={"Submit"}
                                disabled={loading}
                                type="submit"
                                className="float-right rounded-pill" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
}
