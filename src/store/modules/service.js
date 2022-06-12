import { showMessage } from "./notification";
import agent from "../../services/agent.service";
import { MESSAGE_TYPE } from "../constant";
import { closeModal } from "./modal";

// initial values
const initialState = {
  name: "",
  description: "",
  updatedOrDeleted: false,
  loading: false,
  service: null,
  services: [],
  servicesById: [],
  servicesGroup: [],
};

// Action types
const UPDATE_USER_SERVICE = "app/service/UPDATE_USER_SERVICE ";
const LOAD_SERVICE_GROUP = "app/service/UPDATE_SERVICE_GROUP";
const LOAD_USER_SERVICE = "app/service/LOAD_USER_SERVICE";
const LOAD_SERVICES_BY_ID = "LOAD_SERVICE_BY_ID";
const DELETE_USER_SERVICE = "DELETE_USER_SERVICE";
const LOADING = "LOADING";
const USER_SERVICE_ERROR = "USER_SERVICE_ERROR";
const GET_SERVICES = "app/services/GET_SERVICES";

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_USER_SERVICE:
      return {
        ...state,
        service: action.payload,
        updatedOrDeleted: true,
      };
    case LOAD_SERVICES_BY_ID:
      return {
        ...state,
        servicesById: action.payload,
      };
    case LOAD_SERVICE_GROUP:
      return {
        ...state,
        servicesGroup: action.payload,
      };
    case LOAD_USER_SERVICE:
      return {
        ...state,
        service: action?.payload?.data,
      };
    case GET_SERVICES:
      return {
        ...state,
        services: action?.payload?.data,
      };
    case DELETE_USER_SERVICE:
      return {
        ...state,
        updatedOrDeleted: true,
        loading: false,
      };
    case LOADING:
      return {
        ...state,
        updatedOrDeleted: false,
        loading: true,
      };
    case USER_SERVICE_ERROR:
      return {
        ...state,
        updatedOrDeleted: false,
        loading: false,
      };
    default:
      return state;
  }
}

// Action Creators
export function loading() {
  return { type: LOADING };
}
export function serviceLoaded(data) {
  return { type: LOAD_USER_SERVICE, payload: data };
}
export function serviceGroupsLoaded(data) {
  return { type: LOAD_SERVICE_GROUP, payload: data };
}
export function actionGetServices(payload) {
  return { type: GET_SERVICES, payload };
}

export function actionCreateService(data) {
  return { type: UPDATE_USER_SERVICE, payload: data };
}

export function servicesById(data) {
  return { type: LOAD_SERVICES_BY_ID, payload: data };
}
export function actionDeleteService() {
  return { type: DELETE_USER_SERVICE };
}
export function serviceError() {
  return { type: USER_SERVICE_ERROR };
}

// Actions
export function loadServices() {
  return (dispatch) => {
    return agent.Service.load().then((response) => {
      dispatch(serviceLoaded(response));
    });
  };
}
export function loadServiceGroups() {
  return (dispatch) => {
    return agent.Service.loadServiceGroup().then((response) => {
      dispatch(serviceGroupsLoaded(response));
    });
  };
}

export function getServices() {
  return (dispatch) => {
    return agent.Service.get().then((response) => {
      dispatch(actionGetServices(response));
    });
  };
}

export function createService(service) {
  return (dispatch) => {
    dispatch(loading());
    return agent.Account.updateServices(service).then(
      (response) => {
        dispatch(actionCreateService(response));
        dispatch(closeModal());
        dispatch(
          showMessage({
            type: MESSAGE_TYPE.SUCCESS,
            title: "Update Profile Information",
            message: "Service created successfully",
          })
        );
      },
      (error) => {
        // handle error
        dispatch(showMessage({ type: "error", message: error }));
        dispatch(serviceError());
      }
    );
  };
}

export const loadServicesById = (id) => (dispatch) => {
  dispatch(loading(true));
  return agent.Service.loadbyid(id).then(
    (response) => {
      dispatch(servicesById(response));
      dispatch(loading(false));
    },
    (error) => {
      // handle error
      dispatch(loading(true));
      dispatch(showMessage({ type: "error", message: error }));
      dispatch(loading(false));
    }
  );
};

export function deleteService(id) {
  return (dispatch) => {
    dispatch(loading());
    return agent.Service.delete(id).then(
      (response) => {
        dispatch(actionDeleteService(response));
        dispatch(
          showMessage({
            type: MESSAGE_TYPE.SUCCESS,
            title: "Deleted Profile Information",
            message: "Service deleted successfully",
          })
        );
      },
      (error) => {
        // handle error
        dispatch(showMessage({ type: "error", message: error }));
        dispatch(serviceError());
      }
    );
  };
}

// export function updateContactInfo(data) {
//     return dispatch => {
//         return agent.Account.updateContactInfo(data).then(response => {
//             dispatch(profileInfoLoaded(response));
//             dispatch(closeModal());
//             dispatch(showMessage({ type: MESSAGE_TYPE.SUCCESS, title: "Update Profile Information", message: ("Contact information updated successfully") }));
//         },
//             error => { // handle error
//                 dispatch(showMessage({ type: "error", message: error }));
//             }
//         );
//     }
// }

// export function updateUserHobies(hobbies) {
//     return dispatch => {
//         return agent.Account.updateHobies(hobbies).then(response => {
//             dispatch(profileInfoLoaded(response));
//             dispatch(closeModal());
//             dispatch(showMessage({ type: MESSAGE_TYPE.SUCCESS, title: "Update Profile Information", message: ("Hobbies updated successfully") }));
//         },
//             error => { // handle error
//                 dispatch(showMessage({ type: "error", message: error }));
//             }
//         );
//     }
// }

// export function updateProfilePicture(image) {
//     return dispatch => {
//         return agent.Account.updateProfilePicture(image).then(response => { // handle success
//             dispatch(showMessage({ type: MESSAGE_TYPE.SUCCESS, message: ("Profile image successfully updated") }));
//         }, error => { // handle error
//             dispatch(showMessage({ type: "error", message: error }));
//         });
//     }
// }

// export function loadAccountByUser(id) {
//     return dispatch => {
//         return agent.Account.getByID(id).then(response => { // handle success
//             // dispatch(LoadProfileDataByUser(response))

//         }, error => { // handle error
//             dispatch(showMessage({ type: "error", message: error }));
//         });
//     }
// }
