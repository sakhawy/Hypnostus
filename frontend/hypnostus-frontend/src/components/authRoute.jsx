import React from "react"
import {connect} from "react-redux"
import {Route, Redirect} from "react-router-dom"

class AuthRoute extends React.Component {
    render(){
        return (
            <React.Fragment>
                {this.props.user.token &&
                    <Route path={this.props.path} component={this.props.component} {...this.props}/>
                }
                {!this.props.user.token &&
                    <Redirect to="/login" />
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AuthRoute)