import logo from './logo.svg';
import './App.css';
import store from "./store/config"
import { create_story, delete_story, load_stories, update_story, vote_story } from './store/actions/stories';
import { load_branches } from './store/actions/branches';
import { register, login } from './store/actions/user';
import { vote } from './store/actions/votes';

const f = async () => {
  await store.dispatch(login("username", "password" ))
  await store.dispatch(vote(41, -1))
  // await store.dispatch(load_stories())
  // await store.dispatch(vote_story(41, 1))
  // await store.dispatch(load_stories())
}
f()
// store.dispatch(load_branches(41, 0))
// store.dispatch(update_story(49, "jsjklajdfkl", "sdfsdfsdf"))
// store.dispatch(create_story("test", "test", null))

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
