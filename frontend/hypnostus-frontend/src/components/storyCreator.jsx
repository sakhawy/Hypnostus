import React from "react"
import {connect} from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Grid, Button, TextField, Container, ButtonGroup } from "@material-ui/core"
import queryString from "query-string"
import { create_story } from "../store/actions/stories"
const styles = (theme) => ({
    root : {
        display: "grid",    // to make the alerts at the bottom
        alignItems: "center",
        justifyContent: "center",
        height: "100%", 
    },
    container: {
        marginTop: "2rem",
        width: "100%",
        height: "80%",
        border: "3px solid #000a12",
        borderRadius: "10px",

        [theme.breakpoints.down("sm")]: {
            height: "25rem",
            width: "23rem",
        },
        [theme.breakpoints.up("md")]: {
            height: "25rem",
            width: "35rem",
        },
        [theme.breakpoints.up("lg")]: {
            height: "25rem",
            width: "40rem",
        },

    },
    titleContainer: {
        padding: "10px",
        borderBottom: "3px solid black",
        height: "20%"
    },
    contentContainer: {
        padding: "10px",
        borderBottom: "3px solid black",
        height: "auto"
    },
    buttonGroupContainer: {
        height: "auto"
    },
    buttonGroup: {
        width: "100%",
        height: "100%",
        borderRadius: "0px"
    
    },
    button: {
        width: "100%",
        borderRadius: "0px"
    },
})

class StoryCreator extends React.Component{
    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.path = queryString.parse(this.props.location.search)
        this.state = {
            title: '',
            content: '',
            parentId: this.path.parent 
        }
    }

    async handleSubmit(){
        // add to branch then redirect to it
        this.setState({...this.state, title: "", content:""})
        await this.props.createStory(this.state)
        this.props.history.push({
            pathname: '/story',
            search: queryString.stringify({"id": this.props.story.id}),
        })
    }

    handleCancel(){
        this.props.history.goBack()
    }

    handleChange(e){
        this.setState({...this.state, [e.target.name]: e.target.value})
    }

    render(){
        const classes = this.props.classes
        return (


            <Container className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.titleContainer}>
                        <TextField 
                            variant="outlined"
                            name="title"
                            label="Title"
                            fullWidth
                            onChange={this.handleChange}
                            value={this.state.title}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.contentContainer}>
                        <TextField 
                            variant="outlined"
                            className={classes.content}
                            name="content"
                            label="Content"
                            fullWidth
                            rows={10}
                            maxRows={10}
                            multiline
                            onChange={this.handleChange}
                            value={this.state.content}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.buttonGroupContainer}>
                        <ButtonGroup className={classes.buttonGroup}>
                            <Button className={classes.button} onClick={this.handleSubmit}>Save</Button>
                            <Button className={classes.button} onClick={this.handleCancel} >Cancel</Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </Container>
)
    }
}

const mapStateToProps = state => ({
    stories: state.stories,
    story: state.stories.activeStory
})

const mapDispatchToProps = dispatch => ({
    createStory: (data) => dispatch(create_story(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(StoryCreator)
)