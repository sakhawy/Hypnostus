import React from "react";
import {connect} from "react-redux"
import MainStory from "./mainStory";
import { load_stories } from "../store/actions/stories";
import { withStyles } from "@material-ui/core/styles"
import { Button, Container, Grid } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
const styles = (theme) => ({
    root : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // the navbar
    },
    container: {
        height: "80%",
        border: "3px solid #000a12",
        borderRadius: "10px",
        marginTop: "2rem",
        padding: "2rem 1rem",

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
    storiesContainerParent: {
        width: "100%",
        height: "90%",      // 90 for this 10 for the create button
        overflowY: "hidden",
        
        border: "3px solid #000a12",
        borderBottom: "0px",
        borderRadius: "10px 10px 0px 0px",
        padding: "0px 10px",

    },
    storiesContainerChild: {
        width: "100%",
        height: "100%",
        overflowY: "scroll",
        'scrollbar-width': "thin",
    },
    story: {
        width: "100%",
        marginBottom: "10px",
        "&:nth-of-type(1)": {   // accessing firs child to give it margin top
            marginTop: "10px"
        }
    },
    buttonContainer: {
        height: "10%",
        border: "3px solid #000a12",
        borderRadius: "0px 0px 10px 10px",
    },
    responsiveButton: {
        height: "100%",
        width: "100%"
    }
})

class Dashboard extends React.Component {
    componentDidMount(){
        this.props.loadStories()
        this.handleCreate = this.handleCreate.bind(this)
    }
    
    handleCreate(){
        this.props.history.push({
            pathname: '/story/create',
        })
    }

    render() {
        const classes = this.props.classes
        return (
            <Container
                className={classes.root}
            >
                <Grid container className={classes.container}>
                    <Grid item container xs={12} className={classes.storiesContainerParent}>
                        <div className={classes.storiesContainerChild}>
                            {Object.keys(this.props.stories).map(story => {
                                return  (
                                    <Grid item className={classes.story} key={story}>
                                            <MainStory 
                                                id={story} 
                                                history={this.props.history}
                                                />
                                    </Grid>
                                )
                            })}
                        </div>
                    </Grid>
                    <Grid 
                        item 
                        xs={12}
                        className={classes.buttonContainer}
                        >
                        <Button
                            className={classes.responsiveButton}
                            onClick={this.handleCreate}
                        >
                            <AddCircleIcon />
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    stories: state.stories.mainStories
})

const mapDispatchToProps = dispatch => ({
    loadStories: async () => {await dispatch(load_stories())}
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Dashboard)
)