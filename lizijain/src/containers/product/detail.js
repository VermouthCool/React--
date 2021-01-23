import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Card,Button,Input,List} from 'antd'
import {reqInfo,reqCategory} from '../../api/index'
import {LeftOutlined} from '@ant-design/icons'
import './detail.less'
@connect(
    state=>({product:state.productdata,category:state.categorydata})
)
class Detial extends Component {
    state={
            name:'',
            imgs:[],
            detial:'',
            dec:'',
            price:'',
            categoryId:''
    }
    componentDidMount(){
        const {id} = this.props.match.params;
        var a = this.props.product;
        var b = this.props.category;
        if(a.length){
            var item = a.find((value)=>{
                return value._id == id;
            })
                var {name,imgs,detial,dec,price,categoryId} = item
                this.categoryId = categoryId
            this.setState({name,imgs,detial,dec,price,categoryId})
        }else{
            reqInfo(id).then((value)=>{
                var {name,imgs,detial,dec,price,categoryId} = value.data[0]
                this.categoryId = categoryId
            this.setState({name,imgs,detial,dec,price,categoryId})
            })
        }
        
        if(b.length){
            var c = b.find((value)=>{
                return value._id == this.categoryId;
            })
            this.name = c.name
        }else{
            reqCategory().then((value)=>{
                var c = value.data.find((item)=>{
                    return item._id === this.categoryId
                })
                this.name = c.name
                this.forceUpdate()
            })
        }
    }
    render() {
        let {Item} = List
        return (
            <>
            <Card title={
                <div className='left-top'>
                <Button type="link" onClick={()=>{this.props.history.goBack()}}><LeftOutlined style={{fontSize:'20px'}}/></Button>
                <span>商品详情</span>
                </div>
            }>
            <List>
                <Item>
                    <span className="prodName">商品名称：</span>
                    <span>{this.state.name}</span>
                </Item>
                <Item>
                    <span className="prodName">商品描述：</span>
                    <span>{this.state.dec}</span>
                </Item>
                <Item>
                    <span className="prodName">商品价格：</span>
                    <span>{this.state.price}</span>
                </Item>
                <Item>
                    <span className="prodName">所属分类：</span>
                    <span>{this.name}</span>
                </Item>
                <Item>
                    <span className="prodName imgs">商品图片：</span>
                    {
                        this.state.imgs.map((item,index)=>{
                            return <img key={index} src={item} style={{maxWidth:"250px",maxHeight:"250px"}} alt="商品图片"/>
                        })
                    }
                </Item>
                <Item>
                    <span className="prodName">商品详情：</span>
                    <span dangerouslySetInnerHTML={{__html:this.state.detial}}></span>
                </Item>
            </List>
            </Card>
            </>
        )
    }
}
export default Detial
