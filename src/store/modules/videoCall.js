import agent from "../../services/agent.service";
import { MESSAGE_TYPE } from "../constant";
import { showMessage } from "./notification";

// initial values
const socketId = {
  socketId: "",
  loading: false,
  submitting: false,
  requesting: false,
};

// Action types
const SAVE_SOCKET_ID = "SAVE_SOCKET_ID";

// Reducer
export default function reducer(state = socketId, action = {}) {
  switch (action.type) {
    case SAVE_SOCKET_ID:
      return {
        ...state,
        socketId: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}

// Action Creators

export function socketIdSaved(data) {
  return {
    type: SAVE_SOCKET_ID,
    payload: data,
  };
}

// Actions

export function createSocketId(id) {
  return (dispatch) => {
    return agent.VideCall.saveSocketId(id).then(
      (response) => {
        dispatch(socketIdSaved(response));
        dispatch(
          showMessage({
            type: MESSAGE_TYPE.SUCCESS,
            title: "id saved",
            message: "id saved successfully",
          })
        );
      },
      (error) => {
        // handle error
        dispatch(showMessage({ type: "error", message: error }));
      }
    );
  };
}
