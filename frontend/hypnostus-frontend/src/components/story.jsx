import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {connect} from "react-redux"
import { Grid } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import { vote } from "../store/actions/votes"

const styles = () => ({
    root: {
        height: "70vh",
        overflowY: "scroll",
        overflowX: "hidden"

    },
    sticky: {
        position: "sticky",
        top: "0px",
        backgroundColor: "white",
        borderBottom: "1px solid black",
        // width: "inherit"
    },
    story: {
        font: "18px sans-serif",
    }
})

class Story extends React.Component{

    constructor(props){
        super(props)
        this.handleVote = this.handleVote.bind(this)
    }

    handleVote(value){
        this.props.vote({
            storyId: this.props.story.id,
            value: value
        })
    }

    render(){
        const classes = this.props.classes
        return (
            <Box 
                border={1} 
                borderRadius={5} 
                className={classes.root}
                >
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    spacing={2}
                    >
                    <Grid 
                        container
                        alignItems="center"
                        spacing={1}
                        className={classes.sticky}
                        >
                        <Grid 
                            item
                            xs={2}
                            >
                            <Grid 
                                container
                                direction="column"
                                alignItems="center"
                                >
                                <Grid item>
                                    <Button
                                        onClick={() => this.handleVote(1)}
                                        variant="outlined"
                                        color={ this.props.user_votes[this.props.story.id] === 1 ? "secondary" : "default" }
                                        >
                                        UP
                                        </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={() => this.handleVote(-1)}
                                        variant="outlined"
                                        color={ this.props.user_votes[this.props.story.id] === -1 ? "secondary" : "default" }
                                        >
                                        DN
                                        </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid 
                            item
                            xs={8}
                            >
                            <Typography
                                align="center"
                                variant="h4"
                                >
                                {this.props.story.title}
                            </Typography>
                        </Grid>
                        <Grid 
                            item
                            xs={2}
                            >
                            <Typography
                                align="center"
                                >
                                By: {this.props.story.username}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid 
                        item
                        align="left"
                        >
                        <Box
                            p={2}
                            >
                            <pre
                                className={classes.story}
                                // align="left"
                                >
                                {this.props.story.content}
                            </pre>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    user_votes : state.user_votes
})

const mapDispatchToProps = dispatch => ({
    vote: (data) => {dispatch(vote(data))},
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Story)
)