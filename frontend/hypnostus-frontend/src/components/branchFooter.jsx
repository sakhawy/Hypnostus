import React from "react";
import {connect} from "react-redux"
import { withStyles } from "@material-ui/core/styles"
import { Button, Grid } from "@material-ui/core";

const styles = {
    sticky: {
        // border: "1px solid",
        // position: "sticky",
        // bottom: "0rem",
        // backgroundColor: "white",
        // width: "91.5%",
        // border: "1px solid black",
        // padding: "5px"
    }
    
}

class BranchFooter extends React.Component {

    constructor(props){
        super(props)
    }

    componentDidMount(){
    }

    componentDidUpdate(){
        console.log(this.props.stories)
    }

    render() {
        const classes = this.props.classes
        return (
            <Grid
                container
                className={classes.sticky}
                >
                <Grid
                    item
                    xs={3}
                    align="center"
                    >
                    <Button
                        size="large"
                        onClick={this.props.handlePrev}
                        >
                        Prev
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={6}
                    align="center"
                    >
                    <Button
                        size="large"
                        >
                        Alternate
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={3}
                    align="center"
                    >
                    <Button
                        size="large"
                        onClick={this.props.handleNext}
                        >
                        Next
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
    stories: state.stories
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(BranchFooter)
)