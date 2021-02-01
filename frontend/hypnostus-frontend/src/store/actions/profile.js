import { callApi } from "./api";

export const CURRENT_PROFILE_LOADED = "CURRENT_PROFILE_LOADED"
export const ACTIVE_PROFILE_LOADED = "ACTIVE_PROFILE_LOADED"
export const PROFILE_FOLLOWED = "PROFILE_FOLLOWED" 
export const PROFILE_UNFOLLOWED = "PROFILE_UNFOLLOWED" 

export const get_profile = (data, current=false) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "GET",
        endpoint: "profile/",
        params: {
            username: data.username
        }
    }) (dispatch, getState)
    // dispatch 
    if (response) {
        if (current){
            dispatch({
                type: CURRENT_PROFILE_LOADED,
                payload: response
            })
        } else {
            dispatch({
                type: ACTIVE_PROFILE_LOADED,
                payload: response
            })
        }

        // console.log(response)
        // if (response.username === data.username){
        //     // the visited profile is the user's
                        
        //     // dispatch({
        //     //     type: ACTIVE_PROFILE_LOADED,
        //     //     payload: response
        //     // })
        // } else {
            
        // }
    }
}

export const follow = (data) => async (dispatch, getState) => {
    // call api 
    console.log(data)
    const response = await callApi({
        method: "POST",
        endpoint: "follow/",
        data: {
            username: data.username
        }
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        // response > {"follower": <obj>, "following": <obj>}
        dispatch({
            type: CURRENT_PROFILE_LOADED,
            payload: response.follower
        })
        dispatch({
            type: ACTIVE_PROFILE_LOADED,
            payload: response.following
        })
    }
}