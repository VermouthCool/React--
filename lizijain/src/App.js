import React, { Component } from 'react'
import {Route,Switch} from 'react-router-dom'
import Admin from './pages/admin/admin.jsx'
import Login from './pages/login/login.jsx'
export default class App extends Component{
  render() {
    return (
      <div className="app">
       <Switch>
         {/* <Route path='/login' component={Login}></Route> */}
         <Route path='/login' component={Login}></Route>
         <Route path="/admin" component={Admin}></Route>
       </Switch>
      </div>
    )
  }
}