import { CURRENT_PROFILE_LOADED, ACTIVE_PROFILE_LOADED, PROFILE_FOLLOWED, PROFILE_UNFOLLOWED } from "../actions/profile"

const initialState = {
    current: {},
    active: {}
}

const profile_reducer = (profiles=initialState, action) => {
    switch (action.type) {
        case CURRENT_PROFILE_LOADED:
            return ({
                ...profiles,
                current: action.payload
            })
            
        case ACTIVE_PROFILE_LOADED:
            return ({
                ...profiles, 
                active: action.payload
            })

        // case PROFILE_FOLLOWED:
        //     return 

        default:
            return profiles
    }
}

export default profile_reducer