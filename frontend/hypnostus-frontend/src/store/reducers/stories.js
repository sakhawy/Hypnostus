import { STORIES_LOADED, STORY_CREATED, ACTIVE_STORY_LOADED, STORY_UPDATED } from "../actions/stories";
const initialState = {
    mainStories: [],
    activeStory: {}
}
const stories_reducer = (stories=initialState, action) => {
    switch (action.type) {
        case STORIES_LOADED:
            return ({
                ...stories,
                mainStories: action.payload
            })
        
        case ACTIVE_STORY_LOADED:
            return ({
                ...stories,
                activeStory: action.payload
            })

        case STORY_CREATED:
            return ({
                ...stories,
                activeStory: action.payload
            })

        case STORY_UPDATED: // for voting
            return ({
                ...stories,
                activeStory: action.payload
            })

        default:
            return stories
    }
}

export default stories_reducer