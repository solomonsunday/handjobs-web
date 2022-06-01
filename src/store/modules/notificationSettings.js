import { showMessage } from "./notification";
import { push } from "connected-react-router";
import agent from "../../services/agent.service";
import { MESSAGE_TYPE } from "store/constant";

// initial values
const notificationSettings = {
    settings: {},
    loading: false,
    error: false,
};

// Action types
const SAVE_SETTING = "app/notification/SAVE_SETTING";
const LOAD_SETTING = "app/notification/LOAD_SETTING";
const LOADING = "LOADING";
const ERROR = "ERROR";

// Reducer
export default function reducer(state = notificationSettings, action = {}) {
    switch (action.type) {
        case ERROR:
            return {
                ...state,
                error: action.payload,
            };
        case SAVE_SETTING:
            return {
                ...state,
                error: null,
                fetching: false,
                settings: action.payload,
            };
        case LOAD_SETTING:
            return {
                ...state,
                error: null,
                fetching: false,
                settings: action.payload,
            };
        case LOADING:
            return {
                ...state,
                loading: action.payload,
                error: null,
            };
        default:
            return state;
    }
}

// Action Creators
export function onSaveNotificationSetting(data) {
    return {
        type: SAVE_SETTING,
        payload: data,
    };
}
export function onLoadNotificationSetting(data) {
    return {
        type: LOAD_SETTING,
        payload: data,
    };
}

export function isRequestLoading(data) {
    return {
        type: LOADING,
        payload: data,
    };
}

export function isError(data) {
    return {
        type: ERROR,
        payload: data,
    };
}

// Actions
export function saveNotificationSetting(settings) {
    return (dispatch) => {
        dispatch(isRequestLoading(true));
        return agent.NotificationSettings.save(settings).then(
            (response) => {
                dispatch(isRequestLoading(false));
                // handle success
                dispatch(
                    showMessage({
                        type: MESSAGE_TYPE.SUCCESS,
                        message: "Notification settings",
                        title: "Notification settings saved successfully",
                    })
                );
                dispatch(push("/posts"));
            },
            (error) => {
                // handle error
                dispatch(
                    showMessage({
                        type: "error",
                        message: error,
                        title: "Notification settings not saved successfully",
                    })
                );
                dispatch(isRequestLoading(false));
            }
        );
    };
}

export function loadNotificationSetting() {
    return (dispatch) => {
        return agent.NotificationSettings.get().then(
            (response) => {
                //handle success
                dispatch(onLoadNotificationSetting(response));
            },
            (error) => {
                dispatch(
                    showMessage({
                        type: "error",
                        message: error,
                        title: "Failed to load Notification settings",
                    })
                );
            }
        );
    };
}

