import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"
import { logout } from "../store/actions/user"

class LogOut extends React.Component {
    componentDidMount(){
        this.props.logout()
    }
    
    render(){
        return (
            <Redirect to="/login/"/>
        )
    }
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
    logout: () => {dispatch(logout())}
})

export default connect(mapStateToProps, mapDispatchToProps)(LogOut)