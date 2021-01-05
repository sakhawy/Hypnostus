import { compose, createStore, applyMiddleware, combineReducers } from "redux"
import thunk from "redux-thunk"
import stories_reducer from "./reducers/stories"
import branch_reducer from "./reducers/branches"
import user_reducer from "./reducers/user"

const reducers = combineReducers({
    stories: stories_reducer,
    branch: branch_reducer,
    user: user_reducer,
})
const middlewares = applyMiddleware(thunk)
const enhancers = compose(middlewares, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
const store = createStore(reducers, enhancers)
export default store