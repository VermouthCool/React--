import axios from 'axios'
import {message}  from 'antd'
import Nprogress from 'nprogress'
import {Delete} from '../redux/actions/login'
import store from '../redux/store'
import 'nprogress/nprogress.css'
var qs = require('querystring');
let instance = axios.create({
    timeout:4000
})
instance.interceptors.request.use((config)=>{
    Nprogress.start();
    if(config.url==='https://restapi.amap.com/v3/weather/weatherInfo?key=845c404bbb4c36b9bec9f56d2a802486&city=141127'){

    }else{
        config.headers.AutoLogin = 'jian_'+store.getState().logindata.token;
    }
    if(config.method.toLowerCase() === 'post'){
        if((config.data) instanceof Object){
            config.data = qs.stringify(config.data)
        }
    }
    return config
})
instance.interceptors.response.use((response)=>{
        Nprogress.done();
        return Promise.resolve(response.data)
},(error)=>{
    Nprogress.done();
    if(error.response.status===401){
        message.error('身份校验失败，即将重新登录',1);
        store.dispatch(Delete());
    }else message.error(error.message,1)
    return new Promise(()=>{})
})
export default instance