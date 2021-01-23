let user;
try {
    user = JSON.parse(localStorage.getItem('user'));
} catch (error) {
    user=''
}
let token = localStorage.getItem('token');
let init = {
    user:user || "",
    token:token || "",
    isLogin:user && token ? true:false
};
export default function (pre=init,action){
    let {type,data} = action;
    let a;
    switch (type) {
        case 'login':
            a= {user:data.data.user,token:data.data.token,isLogin:true};
            return a;
            break;
            case 'delete':
            return {user:'',token:'',isLogin:false}
            break;
        default:
            break;
    }
    return pre;
}