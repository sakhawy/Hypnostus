import { compose, createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import stories_reducer from "./reducers/stories"
import branches_reducer from "./reducers/branches"
import user_reducer from "./reducers/user"
import vote_reducer from "./reducers/votes"

const reducers = combineReducers({
    stories: stories_reducer,
    branches: branches_reducer,
    user: user_reducer,
    user_votes: vote_reducer
})
const middlewares = applyMiddleware(thunk)
const enhancers = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(reducers, enhancers)
export default store