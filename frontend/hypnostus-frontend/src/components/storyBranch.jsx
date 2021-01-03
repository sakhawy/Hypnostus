import React from "react"
import {connect} from "react-redux"
import {  Grid } from "@material-ui/core"
import { load_branch } from "../store/actions/branches"
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
        this.state = {
            currentItem: 0
        }
        
    }
    async componentDidMount (){
        this.path = queryString.parse(this.props.location.search)
        await this.props.loadBranch({
            id: this.path.id,
            rank: this.path.rank
        })
        this.setState({...this.state, branch:this.props.branches[this.path["id"]][this.path["rank"]]})

    }

    handleNext(){
        if (this.state.currentItem < this.state.branch.length-1)
            this.setState({
                ...this.state,
                currentItem: this.state.currentItem += 1
            })
    }

    handlePrev(){
        if (this.state.currentItem > 0){
            this.setState({
                ...this.state,
                currentItem: this.state.currentItem -= 1
            })
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
                    {this.state.branch && <Story story={Object.values(this.state.branch)[this.state.currentItem]}/>}
                   
                </Grid> 
                <Grid
                    >
                    <BranchFooter handleNext={this.handleNext} handlePrev={this.handlePrev}/>
                </Grid>
            </Grid>
)
    }
}

const mapStateToProps = state => ({
    branches: state.branches
})

const mapDispatchToProps = dispatch => ({
    loadBranch: (data) => dispatch(load_branch(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(StoryBranch)
)