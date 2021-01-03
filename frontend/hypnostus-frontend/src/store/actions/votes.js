import { callApi } from "./api"

export const VOTE_ADDED = "VOTE_ADDED"
export const VOTES_LOADED = "VOTES_LOADED"
export const VOTE_DELETED = "VOTE_DELETED"

export const vote = (data) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "story/vote/",
        data: {
            id: data.storyId,
            value: data.value
        }
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        if (response[data.storyId] !== 0){
            dispatch({
                type: VOTE_ADDED,
                payload: {
                    ...response
                }
            })
        }
        else {
            dispatch({
                type: VOTE_DELETED,
                payload: {
                    ...response
                }
            })
        }
    }
}

export const load_user_votes = () => async (dispatch, getState) => {
        // call api 
        const response = await callApi({
            method: "GET",
            endpoint: "story/vote/",
        }) (dispatch, getState)
        // dispatch  
        if (response) {
            dispatch({
                type: VOTE_ADDED,
                payload: {
                    ...response
                }
            })
        }
    }
