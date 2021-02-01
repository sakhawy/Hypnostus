import './App.css';
import React from "react"
import { connect } from 'react-redux';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom"
import Navbar from "./components/navbar"
import Login from "./components/login"
import Register from "./components/register"
import { login } from './store/actions/user';
import { get_profile } from "./store/actions/profile"
import Logout from './components/logout';
import Dashboard from './components/dashboard';
import StoryCreator from './components/storyCreator';
import AuthRoute from './components/authRoute';
import StoryBrowser from './components/storyBrowser';
import Profile from './components/profile';


class App extends React.Component {
  async componentWillMount(){
    // load local storage or do nothing
    await this.props.login()

    // get the profile if we have a logged in user
    if (this.props.user.username){
      await this.props.getProfile({
        username: this.props.user.username
      })
    }

  }

  render (){
    return (
      <Router>
        <Navbar />
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/signup" component={Register}/>
          <Route path="/logout" component={Logout}/>
          <AuthRoute path="/story/create" component={StoryCreator} />
          <Route path="/story" component={StoryBrowser} />
          <Route path="/dashboard" component={ Dashboard }/>
          <Route path="/profile/:username" component={ Profile }/>
          <Route exact path="/" component={Dashboard} />
        </Switch>
        {Object.keys(this.props.errors).length > 0 && this.props.errors.status === 401 &&
          <Redirect to="/login" />
        }
        
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  errors: state.api.errors
})

const mapDispatchToProps = (dispatch) => ({
  login: async () => {await dispatch(login())},
  getProfile: async (data) => await dispatch(get_profile(data, true)) // true cause this is initial profile get request
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
