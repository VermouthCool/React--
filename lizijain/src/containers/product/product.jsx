import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Saveproduct} from '../../redux/actions/product.js'
import {Card,Button,Select,Input,Table,message} from 'antd'
import {reqProduct,reqUpdateproduct,reqSearch} from '../../api/index'
import {PlusOutlined,SearchOutlined} from '@ant-design/icons'
const {Option} = Select
@connect(
  state=>({productdata:state.productdata}),
  {
    Saveproduct
  }
)
class Product extends Component{
    state={
        product:[],
        total:0,
        current:1,
        keyword:'',
        searchType:'name',
        isLoading:true
    }
    handleChange=(value)=>{
        this.setState({searchType:value})
    }
    componentDidMount(){
        reqProduct(1,4).then((value)=>{
            this.setState({product:value.list,total:value.data.total,current:value.data.pageNum,isLoading:false})
            this.props.Saveproduct(value.list)
        })
    }
    table=(a=1)=>{
      if(this.isSearch){
        let {keyword,searchType} = this.state;
        reqSearch(a,4,searchType,keyword).then((value)=>{
        if(value.state){
          message.error('对不起，当前数据库内没有改商品的信息')
          this.setState({
            product:[],
            current:a,
            total:0,
            isLoading:false
          })
        }else{
          this.setState({
            product:value.list,
            current:a,
            total:value.data.total,
            isLoading:false
          })
          this.props.Saveproduct(value.list)
        }
      })
      }else{
        reqProduct(a,4).then((value)=>{
          this.setState({product:value.list,total:value.data.total,current:a,isLoading:false})
          this.props.Saveproduct(value.list)
      })
      }
    }
    input =(a)=>{
      this.setState({keyword:a.target.value})
    }
    search=()=>{
      this.isSearch =true;
      this.table();
    }
    update=(id,state)=>{
        reqUpdateproduct(id,state).then((value)=>{
            if(value){
                message.success('成功',1);
                var c = value
                var {product} = this.state
                var a ;
                product.filter((value,index)=>{
                    if(value._id === id){
                        a = index;
                    }
                })
                product[a].state = c.state;
                this.setState({product})
            }
        })
    }
    render() {
        const dataSource = this.state.product
          
          const columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
              key: 'name',
              width:'18%',
            },
            {
              title: '商品描述',
              dataIndex: 'dec',
              key: 'dec',
            },
            {
              title: '价格',
              dataIndex: 'price',
              key: 'price',
              align:'center',
              width:'9%',
              render:(a)=>{return '￥'+a}
            },
            {
              title: '状态',
            //   dataIndex: 'state',
              width:'10%',
              key: 'state',
              align:'center',
              render:(a)=>{return <>
                <Button type={a.state?"primary":"danger"} onClick={()=>{this.update(a._id,a.state)}}>{a.state?"上架":"下架"}</Button><br/>
                <span>{a.state?"已停售":"在售"}</span>
              </>}
            },
            {
              title: '操作',
              width:'10%',
              // dataIndex: 'opera',
              key: 'opera',
              align:'center',
              render:(a)=>{return <>
                <Button type='link'onClick= {()=>{this.props.history.push(`/admin/prod/product/detail/${a._id}`)}}>详情</Button><br/>
                <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod/product/add/${a._id}`)}}>修改</Button>
              </>}
            },
          ];
        return (
            <Card title={
                    <>
                <Select defaultValue="name" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="name">按名称搜索</Option>
                <Option value="miao">按描述搜索</Option>
                </Select>
                <Input prefix={<SearchOutlined />} 
                size="middle" placeholder="请输入" 
                style={{width:150,marginLeft:10,marginRight:10}}
                allowClear
                onChange={(a)=>{this.input(a)}}
                />
                <Button type="primary" onClick={this.search}><SearchOutlined></SearchOutlined>搜索</Button>
                    </>
            } 
            extra={ <Button type='primary' onClick={()=>{this.props.history.push('/admin/prod/product/add')}}><PlusOutlined></PlusOutlined>添加商品</Button> }>
          <Table dataSource={dataSource} 
            columns={columns} 
            bordered
            rowKey="_id"
            pagination={{
                pageSize:4,
                total:this.state.total,
                current:Number(this.state.current)
            }}
            onChange={(a)=>{this.table(a.current)}}
            loading={this.state.isLoading}
            />
            </Card>
        )
    }
}
export default Product