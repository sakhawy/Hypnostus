import React from "react";
import Box from "@material-ui/core/Box"
import {connect} from "react-redux"
import MainStory from "./mainStory";
import { load_stories } from "../store/actions/stories";

class Dashboard extends React.Component {
    componentDidMount(){
        this.props.loadStories()
    }
    
    render() {
        return (
            <Box>
                {this.props.stories.map(story => {
                    return <MainStory key={story.id} id={story.id} title={story.title} username={story.username}/>
                })}
            </Box>
        );
    }
}

const mapStateToProps = state => ({
    stories: state.stories
})

const mapDispatchToProps = dispatch => ({
    loadStories: async () => {await dispatch(load_stories())}
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)