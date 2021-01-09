import React from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import { Container, Grid } from "@material-ui/core"
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import queryString from "query-string"
import { withStyles } from "@material-ui/core/styles"
import { vote } from "../store/actions/stories"
const styles = () => ({
    container: {
        // backgroundColor: "red",
        margin: "0px",
        padding: "0px",
        border: "3px solid #000a12",
        borderRadius: "10px",
        width: "100%",
        height: "5rem"

    },
    mainGrid: {
        width: "100%",
        height: "100%"
    },
    voteContainer: {
        width: "100%",
        height: "100%",
        borderRight: "3px solid #000a12",
        // backgroundColor: "red"
    },
    voteButtonsParent: {
        width: "100%",
        height: "34%",
    },
    responsiveButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        minHeight: "100%",
        maxWidth: "100%",
        minWidth: "100%",
        borderRadius: "0px",
        "&:hover": {

            backgroundColor: 'inherit'
        }
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
    titleContainerParent: {
        paddingLeft: "10px",
        height: "100%",
        overflow: "hidden",
        borderRight: "3px solid #000a12",
        display: "flex",
        alignItems: "center"

    },
    titleContainerChild: {
        overflowX: "scroll",
        height: "100%",
        'scrollbar-width': "thin",
        'whiteSpace': "pre",
        display: "flex",
        alignItems: "center"
    },
    title: {
        textDecoration: "none",
    },
    authorContainer: {
        display: "flex",
        // alignSelf: "flex-end",
        justifyContent: "center",
    },
})

class MainStory extends React.Component{
    constructor(props){
        super(props)
        this.handleVote = this.handleVote.bind(this)
    }

    handleVote(value){
        // so the vote here has a bug, when you upvote the ui doesn't update cause the state.stories.mainStories doesn't.
        // a cute fix would be to redirect the use to the story's browser page. 
        const story = this.props.stories[this.props.id]
        if (value !== story.user_vote){
            this.props.vote({
                storyId: story.id,
                value: value
            })
        } else {
            // unvote
            this.props.vote({
                storyId: story.id,
                value: 0
            })
        }

        // fix
        this.props.history.push({
            pathname: '/story/',
            search: queryString.stringify({id: story.id, n: 0}),
        })
    }

    render(){
        const classes = this.props.classes
        const story = this.props.stories[this.props.id]
        return (
            <Container
                className={classes.container}
            >
                <Grid 
                    container
                    alignItems="center"
                    // spacing={1}
                    className={classes.mainGrid}
                    >
                        <Grid
                            item
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
                                    // className={classes.responsiveButton}
                                    className={story.user_vote === 1 ?
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
                                    {story.upvotes - story.downvotes}
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                className={classes.voteButtonsParent}
                                xs={12} 
                            >
                                <Button
                                    // className={classes.responsiveButton}
                                    className={story.user_vote === -1 ?
                                        `${classes.responsiveButton} ${classes.buttonVoted}` :
                                        `${classes.responsiveButton}`}
                                    onClick={() => this.handleVote(-1)}
                                >
                                    <ExpandMoreIcon />
                                </Button>
                            </Grid>
                        </Grid>


                    {/* <Grid 
                        item
                        xs={2}
                        className={classes.buttonGroupContainer}
                        >
                        <ButtonGroup
                            orientation="vertical"
                            className={classes.buttonGroup}
                        >
                            <Button className={classes.button}>U</Button>
                            <Typography>1</Typography>
                            <Button className={classes.button}>D</Button>
                        </ButtonGroup>
                    </Grid> */}
                    <Grid 
                        item
                        xs={8}
                        className={classes.titleContainerParent}
                        >
                        <div className={classes.titleContainerChild}>
                            <Typography
                                component={ Link }
                                color="inherit"
                                className={classes.title}
                                variant="h4"
                                to={`/story/?${queryString.stringify({id: story.id, n: 0})}`}
                                >
                                {story.title}
                                
                            </Typography>
                        </div>
                    </Grid>
                    <Grid 
                        item
                        xs={3}
                        className={classes.authorContainer}
                        >
                        <Typography noWrap>
                            {story.username}
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    stories: state.stories.mainStories
})

const mapDispatchToProps = dispatch => ({
    vote: (data) => {dispatch(vote(data))},
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(MainStory)
)