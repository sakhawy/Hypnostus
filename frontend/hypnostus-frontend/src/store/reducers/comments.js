import comment from "../../components/comment";
import { BRANCH_COMMENTS_LOADED, ROOT_COMMENTS_LOADED, ROOT_COMMENT_ADDED, BRANCH_COMMENT_ADDED, BRANCH_COMMENT_UPDATED, ROOT_COMMENT_UPDATED, ROOT_COMMENT_DELETED, BRANCH_COMMENT_DELETED } from "../actions/comments";
const initialState = {
    root: [],
    branches: {}
}
const comments_reducer = (comments=initialState, action) => {
    switch (action.type) {
        case ROOT_COMMENTS_LOADED:

            // the empty object is for the undefined error that will occur when adding to non existent branches [new replies]
            const branches = Object.fromEntries(
                new Map(
                    action.payload.map(comment => {
                        console.log([comment.id, "A"])
                        return [comment.id, []]
                    }),
                )
            )
            return ({
                root: action.payload,
                branches: branches  // reset 
            })

        case BRANCH_COMMENTS_LOADED:
            return ({
                ...comments,
                branches: {
                    ...comments.branches,
                    [action.payload.id]: action.payload.data   // {id: [], ...}
                }
            })

        case ROOT_COMMENT_ADDED:
            return ({
                ...comments,
                root: [
                    ...comments.root,
                    action.payload
                ],
                branches: {     // add a dummy branch object to prevent undefined errors
                    ...comments.branches,
                    [action.payload.id]: []
                }

            })

        case BRANCH_COMMENT_ADDED:
            return ({
                ...comments,
                branches: {
                    ...comments.branches,
                    [action.payload.parent]: [  
                        ...comments.branches[action.payload.parent],    // destruct it
                        action.payload
                    ]
                }
            })

        case BRANCH_COMMENT_UPDATED:
            return ({
                ...comments,
                branches: {
                    ...comments.branches,
                    [action.payload.parent]: 
                        comments.branches[action.payload.parent].map(comment => {
                            return comment.id === action.payload.id ? action.payload : comment 
                        })
                    
                }
            })

        case ROOT_COMMENT_UPDATED:
            return ({
                ...comments,
                root: comments.root.map(comment => {
                    return comment.id === action.payload.id ? action.payload : comment
                })
            })

        case ROOT_COMMENT_DELETED:
            console.log("ID IS :", action.payload)
            return ({
                ...comments,
                root: comments.root.filter(comment => comment.id !== action.payload.id),
                branches: {
                    // TODO: DELETE BRANCH
                }
            })

        case BRANCH_COMMENT_DELETED:
            return ({
                ...comments,
                branches:{
                    ...comments.branches,
                    [action.payload.parent]: comments.branches[action.payload.parent].filter(comment => comment.id !== action.payload.id)
                }
            })

        default:
            return comments
    }
}

export default comments_reducer