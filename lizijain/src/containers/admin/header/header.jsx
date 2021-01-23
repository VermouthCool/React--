import React, { Component } from 'react'
import {Button,Modal} from 'antd'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {deletetitle} from '../../../redux/actions/title'
import screenfull from 'screenfull'
import {FullscreenOutlined,FullscreenExitOutlined} from '@ant-design/icons'
import MenuList from '../../../config/menu'
import {reqWeather} from '../../../api/index'
import './header.less'
@connect(
    state=>({...state}),{
        deletetitle
    }
  )
@withRouter
class Header extends Component{
    state={
        isFull:false,
        data:new Date().getFullYear()+'年 '+new Date().getMonth()+1+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds(),
        weather:{},
        title:''
    }
    getweather=async()=>{
        let w = await reqWeather();
        var weather = {};
        weather.city = w.lives[0].city
        weather.tem = w.lives[0].temperature+'℃';
        weather.info = w.lives[0].weather;
        this.setState({weather});
        console.log(weather);
        switch (this.state.weather.info) {
            case '晴':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/qing.png'
                break;
            case '阴':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/yin.png'
                break;
            case '多云'||"少云"||"晴间多云":
                this.tupian = 'http://api.map.baidu.com/images/weather/day/duoyun.png'
                break;
            case '小雨':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/xiaoyu.png'
                break;
            case '大雨':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/dayu.png'
                break;
            case '小雪':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/xiaoxue.png'
                break;
            case '大雪':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/daxue.png'
                break;
            case '暴雪':
                this.tupian = 'http://api.map.baidu.com/images/weather/day/baoxue.png'
                break;
            default:
                break;
        }
    }
    componentDidMount(){
        let a = new Date()
        screenfull.on('change',()=>{
            let isFull = !this.state.isFull;
            this.setState({isFull})
        });
        this.time = setInterval(()=>{
            this.setState({data:new Date().getFullYear()+'年 '+new Date().getMonth()+1+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()})
        },1000)
        this.getweather()
        this.tupian = '';
        this.getTile(MenuList);
    }
    componentWillUnmount(){
        this.props.deletetitle()
        clearInterval(this.time);
    }
    full=()=>{
        screenfull.toggle();
    }
    getTile=(a)=>{
        var key = this.props.location.pathname.split('/').reverse()[0];
        if(this.props.location.pathname.indexOf('product')!==-1){
            this.state.title = '商品管理'
            return
        }
        a.forEach((item)=>{
            if(item.children){
                this.getTile(item.children);
            }else{
                if(item.key == key){
                    this.state.title=item.title;
                }
            }
        })
    }
    delete=()=>{
        Modal.confirm({
            title:'您真的想要退出吗',
            content:'当你点击过后会在一秒后退出',
            onOk:()=>{
                setTimeout(()=>{
                    this.props.Delete()
                })
            },
            onCancel(){},
            okText:'确定',
            cancelText:'取消'
        })
    }
    render() {
        let {isFull} = this.state;
        return (
            <div>
                <header className="header">
                    <div className='header-top'>
                        <Button>
                        {
                isFull?<FullscreenExitOutlined size="small" onClick={this.full}/>:<FullscreenOutlined size="small" onClick={this.full}/>
                        }
                        </Button>
                        <span className="username">{`尊贵的${this.props.logindata.user.username}欢迎您`}</span>
                        <Button type='link' size='small' onClick={this.delete}>退出登录</Button>
                    </div>
                    <div className="header-bottom">
                        <div className="left">{this.props.titledata||this.state.title||'首页'}</div>
                        <div className="right">
                            <span className="time">{this.state.data}</span>
                            <img src={this.tupian} alt="天气"/>
                            {this.state.weather.city} {this.state.weather.info}
                            <span className="wen">{this.state.weather.tem}</span>
                        </div>
                    </div>
                </header>
            </div>
        )
    }
}
export default Header