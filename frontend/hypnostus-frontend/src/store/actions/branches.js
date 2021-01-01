import { callApi } from "./api";

export const BRANCH_ADDED = "BRANCH_ADDED";


export const load_branches = (storyId, rank) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "GET",
        endpoint: "story/branch/",
        params:
        {
            id: storyId,
            rank: rank
        }
    }) (dispatch, getState)
    // dispatch  
    if (response){
        dispatch({
            type: BRANCH_ADDED,
            payload: {
                ...response
            }
        })
    }
}