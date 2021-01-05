import { BRANCH_ADDED, BRANCH_POPPED, BRANCH_DELETED } from "../actions/branches";

const branch_reducer = (branch={}, action) => {
    switch (action.type) {
        case BRANCH_ADDED:
            return {...action.payload}
            
        default:
            return branch
    }
}

export default branch_reducer