import React from "react";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import TextField from "@material-ui/core/TextField"
import { Grid } from "@material-ui/core"
import {withStyles} from "@material-ui/core/styles"

import {connect} from "react-redux"
import { register } from "../store/actions/user";
import { Alert } from "@material-ui/lab"

const styles = (theme) => ({
    root : {
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // the navbar
    },
    container: {
        marginTop: "2rem",
        height: "80%",
        border: "3px solid #000a12",
        borderRadius: "10px",

        [theme.breakpoints.down("sm")]: {
            height: "21rem",
            width: "23rem",
        },
        [theme.breakpoints.up("md")]: {
            height: "21rem",
            width: "35rem",
        },
        [theme.breakpoints.up("lg")]: {
            height: "21rem",
            width: "40rem",
        },

    },
    gridItem : {
        height: "20%",
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
    }
    
})


class Register extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            username: "",
            password: "",
            errors: {}
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleError(errorName, force=false){
        // flips the errorName true/false
        // force if it wasn't api related error

        if (Object.keys(this.props.errors).length > 0 || force){
            // console.log(this.props.errors)
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
        if (this.state.username && this.state.password && this.state.password === this.state.confirmPassword){
            await this.props.register(this.state)
            this.handleError("usernameUsed")
            
            // redirect if no errors
            if (Object.keys(this.state.errors).length === 0){
                this.props.history.replace({
                    pathname: '/dashboard',
                })
            }
        } else {
            console.log("BAD")
            this.handleError("badCreds", true)
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
                            Register
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField 
                            variant="outlined"
                            required
                            className={classes.textfield}
                            label="Userame"
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
                            name="confirmPassword"
                            onChange={this.handleChange}                    
                        />
                    </Grid>
                    <Grid item xs={12} className={classes.gridItem}>
                        <TextField 
                            variant="outlined"
                            className={classes.textfield}
                            required
                            type="password"
                            label="Confirm Password"
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
                            register
                        </Button>
                    </Grid>
                </Grid>
                {/* ALERTS */}

                { this.state.errors.usernameUsed && 
                    <Alert severity="error">
                        Userame is taken
                    </Alert> 
                }

                { this.state.errors.badCreds && 
                    <Alert severity="error">
                        Bad credentials. Please fill all the fields <i>correctly</i>.
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
    register: async (cred) => {await dispatch(register(cred))}
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Register)
)
