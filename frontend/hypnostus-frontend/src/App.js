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
          <AuthRoute path="/story" component={StoryBrowser} />
          <AuthRoute path="/dashboard" component={ Dashboard }/>
          <AuthRoute exact path="/" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
  login: async () => {await dispatch(login())},

})

export default connect(mapStateToProps, mapDispatchToProps)(App);
