import './App.css';
import React from "react"
import { connect } from 'react-redux';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom"
import Navbar from "./components/navbar"
import Login from "./components/login"
import Register from "./components/register"
import { login } from './store/actions/user';
import Logout from './components/logout';
import Dashboard from './components/dashboard';
import StoryCreator from './components/storyCreator';
import AuthRoute from './components/authRoute';
import StoryBrowser from './components/storyBrowser';

class App extends React.Component {
  componentWillMount(){
    // load local storage
    this.props.login()


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
  errors: state.api.errors
})

const mapDispatchToProps = (dispatch) => ({
  login: async () => {await dispatch(login())},

})

export default connect(mapStateToProps, mapDispatchToProps)(App);
