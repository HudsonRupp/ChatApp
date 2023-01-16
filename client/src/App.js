
import './App.css';
import React, { Component } from 'react';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './pages/Home'
import Auth from './pages/Auth'
import Protected from './components/Protected'
import Navbar from './components/Navbar';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }

  }

  render() {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/">
            <Route path="/home" element={
              <Protected >
                <Home />
              </Protected>
            } />
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }
}
export default App;
