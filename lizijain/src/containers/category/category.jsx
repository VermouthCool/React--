import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Savecategory} from '../../redux/actions/category'
import { Card ,Button,Table,message,Modal,Input,Form} from 'antd';
import {reqCategory,reqAddcategory,reqUpdatecategory} from '../../api/index'
import {PlusOutlined} from '@ant-design/icons'
@connect(
  state=>({}),{
    Savecategory
  }
)
class Category extends Component{
    state={
        category:[],
        visible:false,
        opertype:'',
        isLoading:true,
        currentValue:'',
        currentId:''
    }
    componentDidUpdate(){

    }
    showModal = () => {
      this.setState({visible:true,opertype:'新增',currentValue:'请输入想要添加的类名'})
    };
    showUpdate = (item) => {
      this.setState({visible:true,opertype:'修改',currentValue:item.name,currentId:item._id});
    };

    handleOk = () => {
      if(this.form.current.getFieldValue('username')){//检查是否输入合法
        if(this.state.opertype === '新增'){//增加时执行
        reqAddcategory(this.form.current.getFieldValue('username')).then(
          (value)=>{
            if(value.state){
              message.error(value.mes)
              
            }else{
              message.success('添加成功')
              let category = [...this.state.category];
              category.unshift(value.data);
              this.form.current.resetFields()
              this.setState({category,visible:false});
              
            }
          }
        )
        }else{//修改开始
          reqUpdatecategory(this.form.current.getFieldValue('username'),this.state.currentId).then((value)=>{
            if(value.state){
              message.error(value.mes);
            }else{
              message.success('成功修改了该分类');
              var category = [...this.state.category];
              var i;
              var item = category.filter((value,index)=>{
                  if(value._id==this.state.currentId){
                    i = index
                  }
              })
              category[i].name=this.form.current.getFieldValue('username');
              this.form.current.resetFields()
              this.setState({visible:false,category});
              
            }
          })
        }
        
      }else{//输入不合法
        message.error('请输入对话框的内容');
        this.form.current.resetFields()
      }
    };
    handleCancel = () => {
      this.setState({visible:false})
      this.form.current.resetFields();
    };
    getCategory= async()=>{
        let result = await reqCategory();
        this.setState({isLoading:false})
        if(result.state){
            message.error('身份验证已经过期，请重新登录')
        }else{
            this.setState({category:result.data.reverse()})
            //把商品的分类信息放进去redux
            this.props.Savecategory(result.data)
        }
    }
    componentDidMount(){
        this.getCategory()
    }
    render() {
        const dataSource = this.state.category;
          this.form = React.createRef();
          const columns = [
            {
              title: '分类名',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '操作',
              // dataIndex: '_id',
              key: 'juti',
              render:(key)=>{return <> <Button type='link' onClick={()=>{this.showUpdate(key)}}>修改分类</Button> </> },
              width:'25%',
              align:'center'
            },
          ];
        return (
            <Card title="分类管理" extra={<Button type='primary' onClick={this.showModal}><PlusOutlined />添加</Button>}>
                <Table bordered={true} loading={this.state.isLoading} dataSource={dataSource} columns={columns} rowKey='_id' pagination={{pageSize:5,showQuickJumper:true}}/>
                <Modal title={`${this.state.opertype}分类`} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} okText="确定" cancelText='取消'>
                <Form ref={this.form} >
                        <Form.Item name='username' rules={[{required:true,message:"我亲爱的舍友请输入" },
                        ]}>
                            <Input style={{color:'rgba(0,0,0,.5)'}}  placeholder={this.state.currentValue}/>
                        </Form.Item>
                        </Form>
                </Modal>
            </Card>
        )
    }
}
export default Category