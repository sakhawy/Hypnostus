import { callApi } from "./api";

export const BRANCH_ADDED = "BRANCH_ADDED";

export const create_load_story_in_branch = (data) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "story/",
        data: {
            title: data.title,
            content: data.content,
            parent: data.parentId
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


export const load_current_in_branch = (id) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method:"GET",
        endpoint: "story/",
        params: {
            id: id
        }
    })(dispatch, getState)
    // dispatch  
    if (response) {
        dispatch({
            type: BRANCH_ADDED,
            payload: {
                ...response
            }
        })
    }
}


export const load_next_in_branch = (data) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "GET",
        endpoint: "story/next/",
        params:
        {
            id: data.id,
            n: data.n
        }
    }) (dispatch, getState)
    // dispatch  
    // response will be false in case of errors
    if (response){
        dispatch({
            type: BRANCH_ADDED,
            payload: {
                ...response
            }
        })
        return true
    }
    return false 
}

export const load_prev_in_branch = (id) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "GET",
        endpoint: "story/prev/",
        params:
        {
            id: id,
        }
    }) (dispatch, getState)
    // dispatch  
    // response will be false in case of errors
    if (response){
        dispatch({
            type: BRANCH_ADDED,
            payload: {
                ...response
            }
        })
        return true
    }
    return false 
}