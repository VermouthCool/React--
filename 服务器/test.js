// var express = require('express');
// var https = require('https');
// var cheerio = require('cheerio')
// var app = express();
// let arr = [];
// function filter(a){
//     var $ = cheerio.load(a);
//     console.log(a);
//     $('.productPrice').each((index,value)=>{
//         console.log($(value).text());
//     })
//     // arr.forEach((value)=>{
//     //     category.create({name:value},(err,data)=>{
//     //         if(!err){
//     //             console.log(data);
//     //         }
//     //     })
//     // })
// }
// app.listen(8080,()=>{
//     let data = '';
//     https.get('https://list.tmall.com/search_product.htm?q=%CA%D6%BB%FA&type=p&vmarket=&spm=875.7931836%2FB.a2227oh.d100&from=mallfp..pc_1_searchbutton',(result)=>{
//         result.on('data',(chunk)=>{
//             data+=chunk
//             console.log('*************');
//         })
//         result.on('end',()=>{
//           console.log('----------');
//             filter(data)
//         })
//     })
// })

// // var express = require('express');
// // var jwt = require('jsonwebtoken');
// // var app = express();
// // app.get('/api' , (req,res) => {
// //     res.json({
// //         'status': 200,
// //         'msg' : '访问成功'
// //     });
// // });
// // const user = {
// //     name:"jian",
// //     age:18
// //   }
// // app.get('/', (req, res) => {
// //     /*
// //         iss:签发人
// //         iat:签发时间回溯30s
// //         exp:过期时间 这里可是使用秒数,也可以使用day
// //         "{"jti":1,"iss":"gumt.top","user":"goolge","iat":1555650413,"exp":1555657613}"
// //         "iat": ~~(Date.now() / 1000)-30,
// //         "exp": ~~(Date.now() / 1000)+(60*60),
// //     */
// //   /*第一个参数你的数据，口令，配置信息*/
// //     jwt.sign(user,"jian",{ expiresIn: '7d' },(err,token) => {
// //         res.json({
// //             token
// //         })
// //     })
// // });

// // app.get('/login',verifyToken,(req,res) => {
// //   jwt.verify(req.token, 'jian', (err, authData) => {
// //       console.log(err);
// //     if(err) {
// //        res.sendStatus(403);
// //       } else {
// //         res.json({
// //           message: 'Post created...',
// //           authData
// //         });
// //      }
// //   });
// // });
// // function verifyToken(req, res, next) {
// //   const bearerHeader = req.headers['authorization'];
// //   console.log(req.headers['authorization']);
// //   if(typeof bearerHeader !== 'undefined') {
// //     const bearer = bearerHeader.split(' ');
// //     const bearerToken = bearer[1];
// //     req.token = bearerToken;
// //     next();
// //   } else {
// //     res.sendStatus(403);
// //   }
// // }
// // app.listen(8080,()=>{

// // })
// var express = require('express');
// var app = express();
// var cheerio = require('cheerio')
// var https = require('https');
// function filter(a){
//     var $ = cheerio.load(a);
//     $('.p-name em').each((index,value)=>{
//         console.log($(value).text());
//     })
    // arr.forEach((value)=>{
    //     category.create({name:value},(err,data)=>{
    //         if(!err){
    //             console.log(data);
    //         }
    //     })
    // })
// }
// app.listen(8080,()=>{
//     let data = '';
//     https.get('https://search.jd.com/Search?keyword=家居&enc=utf-8&suggest=1.def.0.base&wq=shouji&pvid=e9ff8309684b492793a443a87c1e48f7',(result)=>{
//         result.on('data',(chunk)=>{
//             data+=chunk
//         })
//         result.on('end',()=>{
//             filter(data)
//         })
//     })
// })
var a =  require('crypto');
console.log(a.createHash('sha1').update('123456','utf8').digest('hex'));