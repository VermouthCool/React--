export const login = value => {
    localStorage.setItem('user',JSON.stringify(value.data.user))
    localStorage.setItem('token',value.data.token);
    return {type:'login',data:value}
};
export const Delete = value => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return {type:'delete'}
};