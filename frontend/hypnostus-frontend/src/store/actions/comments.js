import { callApi } from "./api";

export const COMMENTS_LOADED = "COMMENTS_LOADED"
export const COMMENTS_ADDED = "COMMENTS_ADDED"
export const COMMENTS_DELETED = "COMMENTS_DELETED"
export const COMMENTS_UPDATED = "COMMENTS_UPDATED"

export const load_comments = (data, new_load=false) => async (dispatch, getState) => {
    console.log(data)
    // call api 
    const response = await callApi({
        method: "GET",
        endpoint: "story/comment/",
        params: data
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        if (new_load){
            dispatch({
                type: COMMENTS_LOADED,
                payload: response
            })
        } else {
            dispatch({
                type: COMMENTS_ADDED,
                payload: response
            })
        }
    }
}

export const create_comment = (data) => async (dispatch, getState) => {
    console.log(data)
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "story/comment/",
        data: {
            story: data.story,
            content: data.content,
            parent: data.parent
        }
    }) (dispatch, getState)
    if (response) {
        dispatch({
            type: COMMENTS_ADDED,
            payload: [ response ]
        })
    }
}

export const edit_comment = (data) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "PUT",
        endpoint: "story/comment/",
        data: {
            id: data.id,
            story: data.story,
            content: data.content
        }
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        dispatch({
            type: COMMENTS_UPDATED,
            payload: response

        })
    }
} 

export const delete_comment = (data) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "DELETE",
        endpoint: "story/comment/",
        data: {
            id: data.id
        }
    }) (dispatch, getState)
    if (response) {
        dispatch({
            type: COMMENTS_DELETED,
            payload: response

        })
    }
} 

export const vote = (data) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "vote/",
        data: {
            entity_type: "comment",
            entity: data.id,
            value: data.value
        }
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        // reload branch [ease of calculations]
        dispatch({
            type: COMMENTS_UPDATED,
            payload: response
        })
    }
}
