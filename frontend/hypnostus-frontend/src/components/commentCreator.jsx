import React from "react"
import { connect } from "react-redux"
import { Container, Grid, Typography, withStyles, Button, TextField } from "@material-ui/core"
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const styles = (theme) => ({
    root : {
        height: "100%",
        border: "3px solid #000a12",
        borderRadius: "10px",
        padding: "10px",
        backgroundColor: "white"
    },
    mainGrid: {
        height: "100%",
        width: "100%",
        // backgroundColor: "black"
    },

    responsiveButton: {
        // color: "red",
        maxWidth: "100%",
        minWidth: "100%",
        maxHeight: "100%",
        minHeight: "100%",
        border: "3px solid #000a12"

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
    username: {
        display: "flex",
        height: "100%",
        alignItems: "center",
        paddingLeft: "10px"
    },
    commentContainer: {
    },

    buttonContainer: {
        // height: "10%"
    },

    comment: {
        width: "100%"
    }

})

class CommentCreator extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            comment: {
                content: ""
            }
        }
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount(){
    }

    handleChange(e){
        this.setState({
            ...this.state,
            comment: {
                ...this.state.comment,
                content: e.target.value
            }
        })
    }

    render(){
        const classes = this.props.classes
        return (
            <div className={classes.root}>
                <Grid
                    container
                    className={classes.mainGrid}
                    spacing={1}
                >
                    <Grid
                        item
                        xs={12}
                        className={classes.commentContainer}
                    >
                        <TextField 
                            label="Comment"
                            name="comment"
                            variant="outlined"
                            rows={5}
                            maxRows={5}
                            multiline
                            className={classes.comment}
                            onChange={this.handleChange}
                            defaultValue={this.props.comment ? this.props.comment.content : null}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        className={classes.buttonContainer}
                    >
                        <Button
                            variant="outlined"
                            className={classes.responsiveButton}
                            onClick={() => this.props.onSave(this.state.comment.content)}
                        >
                            <SaveIcon /> Save
                        </Button>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        className={classes.buttonContainer}
                    >
                        <Button
                            variant="outlined"
                            className={classes.responsiveButton}
                            onClick={this.props.onCancel}
                        >
                            <CancelIcon /> Cancel
                        </Button>
                    </Grid>


                </Grid>
            </div>
        )
    }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(CommentCreator)
)