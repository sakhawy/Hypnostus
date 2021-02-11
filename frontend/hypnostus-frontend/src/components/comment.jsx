import React from "react"
import { connect } from "react-redux"
import { Container, Grid, Typography, withStyles, Button } from "@material-ui/core"
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { delete_comment, load_comments } from "../store/actions/comments"
import {vote} from "../store/actions/comments"
const styles = (theme) => ({
    root : {
        height: "100%",
        border: "3px solid #000a12",
        borderRadius: "10px",
        padding: "10px"
    },
    mainGrid: {
        height: "100%",
        width: "100%",
        // backgroundColor: "black"
    },
    header: {
        height: "35%",
    },
    voteContainer: {
        minHeight: "90%",
        maxHeight: "90%",
        border: "3px solid #000a12",
        borderRadius: "10px",
        // overflow: "hidden",
        width: "100%"
    },
    voteButtonsParent: {    // upvote/votes/downvote
        height: "34.5%",    // yeah, 33.33 was weird
        width: "100%",
    },
    responsiveButton: {
        // color: "red",
        maxWidth: "100%",
        minWidth: "100%",
        maxHeight: "100%",
        minHeight: "100%",
    },

    buttonVoted: {
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#263238",
        "&:hover": {
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#263238",
                
        }
    },
    username: {
        display: "flex",
        height: "100%",
        alignItems: "center",
        paddingLeft: "10px"
    },
    contentContainerParent: {
        height: "55%",
    },
    contentContainerChild: {
        // marginLeft: "10"
        // minHeight: "90%",
        // maxHeight: "90%"
        height: "100%",
        overflowY: "scroll",
        'scrollbar-width': 'thin',
        wordWrap: "break-word",
        'whiteSpace': "pre-wrap"
    },
    expandButtonContainer: {
        height: "10%",
    },
    expandButton : {
        fontWeight: "bold"
    }

})

class Comment extends React.Component {
    constructor(props){
        super(props)
        this.handleVote = this.handleVote.bind(this)
        this.handleAddComments = this.handleAddComments.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleVote(value){
        // didn't click twice
        this.props.vote({
            storyId: this.props.activeStory.id,
            id: this.props.comment.id,
            value: value,
            parent: this.props.comment.parent   // for detecting root and branches
        })
    }

    handleAddComments(){
        this.props.addComments({
            parent: this.props.comment.id 
        })
    }

    handleDelete(){
        this.props.delete({id: this.props.comment.id})
    }

    componentDidMount(){
    }

    render(){
        const classes = this.props.classes
        return (
            <div className={classes.root}>
                <Grid
                    container
                    className={classes.mainGrid}
                >
                    <Grid
                        container    
                        className={classes.header}
                    >
                        <Grid
                            container
                            xs={1}
                            align="center"
                            className={classes.voteContainer}
                        >
                            <Grid
                                item
                                xs={12} 
                                className={classes.voteButtonsParent}
                            >
                                <Button
                                    className={this.props.comment.user_vote === 1 ?
                                        `${classes.responsiveButton} ${classes.buttonVoted}` :
                                        `${classes.responsiveButton}`}
                                    onClick={() => this.handleVote(1)}
                                >
                                    <ExpandLessIcon />
                                </Button>
                            </Grid>
                            <Grid
                                item
                                className={classes.voteButtonsParent}
                                xs={12} 
                            >
                                <Typography
                                    className={classes.responsiveButton}
                                >
                                    {this.props.comment.value}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                className={classes.voteButtonsParent}
                                xs={12} 
                            >
                                <Button
                                    className={this.props.comment.user_vote === -1 ?
                                        `${classes.responsiveButton} ${classes.buttonVoted}` :
                                        `${classes.responsiveButton}`}
                                    onClick={() => this.handleVote(-1)}
                                >
                                    <ExpandMoreIcon />
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                        >
                            <Typography className={classes.username}>
                                {this.props.comment.username}
                            </Typography>
                        </Grid>
                        {/* TODO: only show this to user. will be fixing when you implement profiles */}
                        <Grid
                            item 
                            xs={2}
                        >
                            <Button
                                onClick={this.handleDelete}
                            >
                                <DeleteIcon />
                            </Button>
                            <Button
                                onClick={this.props.onEdit}
                            >
                                <EditIcon />
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        className={classes.contentContainerParent}
                    >
                        <div className={classes.contentContainerChild}>
                            <Typography >
                                {this.props.comment.content}
                            </Typography>
                        </div>
                    </Grid>
                    {!this.props.comment.parent && 
                    // the load replies are for parents only
                    <Grid
                        item
                        xs={12}
                        className={classes.expandButtonContainer}
                    >
                        <Button
                            className={` ${classes.responsiveButton} ${classes.expandButton} `}
                            onClick={this.handleAddComments}
                        >
                            <ExpandMoreIcon /> Load replies
                        </Button>
                    </Grid>}


                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    activeStory: state.stories.activeStory
})

const mapDispatchToProps = dispatch => ({
    vote: (data) => {dispatch(vote(data))},
    addComments: (data) => {dispatch(load_comments(data))},
    delete: (data) => dispatch(delete_comment(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Comment)
)