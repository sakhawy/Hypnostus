import { callApi } from "./api"

export const VOTE_ADDED = "VOTE_ADDED"
export const VOTES_LOADED = "VOTES_LOADED"
export const VOTE_DELETED = "VOTE_DELETED"

export const vote = (storyId, value) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "story/vote/",
        data: {
            id: storyId,
            value: value
        }
    }) (dispatch, getState)
    // dispatch  
    console.log(response)
    if (response) {
        if (response[storyId] !== 0){
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