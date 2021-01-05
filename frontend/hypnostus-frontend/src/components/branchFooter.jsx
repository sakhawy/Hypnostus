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

    render() {
        const classes = this.props.classes
        return (
            <Grid
                container
                className={classes.sticky}
                >
                <Grid
                    item
                    xs={2}
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
                    xs={3}
                    align="center"
                    >
                    <Button
                        size="large"
                        onClick={() => this.props.handleAlternate(1)}
                        >
                        Downternate
                    </Button>
                </Grid>
                <Grid 
                    item
                    xs={2}
                    >
                    <Button
                        size="large"
                        onClick={() => this.props.handleCreate()}
                        >
                        Create
                    </Button>
                </Grid>
                <Grid 
                    item
                    xs={3}
                    >
                    <Button
                        size="large"
                        onClick={() => this.props.handleAlternate(-1)}
                        >
                        Upternate
                    </Button>
                </Grid>
                <Grid
                    item
                    xs={2}
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