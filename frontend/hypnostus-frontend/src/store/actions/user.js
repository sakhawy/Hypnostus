import { callApi } from "./api";

export const USER_LOGGED_IN = "USER_LOGGED_IN"
export const USER_LOGGED_OUT = "USER_LOGGED_OUT"

export const login = (username, password) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "post",
        endpoint: "login/",
        data: {
            username: username,
            password: password
        }
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        dispatch({
            type: USER_LOGGED_IN,
            payload: {
                ...response
            }
        })
    }
}


export const register = (username, password) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "register/",
        data: {
            username: username,
            password: password
        },
    }) (dispatch, getState)
    // dispatch 
    if (response){ 
        dispatch({
            type: USER_LOGGED_IN,
            payload: {
                ...response
            }
        })
    }
}
