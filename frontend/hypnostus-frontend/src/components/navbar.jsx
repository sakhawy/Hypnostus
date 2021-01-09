import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import { Grid } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"

const styles = {
    nav: {
        borderBottom: "3px solid black"
    },
    button: {
        border: "3px solid #000a12"
    }
}

class Navbar extends React.Component{

    render(){
        const classes = this.props.classes
        return (
            <AppBar elevation={0} position="static" color="default" className={classes.nav}>
                {!this.props.user.token && 
                <Toolbar
                >
                    <Grid container spacing={1}>

                        <Grid item xs={8} xm={8} xl={10}>
                            <Typography variant="h4">Home</Typography>
                        </Grid>
                        <Grid item xs={2} xm={2} xl={1}>
                            <Button component={ Link } to="/login" color="default" variant="outlined" fullWidth className={classes.button}>Login</Button>
                        </Grid>
                        <Grid item xs={2} xm={2} xl={1}>
                            <Button component={ Link } to="/signup" color="default" variant="outlined" fullWidth className={classes.button}> Signup</Button>
                        </Grid>
                    </Grid>
                </Toolbar>
                }
                {this.props.user.token &&
                <Toolbar

                >
                    <Grid container spacing={1}>
                        <Grid item xs={10} xm={10} xl={11}>
                            <Typography 
                                component={Link} 
                                to="/dashboard" 
                                color="inherit" 
                                variant="h4"
                                style={{
                                    textDecoration: "none"
                                }}
                            >
                                Dashboard
                            </Typography>
                        </Grid>
                        <Grid item xs={2} xm={2} xl={1}>
                            <Button component={ Link } to="/logout" color="default" variant="outlined" fullWidth className={classes.button}> Logout </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            
                }
            </AppBar>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(Navbar)
)