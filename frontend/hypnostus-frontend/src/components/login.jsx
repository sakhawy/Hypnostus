import React from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import { Grid } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import {connect} from "react-redux"
import { login } from "../store/actions/user";
import { Alert } from "@material-ui/lab"

const styles = (theme) => ({
    root : {
        display: "flex",    
        flexWrap: 'wrap', // to make the alerts at the bottom
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
            height: "19rem",
            width: "23rem",
        },
        [theme.breakpoints.up("md")]: {
            height: "18rem",
            width: "35rem",
        },
        [theme.breakpoints.up("lg")]: {
            height: "18rem",
            width: "40rem",
        },

    },
    gridItem : {
        height: "25%",
        width: "100%",
        // display: "grid",
        // placeItems: "center",
        padding: "0px 10px"
    },
    loginText: {
        height: "100%",
        display: "flex",
        alignItems: "center"
    },
    textfield: {
        width: "100%",
        height: "100%",
    },
    submit: {
        height: "80%",
        width: "100%",
        border: "3px solid #000a12"
        // marginBottom: "20px"
    },
    alert : {
        width: "100%"
    }
    
})

class LogIn extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            errors: {

            }
        }

        this.classes = this.useStyles
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
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

    handleSubmit = async (e) => {
        e.preventDefault()
        if (this.state.username && this.state.password){
            await this.props.login(this.state)
            this.handleError("wrongCreds")

            // redirect if no errors
            if (Object.keys(this.state.errors).length === 0){
                this.props.history.replace({
                    pathname: '/dashboard',
                })
            }
        } else {
            this.handleError("noCreds", true)
        }
        
    }

    handleChange = (e) => {
        this.setState({...this.state, [e.target.name]: e.target.value})
    }

    render() {
        const classes = this.props.classes
        return (
            <Container className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item xs={12} className={classes.gridItem}>
                        <Typography component="h1" variant="h5" className={classes.loginText}>
                            Log In
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField 
                            variant="outlined"
                            className={classes.textfield}
                            required
                            label="Username"
                            name="username"
                            autoFocus
                            onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField 
                            variant="outlined"
                            className={classes.textfield}
                            required
                            type="password"
                            label="Password"
                            name="password"
                            onChange={this.handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <Button
                            variant="outlined"
                            className={classes.submit}
                            type="submit"
                            onClick={this.handleSubmit}
                            
                        >
                            Log In
                        </Button>
                    </Grid>
                </Grid>
                    {/* ALERTS */}

                    { this.state.errors.wrongCreds && 
                            <Alert severity="error" className={classes.alert}>
                                Wrong Credentials
                            </Alert> 
                    }
                    { this.state.errors.noCreds && 
                            <Alert severity="error" className={classes.alert}>
                                Please fill in all the fields.
                            </Alert> 
                    }
            </Container>

        );
    }
}

const mapStateToProps = state => ({
    user: state.user,
    errors: state.api.errors
})

const mapDispatchToProps = dispatch => ({
    login: async (cred) => {await dispatch(login(cred))}
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(LogIn)
    
)