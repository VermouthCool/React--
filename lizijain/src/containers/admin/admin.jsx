import React, { Component } from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {reqCategory} from '../../api/index'
import {Delete} from '../../redux/actions/login'
import {Layout} from 'antd'
import './admin.less'
import Header from './header/header.jsx'
import Leftnav from './left-nav/left-nav.jsx'
import Home from '../../components/home/home.jsx'
import Category from '../category/category.jsx'
import Product from '../product/product.jsx'
import Detail from '../product/detail.js'
import Add from '../product/add.js'
import User from '../user/user.jsx'
import Role from '../role/role.jsx'
import Line from '../line/line.jsx'
import Bar from '../bar/bar.jsx'
import Pie from '../pie/pie.jsx'
const {Sider,Footer,Content} = Layout
//在render里面切换页面最好使用Redirect
@connect(state => ({...state}),{
    Delete
})
class Admin extends Component{
    tui=()=>{
        this.props.Delete()
    }
    fen=async ()=>{
       let a = await reqCategory();
       console.log(a);
    }
    state = {
        collapsed: false,
      };
    
      onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
      };
    render() {
        if(this.props.logindata.isLogin){
            return (
                <Layout className="admin" style={{ minHeight: '100vh' }}>
                <Sider className="sider" collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <Leftnav className="left"></Leftnav>
                </Sider>
                <Layout>
                    <Header className="header" logindata={this.props.logindata}
                    Delete={this.props.Delete}
                    >Header</Header>
                    <Content className="content">
                        <Switch>
                            <Route path="/admin/home" component={Home}></Route>
                            <Route path="/admin/prod/category" component={Category}></Route>
                            <Route path="/admin/prod/product" component={Product} exact={true}></Route>
                            <Route path="/admin/prod/product/detail/:id" component={Detail}></Route>
                            <Route path="/admin/prod/product/add" component={Add} exact={true}></Route>
                            <Route path="/admin/prod/product/add/:id" component={Add}></Route>
                            <Route path="/admin/user" component={User}></Route>
                            <Route path="/admin/role" component={Role}></Route>
                            <Route path="/admin/charts/bar" component={Bar}></Route>
                            <Route path="/admin/charts/line" component={Line}></Route>
                            <Route path="/admin/charts/pie" component={Pie}></Route>
                            <Redirect to="/admin/home"></Redirect>
                        </Switch>
                    </Content>
                    <Footer className="footer">推荐使用谷歌浏览器，获取最佳用户体验</Footer>
                </Layout>
                {/* <button onClick= {this.fen}>dasdsadsa</button> */}
                </Layout>
            )
        }else{
          return <Redirect to="/login"></Redirect>
        }
    }
}
export default Admin