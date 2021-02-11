import comment from "../../components/comment";
import { COMMENTS_LOADED, COMMENTS_ADDED, COMMENTS_DELETED, COMMENTS_UPDATED } from "../actions/comments";

const comments_reducer = (comments=[], action) => {
    switch (action.type) {

        case COMMENTS_LOADED:
            return action.payload

        case COMMENTS_ADDED:
            return ([
                ...comments.filter(comment => {
                    // filter for duplication :)
                    for (var i=0; i<action.payload.length; i++){
                        if (action.payload[i].id == comment.id){
                            return false
                        }
                    }
                    return true
                }),
                ...action.payload
            ])

        case COMMENTS_DELETED:
            return ([
                ...comments.filter(comment => comment.id !== action.payload.id)
            ])

        case COMMENTS_UPDATED:
            return ([
                ...comments.map(comment => {
                    return comment.id === action.payload.id ? action.payload : comment
                })
            ])

        default:
            return comments
    }
}

export default comments_reducer