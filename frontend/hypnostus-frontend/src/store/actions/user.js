import { callApi } from "./api";

export const USER_LOGGED_IN = "USER_LOGGED_IN"
export const USER_LOGGED_OUT = "USER_LOGGED_OUT"

export const login = (creds={}) => async (dispatch, getState) => {
    // call api 
    let response = null
    // check if localstorage is empty and creds isn't empty
    if (!localStorage.getItem("user") && !(Object.keys(creds).length === 0 && creds.constructor === Object)){
        response = await callApi({
            method: "post",
            endpoint: "login/",
            data: {
                username: creds.username,
                password: creds.password
            }
       }) (dispatch, getState)

    } else {
        // get the token 
        response = JSON.parse(localStorage.getItem("user"))
    }
    // dispatch  
    if (response) {
        // store the token 
        localStorage.setItem("user", JSON.stringify(response))
        dispatch({
            type: USER_LOGGED_IN,
            payload: {
                ...response
            }
        })
    }
}


export const register = (creds={}) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "register/",
        data: {
            username: creds.username,
            password: creds.password
        },
    }) (dispatch, getState)
    
    
    // dispatch 
    if (response){ 
        // store the token 
        localStorage.setItem("user", JSON.stringify(response))
        dispatch({
            type: USER_LOGGED_IN,
            payload: {
                ...response
            }
        })
    }
}

export const logout = () => async (dispatch) => {
    localStorage.removeItem("user")
    dispatch({
        type: USER_LOGGED_OUT
    })

}