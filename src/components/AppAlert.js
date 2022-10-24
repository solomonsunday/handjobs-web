<<<<<<< HEAD
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
=======
import React, { memo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
>>>>>>> origin/main
import { Toast } from 'primereact/toast';
import './AppAlert.css';
import { messageCleared } from 'store/modules/notification';


const AppAlertWidget = memo(({ notification }) => {
    const toast = useRef(null);
<<<<<<< HEAD
    const notification = useSelector(state => state.notification);

    // useEffect(() => {

    // }, [notification])   

=======
    console.log('NOTIFICATION IN APP aalert', notification)
>>>>>>> origin/main
    return (
        <div>
            <Toast ref={toast} />
            {notification.type === 'success' && toast.current.show({ severity: 'success', summary: notification.title, detail: notification.message, life: 5000 })}
            {notification.type === 'error' && toast.current.show({ severity: 'error', summary: notification.title, detail: notification.message, life: 5000 })}
            {notification.type === 'info' && toast.current.show({ severity: 'info', summary: notification.title, detail: notification.message, life: 5000 })}
            {notification.type === 'warning' && toast.current.show({ severity: 'warn', summary: notification.title, detail: notification.message, life: 5000 })}
        </div>
    );
})

export default AppAlertWidget