import { callApi } from "./api";

export const STORIES_LOADED = "STORIES_LOADED";
export const STORY_CREATED = "STORY_CREATED";
export const STORY_UPDATED = "STORY_UPDATED";
export const STORY_DELETED = "STORY_DELETED";

// TODO: handle authentication 

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
                stories: [...response]
            }
        })
    }
}

export const create_story = (name, content, parentId) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "story/",
        data: {
            name: name,
            content: content,
            parent: parentId
        }
    }) (dispatch, getState)
    // dispatch  
    if (response){
        dispatch({
            type: STORY_CREATED,
            payload: {
                ...response
            }
        })
    }
}

export const update_story = (storyId, name, content, parentId) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "PUT",
        endpoint: "story/",
        data:
        {   
            id: storyId,
            name: name,
            content: content,
            parent: parentId
        }
    }) (dispatch, getState)
    // dispatch  
    if (response){
        dispatch({
            type: STORY_UPDATED,
            payload: {
                ...response
            }
        })
    }
}


export const delete_story = (storyId) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "DELETE",
        endpoint: "story/",
        data:
        {   
            id: storyId,
        }
    }) (dispatch, getState)
    // dispatch  
    if (response){
        dispatch({
            type: STORY_DELETED,
            payload: {
                ...response
            }
        })
    }
}

export const vote_story = (storyId, value) => async (dispatch, getState) => {
    // call api 
    const response = await callApi({
        method: "POST",
        endpoint: "story/vote/",
        data:
        {   
            id: storyId,
            value: value
        }

    }) (dispatch, getState)
    // dispatch  
    if (response){
        dispatch({
            type: STORY_UPDATED,
            payload: {
                ...response
            }
        })
    }
}