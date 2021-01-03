import logo from './logo.svg';
import './App.css';
import React from "react"
import { connect } from 'react-redux';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Navbar from "./components/navbar"
import Login from "./components/login"
import Register from "./components/register"
import { login } from './store/actions/user';
import Logout from './components/logout';
import Dashboard from './components/dashboard';
import StoryBranch from './components/storyBranch';
import { load_user_votes } from "./store/actions/votes"

class App extends React.Component {
  componentWillMount(){
    // load local storage
    this.props.login()

    // other stuff that shouldn't be done often
    this.props.loadVotes()

  }

  render (){
    return (
      <Router>
        <Navbar />
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Register}/>
        <Route path="/logout" component={Logout}/>
        <Route path="/dashboard" render={props => 
          <Dashboard />
        }/>
        <Route path="/story" component={StoryBranch} />
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  login: async () => {await dispatch(login())},
  loadVotes : () => {dispatch(load_user_votes())}

})

export default connect(mapStateToProps, mapDispatchToProps)(App);
