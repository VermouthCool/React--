import React, { Component } from 'react'
import {Button,Menu} from 'antd'
import {save} from '../../../redux/actions/title'
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import menu from '../../../config/menu.js'
import './left-nav.less'
import src from '../../login/img/logo.jpg'
import { reqRolelist } from '../../../api'
const {SubMenu} = Menu;
@connect(
  state=>({...state}),
  {
    saveTitle:save
  }
)
@withRouter
class Leftnav extends Component {
    createmenu=(a)=>{
      if(this.props.logindata.user.role){
        var c = a.map((item)=>{
          if(this.props.logindata.user.role.indexOf(item.key)===-1){
             return
          }
             if(!item.children){
                 return <Menu.Item key={item.key} icon={item.icon} onClick={()=>{this.props.saveTitle(item.title)}}>
                             <Link to={item.path}>{item.title}</Link>
                         </Menu.Item>
             }else{
                 return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                         {this.createmenu(item.children)}
                     </SubMenu>
             }
         })
         return c
      }else{
        var c = a.map((item)=>{
             if(!item.children){
                 return <Menu.Item key={item.key} icon={item.icon} onClick={()=>{this.props.saveTitle(item.title)}}>
                             <Link to={item.path}>{item.title}</Link>
                         </Menu.Item>
             }else{
                 return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                         {this.createmenu(item.children)}
                     </SubMenu>
             }
         })
         return c
      }
    }
  render() {
    return (
      <div>
          <header className="nav_header">
              <img src={src} alt="Logo"/>
              <h1>商品管理系统</h1>
          </header>
        <Menu
        className="menu"
          defaultSelectedKeys={[this.props.location.pathname.indexOf('product')===-1?(this.props.location.pathname.split('/').reverse()[0]=='admin'?'home':this.props.location.pathname.split('/').reverse()[0]):'product']}
          defaultOpenKeys={this.props.location.pathname.split('/').slice(2)}
          mode="inline"
          theme="dark"
        //   inlineCollapsed={this.state.collapsed}
        >
            {
                this.createmenu(menu)
            }
          {/* <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to='/admin/home'>首页</Link>
          </Menu.Item>
          <SubMenu key="prod" icon={<AppstoreOutlined />} title="商品">
            
            <Menu.Item key="category" icon={<UnorderedListOutlined />}> 
                <Link to='/admin/prod/category'>分类管理</Link>
            </Menu.Item>
            <Menu.Item key="product" icon={<ToolOutlined />}>
                <Link to='/admin/prod/product'>商品管理</Link>
            </Menu.Item>
          </SubMenu> */}
        </Menu>
      </div>
    );
  }
}
export default Leftnav
