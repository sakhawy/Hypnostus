import { callApi } from "./api";

export const STORIES_LOADED = "STORIES_LOADED";
export const STORY_CREATED = "STORY_CREATED";
export const STORY_UPDATED = "STORY_UPDATED";
export const STORY_DELETED = "STORY_DELETED";

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
