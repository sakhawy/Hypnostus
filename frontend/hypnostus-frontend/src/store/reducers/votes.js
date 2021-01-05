import { VOTES_LOADED, VOTE_ADDED, VOTE_DELETED } from "../actions/votes"

export const vote_reducer = (votes = [], action) => {
    switch (action.type) {
        case VOTES_LOADED:
            return [...action.payload]            
    
        case VOTE_ADDED:
            return [...votes, {...action.payload}]

        case VOTE_DELETED:
            return votes.filter(vote => Object.keys(vote)[0] !== action.payload.id)

        default:
            return votes
    }
}