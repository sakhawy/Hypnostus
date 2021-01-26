import { callApi } from "./api";

export const ROOT_COMMENTS_LOADED = "COMMENTS_LOADED"
export const BRANCH_COMMENTS_LOADED = "BRANCH_COMMENTS_LOADED"
export const ROOT_COMMENT_ADDED = "ROOT_COMMENT_ADDED"
export const BRANCH_COMMENT_ADDED = "BRANCH_COMMENT_ADDED"
export const BRANCH_COMMENT_UPDATED = "BRANCH_COMMENT_UPDATED"
export const ROOT_COMMENT_UPDATED = "ROOT_COMMENT_UPDATED"
export const ROOT_COMMENT_DELETED = "ROOT_COMMENT_DELETED"
export const BRANCH_COMMENT_DELETED = "BRANCH_COMMENT_DELETED"

export const loadComments = (data) => async (dispatch, getState) => {
    console.log(data)
    // call api 
    const response = await callApi({
        method: "GET",
        endpoint: "story/comment/",
        params: {
            story: data.story,
            parent: data.parent
        }
    }) (dispatch, getState)
    // dispatch  
    if (response) {
        // reload branch [ease of calculations]
        const action = data.parent ? BRANCH_COMMENTS_LOADED : ROOT_COMMENTS_LOADED   
        if (!data.parent){
            dispatch({
                type: action,
                payload: response
            })
        } else {
            // the branch state is only deleted when the root comments gets reloaded so it
            // needs to know who's the parent to keep on adding 
            dispatch({
                type: action,
                payload: {
                    id: data.parent,
                    data: response
                }
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
    // dispatch  
    if (response) {
        // load all the comments again 
        // FIXME: BAD
        if (!response.parent){
            dispatch({
                type: ROOT_COMMENT_ADDED,
                payload: response
            })
        }
        else {
            dispatch({
                type: BRANCH_COMMENT_ADDED,
                payload: response
            })
        }
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
    const action = response.parent ? BRANCH_COMMENT_UPDATED : ROOT_COMMENT_UPDATED   
    if (response) {
        dispatch({
            type: action,
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
    // dispatch  
    const action = response.parent ? BRANCH_COMMENT_DELETED : ROOT_COMMENT_DELETED   
    if (response) {
        dispatch({
            type: action,
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
        if (data.parent){
            dispatch({
                type: BRANCH_COMMENT_UPDATED,
                payload: response
            })
        } else {
            dispatch({
                type: ROOT_COMMENT_UPDATED,
                payload: response
            })
        }
    }
}
