import { API_CALL_SUCCEEDED, API_CALL_FAILED } from "../actions/api";

const initialState = {
    errors: {}
}

// NOTE TO SELF: when the server is down there will be an error that will crash the react web server cause state.api.errors will be undefined.
// but that not my problem so fuck you future me :)

const api_reducer = (api = initialState, action) => {
    switch (action.type) {
        case API_CALL_SUCCEEDED:
            return {...api, errors: {...action.payload}}
        
        case API_CALL_FAILED:
            return {...api, errors: action.payload}
            
        default:
            return api
    }
}

export default api_reducer