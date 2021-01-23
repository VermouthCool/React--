var express = require('express');
var DB = require('./db');
var crypto = require('crypto')
var jwt = require('jsonwebtoken');
var querystring = require('querystring');
var iconv = require('iconv-lite')
// var formidable = require('f')
var fs = require('fs');
var app = new express.Router();
// app.use(express.json());
function create_token(leng){
    leng = leng==undefined?32:leng	//如果没设置token长度自动为32位
 //预设随机字符串
 let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789'
 let token = ''
 //以长度单位进行循环
 for(let i=0;i<leng;++i){
     token+=chars.charAt(Math.floor(Math.random()*chars.length))
 }
 return token	///返回之前使用md5加密一下
}
app.post('/login',(req,res)=>{
    let {username,password} = req.body;
    DB.users.findOne({'username':`${username}`,"password":crypto.createHash('sha1').update(password,'utf8').digest('hex')},(error,data)=>{
        if(!error){
            if(!data){
                res.send({state:1,mes:'账号或密码输入有误'})
            }else{
                var p = ''
                DB.role.findOne({_id:data.role_id},(err,jian)=>{
                    if(jian){
                        p = jian.menu;
                    }
                    var decode = jwt.sign({username},'jian',{expiresIn:'7d'})
               var a = {state:0,"data":{
                   user:{
                       username:data.username,
                       create_time:data.create_time,
                       role:p
                   },
                   token:decode,
               }}
                res.send(a);
                })
            }
        }else{
            console.log(error);
        }
        
    })
})
//manage/category/list获取商品分类 get
function token(req,res,next){
    var a = req.headers.autologin;
    if(!a){
        res.sendStatus(401);
        return
    }
    a = a.slice(5);
    jwt.verify(a,'jian',(err,data)=>{
        if(err){
            res.send({state:1,mes:'身份验证过期'})
        }else{
            next()
        }
    })
}
// app.get('/manage/category/list',token,(req,res)=>{
//  DB.store.find({},(err,data)=>{
//                     res.send({state:0,data})
// });
// }
app.get('/manage/category/list',token,(req,res)=>{
     DB.store.find({},(err,data)=>{
            res.send({state:0,data})
});
})
app.post('/manage/category/add',(req,res)=>{
    let {categoryName} = req.body;
    DB.store.findOne({name:categoryName},(err,data)=>{
        if(data){
            res.send({state:1,mes:'该分类已经存在'})
        }else{
            DB.store.create({name:categoryName},(err,data)=>{
                if(err){
                    res.send({state:1,mes:'请求失败'})
                }else{
                    res.send({
                        state:0,
                        data
                    })
                }
            })
        }
    })
})
app.post('/manage/category/update',(req,res)=>{
    let {categoryName,categoryId} = req.body;
    DB.store.findOne({name:categoryName,_id:categoryId},(err,data)=>{
        if(data){
            res.send({state:1,mes:'该分类已经存在'})
        }else{
            DB.store.update({_id:categoryId},{name:categoryName},(err,data)=>{
                if(err){
                    res.send({state:1,mes:'请求失败'})
                }else{
                    res.send({
                        state:0,
                        data
                    })
                }
            })
        }
    })
})
/*
{
    state:0,
    data:{
        pageNum:1,
        total:12,
        pages:3,
        pageSize:5
    },
    list:[
        {
            state:1,
            img:[""]
        
        _id:,
        name:
        des:
        price:
        category:
        detial:
        },
    ]
}
*/
app.get('/manage/product/list',token,(req,res)=>{
    var {num,size} = req.query;
    var pageNum = num;
    var pageSize = size;
    DB.product.find({},(err,a)=>{
        // res.send({state:0,data:{pageNum,pageSize,total:a.length,pages:(a.length-1)%pageSize},list:a})
        var jian = a.length%pageSize;
            if(!jian){
                    var list =[];
                    for(var i=0;i<pageSize;i++){
                        list[i] = a[(pageNum-1)*pageSize+i]
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:a.length/pageSize},
                        list
                    })
            }else{
                var list=[];
                var j = 0;
                if(pageNum == parseInt(a.length/pageSize)+1){
                    for(var i=(a.length)-(pageNum-1)*pageSize;i>0;i--){
                        list[j] = a[a.length-i];
                        j++;
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:parseInt(a.length/pageSize)+1},
                        list
                    })
                }else{
                    for(var i=0;i<pageSize;i++){
                        list[i] = a[pageSize*(pageNum-1)+i];
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:parseInt(a.length/pageSize)+1},
                        list
                    })
                }
            }
    })
})
app.post('/manage/product/update',token,(req,res)=>{
    var id = req.body.id;
    var state = req.body.state
    if(Number(state)){
        state = 0;
    }else{
        state = 1
    }
    DB.product.updateOne({_id:id},{state},(err,data)=>{
        if(err){
            console.log(err);
        }
    })
    res.send({state})
})
app.get('/manage/product/search',token,(req,res)=>{
    let {num,size,type,keyword} = req.query;
    var pageNum = num;
    var pageSize = size
    var rex = new RegExp(keyword,'ig')
    if(type === 'name'){
        DB.product.find({name:rex},(err,a)=>{
            if(!err){
                if(!a.length){
                    res.send({state:1,mes:'没有该商品'})
                    return
                }
                var jian = a.length%pageSize;
            if(!jian){
                    var list =[];
                    for(var i=0;i<pageSize;i++){
                        list[i] = a[(pageNum-1)*pageSize+i]
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:a.length/pageSize},
                        list
                    })
            }else{
                var list=[];
                var j = 0;
                if(pageNum == parseInt(a.length/pageSize)+1){
                    for(var i=(a.length)-(pageNum-1)*pageSize;i>0;i--){
                        list[j] = a[a.length-i];
                        j++; 
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:parseInt(a.length/pageSize)+1},
                        list
                    })
                }else{
                    for(var i=0;i<pageSize;i++){
                        list[i] = a[pageSize*(pageNum-1)+i];
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:parseInt(a.length/pageSize)+1},
                        list
                    })
                }
            }
        }
        })
    }else{
        DB.product.find({dec:rex},(err,a)=>{
            if(!err){
                if(!a.length){
                    res.send({state:1,mes:'没有该商品'})
                    return
                }
                var jian = a.length%pageSize;
            if(!jian){
                    var list =[];
                    for(var i=0;i<pageSize;i++){
                        list[i] = a[(pageNum-1)*pageSize+i]
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:a.length/pageSize},
                        list
                    })
            }else{
                var list=[];
                var j = 0;
                if(pageNum == parseInt(a.length/pageSize)+1){
                    for(var i=(a.length)-(pageNum-1)*pageSize;i>0;i--){
                        list[j] = a[a.length-i];
                        j++; 
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:parseInt(a.length/pageSize)+1},
                        list
                    })
                }else{
                    for(var i=0;i<pageSize;i++){
                        list[i] = a[pageSize*(pageNum-1)+i];
                    }
                    res.send({state:0,
                        data:{pageNum,pageSize,total:a.length,pages:parseInt(a.length/pageSize)+1},
                        list
                    })
                }
            }
        }
        })
    }
})
app.get('/manage/product/Info',token,(req,res)=>{
    var {id} = req.query;
    DB.product.find({_id:id},(err,data)=>{
        res.send({state:0,data})
    })
})
app.post('/manage/img/upload',(req,res)=>{
    let msg='';
    let fileName;
          // 接收到数据消息
        //   req.headers.acceptencoding = 'gzip, deflate'
        req.setEncoding('binary');
        var boundary = req.headers['content-type'].split('; ')[1].replace('boundary=','');
          req.on('data',(chunk)=>{
            if(chunk){
              msg+=chunk;
            }
          })
          // 接收完毕
          req.on('end',()=>{
            // 对buffer数组阵列列表进行buffer合并返回一个Buffer
            let buf=msg;
            var file = querystring.parse(buf, '\r\n', ':');
            var fileInfo = file['Content-Disposition'].split('; ');
            for (value in fileInfo){
                if (fileInfo[value].indexOf("filename=") != -1){
                fileName = fileInfo[value].substring(10, fileInfo[value].length-1);
                if (fileName.indexOf('\\') != -1){
                fileName = fileName.substring(fileName.lastIndexOf('\\')+1);
                }
                fileName = iconv.decode(fileName,'utf-8').toString('gbk')
            }
            }

            var entireData = buf.toString();
            var contentTypeRegex = /Content-Type: image\/.*/;
            
            contentType = file['Content-Type'].substring(1);

             //获取文件二进制数据开始位置，即contentType的结尾
            var upperBoundary = entireData.indexOf(contentType) + contentType.length;
            var shorterData = entireData.substring(upperBoundary);
            
            // 替换开始位置的空格
            var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            
            // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
            var binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--'+boundary+'--'));
            
            
            // // 替换开始位置的空格
            // var binaryDataAlmost = shorterData.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            
            // // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
            // var binaryData = binaryDataAlmost.substring(0, binaryDataAlmost.indexOf('--'+boundary+'--'));
            // // var entiredata = buf.toString();
            // // var contentTypeRegex = /Content-Type: image\/.*/;
            var time = Date.now()
            fs.writeFile( __dirname+'/Upload/'+time+fileName, binaryData, 'binary', function(err) {
                res.send({name:time+fileName,url:'http://localhost:4000/'+time+fileName});
               });
          })   
})
app.post('/manage/img/delete',(req,res)=>{
    let {name} = req.body;
    fs.unlink(__dirname+'/Upload/'+name,(err)=>{
        if(err){
            res.send({state:1,mes:'没有该图片'})
        }else{
            res.send({state:0,mes:'成功删除'})
        }
    })
})
app.post('/manage/product/add',token,(req,res)=>{
    let {categoryId,name,dec,price,imgs,detial} = req.body;
    DB.product.create({categoryId,name,dec,price,imgs,detial,state:0},(err,data)=>{
        if(!err){
            res.send({state:0})
        }else{
            res.send({state:1})
        }
    })
})
app.post('/manage/product/upd',token,(req,res)=>{
    let {categoryId,name,dec,price,imgs,detial,_id} = req.body;
    var c = _id
    DB.product.updateOne({_id:c},{categoryId,name,dec,price,imgs,detial},()=>{
        res.send({state:0})
    })
})
app.get('/manage/role/list',token,(req,res)=>{
    DB.role.find({},(err,data)=>{
        if(!err){
            res.send({state:0,data})
        }
    })
})
app.post('/manage/role/add',token,(req,res)=>{
    var name = req.body.rolename;
    DB.role.create({name},(err,data)=>{
        if(!err){
            res.send({state:0,data});
        }else{
            console.log(err);
        }
    })
})
app.post('/manage/role/update',token,(req,res)=>{
    let {_id,auth_name,auth_time,menu} = req.body;
    DB.role.updateOne({_id},{auth_name,auth_time,menu},(err,data)=>{
        if(!err){
            res.send({state:0})
        }
    })
})
app.get('/manage/user/role',token,(req,res)=>{
    var a=[],b=[];
    DB.users.find({},(err,data)=>{
        data.shift();
        a=data
        DB.role.find({},(err,data)=>{
        b = data;
        res.send({state:0,
            user:a,
            role:b
        })
    })
    })
})
app.post('/manage/user/add',token,(req,res)=>{
    let {username,password,role_id} = req.body
    DB.users.find({username},(err,data)=>{
        if(data.length){
            res.send({state:1,mes:'该用户已经存在'})
        }else{
            password = ''+password
            DB.users.create({
                username,
                password:crypto.createHash('sha1').update(password,'utf8').digest('hex'),
                role_id
            },(err,data)=>{
                res.send({
                    state:0,
                    data
                })
            })
        }
    })
})
module.exports = app;