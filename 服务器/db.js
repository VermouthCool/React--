var express = require('express');
var mongo = require('mongoose');
mongo.connect('mongodb://localhost:27017/demo',{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
mongo.connection.on('open',(error)=>{
    if(!error){
        console.log('成功连接数据库');
    }
})
var Schema = mongo.Schema;
var rule1 = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    create_time:{
        type:Date,
        default:Date.now()
    },
    role_id:{
        type:String,
        required:true
    }
})
var rule2 = new Schema({
    name:{
        type:String,
        required:true
    }
})
var rule3 = new Schema({
    state:Number,
    imgs:Array,
    detial:String,
    name:String,
    dec:String,
    price:String,
    categoryId:String
})
var rule4 = new Schema({
    name:String,
    menu:{
        type:Array,
        default:[]
    },
    create_time:{
        type:String,
        default:new Date().getFullYear()+'年 '+new Date().getMonth()+1+'-'+new Date().getDate()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()
    },
    auth_time:{
        type:String,
        default:''
    },
    auth_name:{
        type:String,
        default:''
    }
})
var users = mongo.model('users',rule1);
exports.users = users;
exports.store = mongo.model('category',rule2);
exports.product = mongo.model('product',rule3);
exports.role = mongo.model('role',rule4);