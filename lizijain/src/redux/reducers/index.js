import {combineReducers} from 'redux'
import login from './login'
import title from './title'
import product from './product'
import category from './category'
export default combineReducers({
    logindata:login,
    titledata:title,
    productdata:product,
    categorydata:category
})