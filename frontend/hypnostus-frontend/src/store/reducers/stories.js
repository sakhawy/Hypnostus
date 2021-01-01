import { STORIES_LOADED, STORY_CREATED, STORY_DELETED, STORY_UPDATED } from "../actions/stories";

const stories_reducer = (stories = [], action) => {
    switch (action.type) {
        case STORIES_LOADED:
            return [...action.payload.stories]
        
        case STORY_CREATED:
            return [...stories, action.payload]

        case STORY_UPDATED:
            return stories.map(story => {
                return story.id === action.payload.id ? action.payload : story     
            })

        case STORY_DELETED:
            return stories.filter(story => {
                return story.id !== action.payload.id 
            })

        default:
            return stories
    }
}

export default stories_reducer