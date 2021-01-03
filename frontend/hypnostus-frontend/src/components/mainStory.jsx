import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
import { Grid } from "@material-ui/core"
import queryString from "query-string"

class MainStory extends React.Component{

    render(){
        return (
            <Box border={1} borderRadius={5} p={2} m={2}>
                <Grid 
                    container
                    alignItems="center"
                    spacing={1}
                    >
                    <Grid 
                        item
                        xs={2}
                        >
                        <Grid 
                            container
                            direction="column"
                            alignItems="center"
                            >
                            <Grid item>
                                <Button>UP</Button>
                            </Grid>
                            <Grid item>
                                <Button>DN</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid 
                        item
                        xs={8}
                        >
                        <Typography
                            component={ Link }
                            color="inherit"
                            underline="none"
                            variant="h4"
                            noWrap
                            to={`/story/?${queryString.stringify({id: this.props.id, rank: 0})}`}
                            >
                            {this.props.title}
                            
                        </Typography>
                    </Grid>
                    <Grid 
                        item
                        xs={2}
                        >
                        <Typography>
                            By: {this.props.username}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MainStory)