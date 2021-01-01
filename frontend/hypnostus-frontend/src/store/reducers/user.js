import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../actions/user"

const initialState = {
    token: null,
    username: null
}

const user_reducer = (user = [], action) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return {...user, ...action.payload}

        case USER_LOGGED_OUT:
            return initialState

        default:
            return user
    }
} 
export default user_reducer