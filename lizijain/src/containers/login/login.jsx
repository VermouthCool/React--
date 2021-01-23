import React, { Component } from 'react'
import {Form,Input,Button,message} from 'antd'
import {UserOutlined,LockOutlined} from '@ant-design/icons'
import './login.less'
import logo from './img/logo.jpg'
import {connect} from 'react-redux'
import {login} from '../../redux/actions/login'
import {reqLogin} from '../../api/index'
import {Redirect} from 'react-router-dom'
const {Item} = Form;
@connect(state=>({...state}),{
    login
})
class Login extends Component{
    onFinish = async values => {
        let result = await reqLogin(values,message);
        if(result.state){
            message.error(result.mes)
        }else{
            this.props.login(result)
            this.props.history.replace('/admin')
        }
    };
    render() {
        if(this.props.logindata.isLogin){
           return <Redirect to="/admin"></Redirect>
        }
        return (
            <div className="login">
                <header>
                    <img src={logo} alt="Logo"/>
                    <h1>商品管理系统</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form onFinish={this.onFinish}>
                        <Item name='username' rules={[{required:true,message:"我亲爱的舍友请输入nin的骚名"},
                        {max:12,message:'你他妈叫这名吗？这么长！重新输'},
                        {min:2,message:'确定不长点吗？重输'},
                        {pattern:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,message:'不行'}
                        ]}>
                            <Input 
                                prefix={<UserOutlined style={{color:'rgba(0,0,0,.5)'}}/>}
                                placeholder='用户名'
                            />
                        </Item>
                        <Item name='password' rules={[{validator:(rule,value,callback)=>{
                            if(!value){
                                // callback('你得输密码啊')
                            return Promise.reject('你得输密码啊')
                            }else if(value.length<4){
                                // callback('太短了')
                               return Promise.reject('太短了')
                            }else if(value.length>12){
                                // callback('太长了')
                               return Promise.reject('太长了')
                            }else if(!/^[0-9]+$/.test(value)){
                                // callback('你觉得你输的那些符号能往这里输吗')
                               return Promise.reject('你觉得你输的那些符号能往这里输吗')
                            }
                            // callback();
                            return Promise.resolve();
                        }}]}>
                            <Input 
                                prefix={<LockOutlined style={{color:'rgba(0,0,0,.5)'}}/>}
                                placeholder='密码'
                                type="password"
                            />
                        </Item>
                        <Item>
                            <Button type='primary' htmlType="submit" className='login-form-button'>
                                登录
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}
export default Login