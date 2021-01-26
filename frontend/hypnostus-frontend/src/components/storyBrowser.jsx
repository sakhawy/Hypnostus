import React from "react"
import {connect} from "react-redux"
import {  Button, Grid, Box, Typography, Container, ButtonGroup } from "@material-ui/core"
import queryString from "query-string"
import { withStyles } from "@material-ui/core/styles"
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab'
import { load_active_story, load_next_active_story, load_prev_active_story } from "../store/actions/stories"
import { vote } from "../store/actions/stories"
import { loadComments } from "../store/actions/comments"
import CommentContainer from "./commentContainer"

const styles = (theme) => ({
    root : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", 
        flexWrap: 'wrap', 

    },
    // child: {
        

    // }
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
        //backgroundColor: "red",
        // minHeight: "100%",
        height: "100%",
        border: "3px solid #000a12",
        borderRadius: "10px",
    },
    header: {
        alignItems:"center",
        align: "center",
        padding: "10px 10px 0px 10px",
        height: "15%"
    },
    titleContainerParent:{
        align:"center",
        display: "flex", 
        height: "100%",
        border: "3px solid #000a12",
        borderRight: "0px",
        borderRadius: "10px 0px 0px 10px",
        overflow: "hidden"
    },
    titleContainerChild: {
        overflowX: "scroll",
        'scrollbar-width': "thin",
        'whiteSpace': "pre",
        display: "flex",
        alignItems: "center",
        padding: "10px"     // for title
    },
    voteContainer: {
        height: "100%",
        // width: "16%",
        align: "center",
        alignItems: "center",
        margin: "0px",
        padding: "0px",
        border: "3px solid #000a12",
        borderRadius: "0px 10px 10px 0px",
        overflow: "hidden"
    },
    voteButtonsParent: {    // upvote/votes/downvote
        height: "34.5%",    // yeah, 33.33 was weird
        width: "100%",
    },
    responsiveButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: "100%",
        minHeight: "100%",
        // variant: "outlined",
        maxWidth: "100%",
        minWidth: "100%",
        // border: "1px solid black"
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
    authorContainer : {
        display: "flex",
        alignSelf: "flex-end",
        justifyContent: "center",
        padding: "0px 5px"
    },
    contentContainerParent: {
        height: "65%", 
        padding: "10px 10px 0px 10px",
    },
    contentContainerChild: {
        border: "3px solid #000a12",
        borderRadius: "10px",
        overflow: "hidden",
        padding: "10px", // for content
        width: "100%",
        height: "100%"
    },
    content: {
        // width: ""
        overflowY: "scroll",
        height: "100%",
        width: "100%",
        "whiteSpace": "pre-line",
        'scrollbarWidth': "thin",
    },
    controlersContainer: {
        height: "20%", 
        padding: "10px 10px 20px 10px",
        width: "100%"
    },
    buttonGroup: {
        border: "3px solid #000a12",
        borderRadius: "10px",
        height: "100%",
        width: "99%"    // another weird thing with the fucking buttons
    },
    flipped: {
        transform: "scaleX(-1)"
    } 
})

class StoryBrowser extends React.Component{
    constructor(props){
        super(props)
        this.handleNext = this.handleNext.bind(this)
        this.handlePrev = this.handlePrev.bind(this)
        this.handleAlternate = this.handleAlternate.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
        this.handleVote = this.handleVote.bind(this)
        
        this.state = {
            errors: {
                noStory: false,
                noNext: false,
                noPrev: false,
                noAltUp: false,
                noAltDown: false
            }
        }
    
    }

    handleError(errorName, force=false){
        // flips the errorName true/false

        if (Object.keys(this.props.errors).length > 0 || force){
            // console.log(this.props.errors)
            // console.log("THERE'S NO STORY WITH CURRENT ID.")
            this.setState({
                ...this.state,
                errors: {
                    [ errorName ]: true
                } 
            })
        }
        // the else resets the stuff to null
        else {
            this.setState({
                ...this.state,
                errors: {
                } 
            })
        }
    }

    async componentDidMount (){
        this.path = queryString.parse(this.props.location.search)
        // load story
        await this.props.loadCurrent(this.path.id)
        this.handleError("noStory")
        // load its comments
        // FIXME: there was a bug that fucked with me for a little, it was a side effect of the
        // state.stories.activeStory, comments of cached activeStory will appear on new loaded active story
        // this is a way to fix it: to load it after awaiting the activeStory to load. but it think it's not clean.
        await this.props.loadRootComments({story: this.props.story.id})
    }

    handleVote(value){
        // didn't click twice
        this.props.vote({
            storyId: this.props.story.id,
            value: value
        })
    }

    handleCreate(){
        this.props.history.push({
            pathname: '/story/create',
            search: queryString.stringify({"parent": this.props.story.id}),
        })
    }

    async handleNext(){
        // TODO: stay put when no next
        if (!this.path.n) this.path.n = this.props.story.n

        await this.props.loadNext({
            id: this.props.story.id,
            n: this.path.n
        })
        this.handleError("noNext")

        // update url params
        this.path.id = this.props.story.id
        window.history.replaceState(null, "", `${this.props.location.pathname}?${queryString.stringify(this.path)}`)
    }

