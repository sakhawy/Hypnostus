import { BRANCH_ADDED } from "../actions/branches";

const initialState = {
    // storyId : {
    //     rank : [...content]
    // }
}

const branches_reducer = (branches = initialState, action) => {
    switch (action.type) {
        case BRANCH_ADDED:
            return ({
                ...branches,  // spread branch content
                [action.payload.id]:
                    {
                        ...branches[action.payload.id],  // get the content [for if the story has other branches] 
                        [action.payload.rank]: [...action.payload.branch]    // add the new branch 
                    }
            })
        default:
            return branches
    }
}

export default branches_reducer