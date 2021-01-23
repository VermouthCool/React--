import React, { Component } from 'react'
import {Form,Input,Card,Button,Select,message} from 'antd'
import {LeftOutlined} from '@ant-design/icons'
import Upload from './Upload'
import { connect } from 'react-redux'
import { reqAddprod, reqCategory, reqInfo ,reqUpdateprod} from '../../api'
import EditorConvertToHTML from './wenben'
const {Item} = Form
const {Option} = Select
@connect(
    state=>({category:state.categorydata,product:state.productdata})
)
class Add extends Component {
    state={
        category:[],
        name:'',
        categoryId:'',
        price:'',
        dec:'',
        detial:'',
        imgs:[],
        _id:''
    }
    componentDidMount(){
        const {id} = this.props.match.params
        if(this.props.category.length){
            this.category = this.props.category
            this.setState({category:this.props.category})
        }else{
            reqCategory().then((value)=>{
                this.category = value.data
                this.setState({category:value.data.reverse()})
            })
        }
        if(id){
            if(!this.category){
                reqCategory().then((value)=>{
                    this.category = value.data;
                    this.title = '更新'
            if(this.props.product.length){
                var result = this.props.product.find((value)=>{
                    return value._id == id
                })
                if(result) {
                    this.setState({...result})
                    
                    var c = this.category.find((value)=>{
                        return value._id == result.categoryId
                    })
                    this.select = c.name;
                    this.forceUpdate()
                    this.imgs.setFileList(result.imgs);
                    this.editor.setText(result.detial)
                }
            }else{
                reqInfo(id).then((value)=>{
                    this.setState({...value.data[0]})
                    var c = this.category.find((a)=>{
                        return a._id == value.data[0].categoryId
                    })
                    
                    this.imgs.setFileList(value.data[0].imgs);
                    this.select = c.name;this.forceUpdate()
                    this.editor.setText(value.data[0].detial)
                })
            }
                })
            }else{
                this.title = '更新'
            if(this.props.product.length){
                var result = this.props.product.find((value)=>{
                    return value._id == id
                })
                if(result) {
                    this.setState({...result})
                    
                    var c = this.category.find((value)=>{
                        return value._id == result.categoryId
                    })
                    this.select = c.name;
                    this.forceUpdate()
                    this.imgs.setFileList(result.imgs);
                    this.editor.setText(result.detial)
                }
            }else{
                reqInfo(id).then((value)=>{
                    this.setState({...value.data[0]})
                    var c = this.category.find((a)=>{
                        return a._id == value.data[0].categoryId
                    })
                    
                    this.imgs.setFileList(value.data[0].imgs);
                    this.select = c.name;this.forceUpdate()
                    this.editor.setText(value.data[0].detial)
                })
            }
            }
            
        }else{
            this.title = '新增'
        }
            
    }
    finish=()=>{
        var value = this.form.getFieldsValue();
        value.imgs=this.imgs.getImgs();
        value.detial = this.editor.getText();
        let {_id} = this.state
        if(this.props.match.params.id){
            reqUpdateprod({...value,_id}).then((value)=>{
                if(value.state){
                    message.error('修改失败')
                }else{
                    message.success('成功修改');
                    this.props.history.replace('/admin/prod/product')
                }
            })
        }else{
            reqAddprod(value).then((value)=>{
                if(value.state){
                    message.error('添加失败')
                }else{
                    message.success('成功添加');
                    this.props.history.replace('/admin/prod/product')
                }
            })
        }
    }
    render() {
        return (
            <div>
                <Card title={
                    <div className='left-top'>
                    <Button type="link" onClick={()=>{this.props.history.goBack()}}><LeftOutlined style={{fontSize:'20px'}}/>返回</Button>
                    <span>{this.title}商品</span>
                    </div>
                }>
                    <Form onFinish={this.finish} ref={(form)=>this.form=form}>
                        <Item label="商品名称" name="name" rules={[{required:true,message:'必须输入商品名称'}]}>
                            <Input placeholder={this.state.name||'商品名称'} style={{width:"230px"}}>
                            
                            </Input>
                        </Item>
                        <Item label="商品描述" name="dec" initialValue={this.state.dec} rules={[{required:true,message:'必须输入商品描述'}]}>
                            <Input placeholder={this.state.dec||"商品描述"} style={{width:"630px"}}>

                            </Input>
                        </Item>
                        <Item label="商品价格" name="price" initialValue={this.state.price} rules={[{required:true,message:'必须输入商品描述'}]}>
                            <Input type="number" placeholder={this.state.price||'商品价格'} style={{width:"230px"}} prefix="￥" addonAfter="RMB">

                            </Input>
                        </Item>
                        <Item label="商品分类" name="categoryId" rules={[{required:true,message:'必须选择商品分类'}]}>
                        <Select
                            placeholder={this.select||"请选择下面的分类"}
                            // onChange={onGenderChange}
                            allowClear
                            style={{width:"630px"}}
                            name="jian"
                        >
                        {
                            this.state.category.map((value)=>{
                                return <Option key={value._id} value={value._id}>{value.name}</Option>
                            })
                        }
                        </Select>
                        </Item>
                        <Item label="商品图片" name="imgs">
                            <Upload ref={(a)=>this.imgs=a}/>
                        </Item>
                        <Item label="商品详情" name="detail">
                            <EditorConvertToHTML ref={a=>this.editor=a}></EditorConvertToHTML>
                        </Item>
                        <Button type='primary' htmlType="submit">
                                提交
                        </Button>
                    </Form>
                </Card>
            </div>
        )
    }
}
export default Add