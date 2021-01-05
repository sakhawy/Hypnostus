import React from "react"
import {connect} from "react-redux"
import {  Grid } from "@material-ui/core"
import { load_current_in_branch, load_next_in_branch, load_prev_in_branch } from "../store/actions/branches"
import queryString from "query-string"
import Story from "./story"
import BranchFooter from "./branchFooter"
import { withStyles } from "@material-ui/core/styles"
const styles = {
    root : {
        marginTop: "0rem",
        height: "90vh",

    },
    child: {
        

    }
}

class StoryBranch extends React.Component{
    constructor(props){
        super(props)
        this.handleNext = this.handleNext.bind(this)
        this.handlePrev = this.handlePrev.bind(this)
        this.handleAlternate = this.handleAlternate.bind(this)
        this.handleCreate = this.handleCreate.bind(this)
    }
    async componentDidMount (){
        this.path = queryString.parse(this.props.location.search)
        this.props.loadCurrent(this.path.id)
        // console.log(this.props.branch)
    }


    handleCreate(){
        this.props.history.push({
            pathname: '/story/create',
            search: queryString.stringify({"parent": this.props.branch.id}),
        })
    }

    async handleNext(){
        // TODO: stay put when no next
        if (!this.path.n) this.path.n = 0

        await this.props.loadNext({
            id: this.props.branch.id,
            n: this.path.n
        })

        // update url params
        this.path.id = this.props.branch.id
        window.history.replaceState(null, "", `${this.props.location.pathname}?${queryString.stringify(this.path)}`)
    }

    handlePrev(){
        // TODO: redirect to dashboard if no prev
        this.props.loadPrev(this.props.branch.id)

        // // update url params 
        this.path.id = this.props.branch.id
        window.history.replaceState(null, "", `${this.props.location.pathname}?${queryString.stringify(this.path)}`)

    }

    handleAlternate(val){
        const res = parseInt(this.props.branch.n) + val
        console.log(this.props.branch.n, val, res)
        if (res >= 0){
            console.log(res)
            this.props.loadNext({id: this.props.branch.parent, n: res})
            console.log(this.props.branch)
        }
    }

    render(){
        const classes = this.props.classes
        return (
            <Grid 
                container
                align="center"
                justify="center"
                direction="column"
                className={classes.root}
                >
                <Grid
                    item
                    align="center"
                    >
                    {this.props.branch && <Story />}
                   
                </Grid> 
                <Grid
                    >
                    <BranchFooter handleNext={this.handleNext} handlePrev={this.handlePrev} handleCreate={this.handleCreate} handleAlternate={this.handleAlternate}/>
                </Grid>
            </Grid>
)
    }
}

const mapStateToProps = state => ({
    branch: state.branch,
    stories: state.stories
})

const mapDispatchToProps = dispatch => ({
    loadCurrent: (id) => dispatch(load_current_in_branch(id)) ,
    loadNext: (data) => dispatch(load_next_in_branch(data)),
    loadPrev: (id) => dispatch(load_prev_in_branch(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(StoryBranch)
)