    async handlePrev(){
        // TODO: redirect to dashboard if no prev
        await this.props.loadPrev(this.props.story.id)
        this.handleError("noPrev")

        // update url params 
        this.path.id = this.props.story.id
        window.history.replaceState(null, "", `${this.props.location.pathname}?${queryString.stringify(this.path)}`)
        }

    async handleAlternate(val){
        const res = parseInt(this.props.story.n) + val
        if (res >= 0){
            // wait for load
            await this.props.loadNext({id: this.props.story.parent, n: res})
            this.handleError("noAltDown")
                
            this.path.n = this.props.story.n
            window.history.replaceState(null, "", `${this.props.location.pathname}?${queryString.stringify(this.path)}`)
        }
        else {
            this.handleError("noAltUp", true)
        }
    }

    render(){
        const classes = this.props.classes
        return (
            <Box className={classes.root}>


                



                <Container
                    className={classes.container}
                    >

                    {/* NO STORY ERROR */}
                    {this.state.errors.noStory
                    ?
                    <Typography variant="h3" style={{
                        textAlign: "center"
                    }}>
                        There's no story exists with the current id
                    </Typography>
                    :
                    <Grid
                        container
                        className={classes.mainGrid}
                    >
                            <Grid
                                container
                                spacing={0}
                                className={classes.header}
                            >
                                {/* the title, author and votes */}
                                <Grid
                                    item
                                    xs={7}
                                    className={classes.titleContainerParent}
                                >
                                    <div
                                        className={classes.titleContainerChild}
                                    >
                                        <Typography
                                            variant="h4"
                                            className={classes.title}
                                            >
                                            {this.props.story.title}
                                        </Typography>
                                    </div>
                                </Grid> 
                                <Grid
                                    item
                                    xs={2}
                                    align="center"
                                    className={classes.voteContainer}
                                >
                                    <Grid
                                        item
                                        xs={12} 
                                        className={classes.voteButtonsParent}
                                    >
                                        <Button
                                            className={this.props.story.user_vote === 1 ?
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
                                            {this.props.story.upvotes - this.props.story.downvotes}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        className={classes.voteButtonsParent}
                                        xs={12} 
                                    >
                                        <Button
                                            className={this.props.story.user_vote === -1 ?
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
                                    xs={3}
                                    className={classes.authorContainer}
                                >
                                    <Typography
                                        noWrap
                                    >
                                        {this.props.story.username}
                                    </Typography>
                                </Grid>
                            </Grid>
                        <Grid
                            container
                            className={classes.contentContainerParent}
                            style={{
        
                            }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    className={classes.contentContainerChild}
                                    >
                                    <div
                                        className={classes.content}
                                    >
                                        {this.props.story.content}
                                    </div>
                                </Grid>
                        </Grid>
                        <Grid
                            container
                            className={classes.controlersContainer}
                        >
                            <Grid
                                item
                                xs={12}
                            >
                                <ButtonGroup
                                    fullWidth
                                    className={classes.buttonGroup}
                                >
                                    <Button
                                        onClick={this.handlePrev}
                                    >
                                        <ArrowLeftIcon />
                                    </Button>
                                    <Button
                                        onClick={() => this.handleAlternate(1)}
                                    >
                                        <AccountTreeIcon className={classes.flipped}/>
                                        <ArrowDropDownIcon />
                                    </Button>
                                    <Button
                                        onClick={this.handleCreate}
                                    >
                                        <AddCircleIcon />
                                    </Button>
                                    <Button
                                        onClick={() => this.handleAlternate(-1)}
                                    >
                                        <ArrowDropUpIcon />
                                        <AccountTreeIcon />
                                    </Button>
                                    <Button
                                        onClick={this.handleNext}
                                    >
                                        <ArrowRightIcon />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                    }   

                    {/* ERROR ALERTS */}
                    { this.state.errors.noNext && 
                        <Alert severity="error">
                            The story line has ended.
                        </Alert> 
                    }

                    { this.state.errors.noPrev && 
                        <Alert severity="error">
                            You are currently at the starting point.
                        </Alert> 
                    }

                    { this.state.errors.noAltDown && 
                        <Alert severity="error">
                            You are at the last alternation.
                        </Alert> 
                    }

                    { this.state.errors.noAltUp && 
                        <Alert severity="error">
                            You are at the first alternation.
                        </Alert> 
                    }

                {/* RENDER WHEN ACTIVESTORY IS SET */}
                { Object.keys(this.props.story).length > 0 &&
                    <div style={{height: "40%"}}>

                        <CommentContainer />
                    </div>
                }
                </Container>
                </Box>
)
    }
}

const mapStateToProps = state => ({
    branch: state.branch,
    story: state.stories.activeStory,
    errors: state.api.errors
})

const mapDispatchToProps = dispatch => ({
    loadCurrent: (id) => dispatch(load_active_story(id)) ,
    vote: (data) => {dispatch(vote(data))},

    loadNext: (data) => dispatch(load_next_active_story(data)),
    loadPrev: (id) => dispatch(load_prev_active_story(id)),

    loadRootComments: (data) => {dispatch(loadComments(data)) },

})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(StoryBrowser)
)