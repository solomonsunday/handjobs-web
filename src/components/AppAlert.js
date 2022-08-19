import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import './AppAlert.css';
import { messageCleared } from 'store/modules/notification';


const AppAlertWidget = ({ notification }) => {
    const toast = useRef(null);

    console.log('NOTIFICATION WIDGET')
    return (
        <div>
            <Toast ref={toast} />
            {notification.type === 'success' && toast.current.show({ severity: 'success', summary: notification.title, detail: notification.message, life: 5000 })}
            {notification.type === 'error' && toast.current.show({ severity: 'error', summary: notification.title, detail: notification.message, life: 5000 })}
            {notification.type === 'info' && toast.current.show({ severity: 'info', summary: notification.title, detail: notification.message, life: 5000 })}
            {notification.type === 'warning' && toast.current.show({ severity: 'warn', summary: notification.title, detail: notification.message, life: 5000 })}
        </div>
    );
}

const isEqual = (prevProps, nextProps) => {
    if (prevProps.type === nextProps && prevProps.title === nextProps.title) {
        return true;//this should not re-render
    }
    return false;// this will cause ti to re-render

}

export default React.memo(AppAlertWidget, isEqual);