import React from "react"
import {connect} from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Grid, Button, TextField, TextareaAutosize, Container } from "@material-ui/core"
import { create_story } from "../store/actions/stories"
import queryString from "query-string"
import { create_load_story_in_branch } from "../store/actions/branches"
import { Redirect } from "react-router-dom"
const styles = {

}

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
            search: queryString.stringify({"id": this.props.branch.id}),
        })
    }

    handleCancel(){
        this.props.history.goBack()
    }

    handleChange(e){
        this.setState({...this.state, [e.target.name]: e.target.value})
    }

    render(){
        return (
            <Container>
                <Grid
                    container
                    direction="column"
                    >
                    <Grid
                        item
                        >
                        <Grid
                            container
                            >
                            <Grid
                                item
                                xs={12}
                                style={{
                                    margin: "15px 0px 0px 0px"
                                }}
                                >
                                <TextField 
                                    variant="outlined"
                                    name="title"
                                    label="Title"
                                    fullWidth
                                    onChange={this.handleChange}
                                    value={this.state.title}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    margin: "15px 0px 0px 0px"
                                }}
                                >
                                <TextField 
                                    variant="outlined"
                                    name="content"
                                    label="Content"
                                    fullWidth
                                    multiline
                                    rows={10}
                                    rowsMax={10}
                                    onChange={this.handleChange}
                                    value={this.state.content}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        >
                        <Grid
                            container
                            style={{
                                margin: "15px 0px 0px 0px",
                            }}
                            >
                            <Grid
                                item
                                xs={6}
                                >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    >
                                    Save
                                </Button>
                            </Grid>
                            <Grid
                                item
                                xs={6}
                                >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                    onClick={this.handleCancel}
                                    >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
    </Container>
)
    }
}

const mapStateToProps = state => ({
    branch: state.branch,
    stories: state.stories
})

const mapDispatchToProps = dispatch => ({
    createStory: (data) => dispatch(create_load_story_in_branch(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(StoryCreator)
)