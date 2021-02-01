import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import { Grid } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { follow, get_profile } from "../store/actions/profile"
import { load_stories } from "../store/actions/stories"
import { load_comments } from "../store/actions/comments"
import { findByLabelText } from "@testing-library/react"

const styles = (theme) => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    
    container: {
        marginTop: "2rem",
        [theme.breakpoints.down("sm")]: {
            // backgroundColor: "black",
            height: "35rem",
            width: "23rem",
            // padding: "20px"
        },
        [theme.breakpoints.up("md")]: {
            // backgroundColor: "black",
            height: "45rem",
            width: "35rem",
            // padding: "20px"
        },
        [theme.breakpoints.up("lg")]: {
            // backgroundColor: "black",
            height: "55.5rem",
            width: "40rem",
            // padding: "20px"
        },
    },

    mainGrid: {
        border: "3px solid #000a12",
        width: "100%",
        height: "100%"
    },

    headerSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: "1px solid black",
        height: "10%",
    },

    storiesSectionScroll: {
        overflow: "hidden",
    },

    storiesSection: {
        display: "grid",
        // justifyContent: "center",
        // alignItems: "center",
        placeItems: "center",
        borderBottom: "1px solid black",
        height: "45%",
        // backgroundColor: "red",
        overflowY: "scroll",
        scrollbarWidth: "thin",
        padding : "10px"
    },

    storyContainer: {
        border: "3px solid black",
        width: "100%",
        // height: "3rem",
        display: "grid",
        placeItems: "center",
        marginBottom: "10px"
    },

    story: {
        textDecoration: "none",
        color: "black",
        fontWeight: "bold"
    },

    commentsSection: {
        display: "grid",
        // justifyContent: "center",
        // alignItems: "center",
        placeItems: "center",
        borderBottom: "1px solid black",
        height: "45%",
        // backgroundColor: "red",
        overflowY: "scroll",
        scrollbarWidth: "thin",
        padding : "10px",
    }
})

class Profile extends React.Component{

    constructor(props){
        super(props)
        this.handleFollow = this.handleFollow.bind(this) 
        this.username = this.props.match.params.username
    }

    componentDidMount(){
        console.log(this.username)
        this.props.getProfile({
            username: this.username
        })
        // TODO: error check
        this.props.loadStories({
            username: this.username
        })
        this.props.loadComments({
            username: this.username
        })
    }

    handleFollow() {
        this.props.follow({username: this.username})
    }

    render(){
        const classes = this.props.classes
        return (
            <div
                className={classes.root}
            >
                <div
                    className={classes.container}
                >
                    <Grid
                        container
                        className={classes.mainGrid}
                    >
                        <Grid
                            item
                            xs={12}
                            className={classes.headerSection}
                        >
                            <Typography
                                variant="h4"
                            >
                                {this.props.activeProfile.username}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            className={classes.storiesSection}
                        >
                            {this.props.stories && Object.values(this.props.stories).map(story => {
                                return( 
                                    <div
                                        key={story.id}
                                        className={classes.storyContainer}
                                    >  
                                        <Typography
                                            className={classes.story}
                                            component={Link}
                                            to={`/story/?id=${story.id}&n=0`}
                                        >
                                            {story.title}
                                        </Typography>
                                    </div>
                                )
                            })}
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            className={classes.commentsSection}
                        >
                            {this.props.comments && Object.values(this.props.comments).map(comment => {
                                console.log("COMMENTS", this.props.comments)
                                return( 
                                    <div
                                        key={comment.id}
                                        className={classes.storyContainer}
                                    >  
                                        <Typography
                                            
                                            className={classes.story}
                                            component={Link}
                                            to={`/story/?id=${comment.story}&n=0`}
                                        >
                                            {comment.content}
                                        </Typography>
                                    </div>
                                )
                            })}
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    currentProfile: state.profiles.current,
    activeProfile: state.profiles.active,
    stories: state.stories.mainStories,
    comments: state.comments.root
})

const mapDispatchToProps = dispatch => ({
    getProfile: (data) => dispatch(get_profile(data)),     
    follow: (data) => dispatch(follow(data)),
    loadStories: (data) => dispatch(load_stories(data)),
    loadComments: (data) => dispatch(load_comments(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Profile)
)