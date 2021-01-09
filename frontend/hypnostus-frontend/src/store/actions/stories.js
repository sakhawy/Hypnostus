import { callApi } from "./api";

export const STORIES_LOADED = "STORIES_LOADED";
export const STORY_CREATED = "STORY_CREATED";
export const STORY_UPDATED = "STORY_UPDATED";
export const STORY_DELETED = "STORY_DELETED";
export const ACTIVE_STORY_LOADED = "ACTIVE_STORY_LOADED"

export const load_stories = () => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method:"GET",
        endpoint: "story/",
    })(dispatch, getState)
    // dispatch  
    if (response) {
        dispatch({
            type: STORIES_LOADED,
            payload: {
                ...response
            }
        })
    }
}



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
        // reload branch [ease of calculations]
        dispatch(load_active_story(data.storyId))
    }
}


export const create_story = (data) => async (dispatch, getState) => {
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
            type: ACTIVE_STORY_LOADED,
            payload: {
                ...response
            }
        })
    }
}


export const load_active_story = (id) => async (dispatch, getState) => {
    // call api 
    if (!id){
        id = -1     // cause the endpoint return the root stories when id == none 
    }
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
            type: ACTIVE_STORY_LOADED,
            payload: {
                ...response
            }
        })
    }
}


export const load_next_active_story = (data) => async (dispatch, getState) => {
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
            type: ACTIVE_STORY_LOADED,
            payload: {
                ...response
            }
        })
        return true
    }
    return false 
}

export const load_prev_active_story = (id) => async (dispatch, getState) => {
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
            type: ACTIVE_STORY_LOADED,
            payload: {
                ...response
            }
        })
        return true
    }
    return false 
}