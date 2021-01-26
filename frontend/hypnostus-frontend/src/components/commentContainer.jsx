import React from "react"
import { connect } from "react-redux"
import { Button, Container, withStyles } from "@material-ui/core"
import CommentIcon from '@material-ui/icons/Comment';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { loadComments, vote, create_comment, edit_comment } from "../store/actions/comments"
import Comment from "./comment"
import CommentCreator from "./commentCreator.jsx"

const styles = (theme) => ({
    root : {
        height: "100%",
        // position: "relative"
    },
    stickyContainer: {
        position: "sticky",
        bottom: "0rem",

    },
    stickyContainer2: {
        position: "sticky",
        bottom: "2.5rem",

    },
    createButton : {
        width: "100%",
        height: "100%",
        border: "3px solid #000a12",
        borderRadius: "10px",
        backgroundColor: "white",
        fontWeight: "bold",
        "&:hover": {
            color: "white",
            backgroundColor: "#263238",
                
        }
    }
})

class CommentContainer extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            toggleCreate: {
                root: false
                // the branches will have ids equal to true or false to show/hide the creator : "10": false, "11": true ...
            },

            toggleEdit: {
                // if a comment id's here, it will have the edit interface
            }
        }

        this.handleCreateComment = this.handleCreateComment.bind(this)
        this.handleCreateCancel = this.handleCreateCancel.bind(this)
        this.handleCreateSave = this.handleCreateSave.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleEditCancel = this.handleEditCancel.bind(this)
        this.handleEditSave = this.handleEditSave.bind(this)
    }

    componentDidMount(){
        // console.log(this.props.activeStory)
        console.log(this.state)
    }

    handleCreateComment(id){
        this.setState({
            ...this.state,
            toggleCreate:{
                ...this.state.toggleCreate,
                [id]: true
            }
        })
    }

    handleCreateSave(data, id){
        this.handleCreateCancel(id)

        this.props.createComment({
            story: this.props.activeStory.id,
            content: data.content,
            parent: data.parent
        })
    }

    handleCreateCancel(id){
        this.setState({
            ...this.state,
            toggleCreate:{
                ...this.state.toggleCreate,
                [id]: false
            }
        })
    }

    handleEdit(id){
        this.setState({
            ...this.state, 
            toggleEdit:{
                ...this.state.toggleEdit,
                [id]: true
            }
        })

        console.log(this.state)
    }

    handleEditCancel(id){
        this.setState({
            ...this.state,
            toggleEdit:{
                ...this.state.toggleEdit,
                [id]: false
            }
        })
    }

    handleEditSave(data, id){
        this.handleEditCancel(id)

        this.props.editComment({
            id: id,
            story: this.props.activeStory.id,
            content: data.content,
        })
    }

    render(){
        const classes = this.props.classes
        return (
            <div className={classes.root}>
                {this.props.rootComments &&
                    this.props.rootComments.map(comment => {
                        return (
                            <div style={{position: "relative"}}>
                                {!this.state.toggleEdit[comment.id] 
                                ?
                                    <Comment key={comment.id} comment={comment} onEdit={() => this.handleEdit(comment.id)}/>
                                :
                                    <CommentCreator 
                                        comment={comment}
                                        onCancel={() => this.handleEditCancel(comment.id)} 
                                        onSave={(content) => this.handleEditSave({content: content, parent: null}, comment.id)} 
                                    />
                                }
                                
                                {this.props.branchComments[comment.id] && this.props.branchComments[comment.id].map(comment => {
                                    return (
                                        <Container>
                                            {!this.state.toggleEdit[comment.id] 
                                            ?
                                                <Comment key={comment.id} comment={comment} onEdit={() => this.handleEdit(comment.id)}/>
                                            :
                                                <CommentCreator 
                                                    comment={comment}
                                                    onCancel={() => this.handleEditCancel(comment.id)} 
                                                    onSave={(content) => this.handleEditSave({content: content, parent: comment.id}, comment.id)} 
                                                />
                                            }
                                        </Container>
                                    )
                                })}
                                

                                { 
                                !this.state.toggleCreate[comment.id]     // show/hide indicator by comment id 
                                    ?
                                    <Container className={classes.stickyContainer2}>
                                        <Button 
                                            className={classes.createButton}
                                            onClick={() => this.handleCreateComment(comment.id)}
                                        >
                                            <CommentIcon /> Reply
                                        </Button>
                                    </Container>
                                    :
                                    <Container 
                                        className={`${classes.commentCreatorContainer} ${classes.stickyContainer2}`}
                                    >
                                        <CommentCreator onCancel={() => this.handleCreateCancel(comment.id)} onSave={(content) => this.handleCreateSave({content: content, parent: comment.id}, comment.id)} />
                                    </Container>
                                }

                            </div>
                            
                        )
                    })
                }
                { 
                !this.state.toggleCreate.root 
                    ?
                    <div
                        className= {classes.stickyContainer}
                    >
                        <Button
                            className={classes.createButton}
                            onClick={() => this.handleCreateComment("root")}
                        >
                            <ChatBubbleIcon /> Comment
                        </Button>
                    </div>
                    :
                    <div 
                        className={`${classes.commentCreatorContainer} ${classes.stickyContainer}`}
                    >
                        <CommentCreator onCancel={() => this.handleCreateCancel("root")} onSave={(content) => this.handleCreateSave({content: content, parent: null}, "root")} />
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    rootComments: state.comments.root,
    branchComments: state.comments.branches,
    activeStory: state.stories.activeStory

})

const mapDispatchToProps = dispatch => ({
    loadRootComments: (data) => {dispatch(loadComments(data)) },
    createComment: (data) => dispatch(create_comment(data)),
    editComment: (data) => dispatch(edit_comment(data))

})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(CommentContainer)
)