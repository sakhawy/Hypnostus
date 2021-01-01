import { vote_story } from "../actions/stories";
import { VOTE_ADDED, VOTES_LOADED } from "../actions/votes"
// making a state for votes cause it will complicate matters if i were to put it in stories
const vote_reducer = (votes = {}, action) => {
    switch (action.type) {
        case VOTES_LOADED:
            return {...action.payload}

        case VOTE_ADDED:
            return {...votes, ...action.payload}

        default:
            return votes;
    }
}
export default vote_reducer