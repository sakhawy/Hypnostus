import { compose, createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import stories_reducer from "./reducers/stories"
import user_reducer from "./reducers/user"
import api_reducer from "./reducers/api"
import comments_reducer from "./reducers/comments"

const reducers = combineReducers({
    stories: stories_reducer,
    user: user_reducer,
    api: api_reducer,
    comments: comments_reducer
})
const middlewares = applyMiddleware(thunk)
const enhancers = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(reducers, enhancers)
export default store