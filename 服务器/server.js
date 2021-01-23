var express = require('express');
var router = require('./router.js');
var app = express();
app.use(express.urlencoded({extended:true}));
app.use(router);
app.use(express.static(__dirname+'/Upload'))
// app.use(express.static(__dirname+'/'))
app.listen(4000,(error)=>{
    console.log('端口号4000');
})