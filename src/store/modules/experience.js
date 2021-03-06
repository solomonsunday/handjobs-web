import { push } from "connected-react-router";
import { showMessage } from "./notification";
import agent from "../../services/agent.service";
import { MESSAGE_TYPE } from "../constant";
import { loadLga, loadStates } from "./location";
import { closeModal } from "./modal";
import { deleteProfileExperience, loadProfileInfo, submitting } from "./account";

// initial values
const experience = {
  experience: {
    id: "",
    id: "",
    jobTitle: "",
    startDate: null,
    endDate: null,
    location: "",
    company: "",
    description: "",
    jobCategoryName: "",
    jobCategoryId: "",
  },
  loading: false,
  submitting: false,
  requesting: false,
  updatedOrDeleted: false,
};

// Action types
const UPDATE_PROFILE = "app/experience/UPDATE_PROFILE ";
const LOAD_EXPERIENCE = "app/experience/LOAD_EXPERIENCE";
const LOADING = "LOADING";
const SUBMITTING = "SUBMITTING";
const REQUESTING = "REQUESTING"
const LOADING_ERROR = "LOADING_ERROR";

// Reducer
export default function reducer(state = experience, action = {}) {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true, updatedOrDeleted: false };
    case SUBMITTING: 
      return {...state, submitting: true}
    
    case REQUESTING: 
      return { ...state, requesting: true }
    case LOAD_EXPERIENCE:
      return {
        ...state,
        experience: action.payload,
        loading: false,
        submitting: false,
        requesting: false,
        updatedOrDeleted: true,
      };
    case LOADING_ERROR:
      return {
        ...state,
        loading: false,
        submitting: false,
        requesting: false,
        updatedOrDeleted: false,
      };
    default:
      return state;
  }
}

// Action Creators
export function experienceLoaded(data) {
  return { type: LOAD_EXPERIENCE, payload: data };
}
export function loadError() {
  return {
    type: LOADING_ERROR,
  };
}

export function isLoading() {
  return { type: LOADING }
}
export function isSubmitting(){
  return {type: SUBMITTING}
}
export function isRequesting() {
  return { type: REQUESTING }
}
// Actions
export function loadExperience(id) {
  return (dispatch) => {
    return agent.JobExperience.view(id).then((response) => {
      dispatch(experienceLoaded(response));
    });
  };
}

export function createExperience(data) {
  return (dispatch) => {
    dispatch(isRequesting());
    return agent.JobExperience.save(data).then(
      (response) => {
        dispatch(experienceLoaded(response));
        dispatch(loadProfileInfo());
        dispatch(closeModal());
        dispatch(
          showMessage({
            type: MESSAGE_TYPE.SUCCESS,
            title: "Save Job Experience",
            message: "Job experience saved successfully",
          })
        );
      },
      (error) => {
        // handle error
        dispatch(loadError());
        dispatch(showMessage({ type: "error", message: error }));
      }
    );
  };
}

export function updateExperience(id, data) {
  return (dispatch) => {
    dispatch(isRequesting())
    return agent.JobExperience.edit(id, data).then(
      (response) => {
        dispatch(experienceLoaded(response));
        dispatch(closeModal());
        dispatch(
          showMessage({
            type: MESSAGE_TYPE.SUCCESS,
            title: "Save Job Experience",
            message: "Job experience saved successfully",
          })
        );
      },
      (error) => {
        // handle error
        dispatch(loadError());
        dispatch(showMessage({ type: "error", message: error }));
      }
    );
  };
}


