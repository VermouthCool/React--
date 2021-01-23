import { Button, Card ,Modal,Table,Form,Input,message,Select} from 'antd'
import {reqAdduser, reqUserList} from '../../api'
import {PlusOutlined,UserOutlined,LockOutlined} from '@ant-design/icons'
import React, { Component }  from 'react'
const {Option} = Select;
export default class User extends Component{
    state={
      xiu:false,
      userList:[],
      roleList:[]
    }
    componentDidMount(){
      reqUserList().then((value)=>{
        this.roleList = value.role
        this.setState({userList:value.user,roleList:value.role})
      })
    }
    showModal = () => {
      this.setState({xiu:true});
      };
    
      handleOk = () => {
          this.form.submit()
      };
    
      handleCancel = () => {
        this.setState({xiu:false})
        this.form.resetFields()
      };
      finish=()=>{
        reqAdduser(this.form.getFieldsValue()).then((value)=>{
          if(value.state){
            message.error(value.mes)
          }else{
          reqUserList().then((value)=>{
            this.setState({userList:value.user})
          })
          }
        })
        this.form.resetFields()
        this.setState({xiu:false});
      }
      
      
      render(){
        let dataSource = this.state.userList
        const columns = [
          {
            title: '用户名称',
            dataIndex: 'username',
            key: 'name',
          },
          {
            title: '用户密码',
            dataIndex: 'password',
            key: 'age',
          },
          {
            title:'所属角色',
            // dataIndex:'role_id',
            key:'_id',
            render:(a)=>{
              var c = this.state.roleList.find((value)=>{
                return value._id == a.role_id
              })
              if(c) return c.name
            }
          },
          {
            title: '操作',
            // dataIndex: 'oper',
            key: 'oper',
            align:'center',
            render:()=>{return <>
              <Button type="link" style={{marginRight:'10px'}}>修改</Button>
              <Button type="link">删除</Button>
            </>}
          },
        ];
        const {Item} = Form
        return (
            <div>
                <Card title="用户管理" extra={
                  <>
                    <Button type='primary' onClick={this.showModal}><PlusOutlined />添加用户</Button>
                    <Modal title="添加用户" visible={this.state.xiu} onOk={this.handleOk} onCancel={this.handleCancel}>
                      <Form ref={a=>this.form = a} onFinish={this.finish}>
                        <Item label='用户名' name="username" rules={[{required:true,message:"我亲爱的舍友请输入nin的骚名"},
                        {max:12,message:'你他妈叫这名吗？这么长！重新输'},
                        {min:2,message:'确定不长点吗？重输'},
                        {pattern:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/,message:'不行'}
                        ]}>
                            <Input 
                                prefix={<UserOutlined style={{color:'rgba(0,0,0,.5)'}}/>}
                                placeholder={this.state.name||'用户名'}
                            />
                        </Item>
                        <Item label='password' name="password" rules={[{required:true,message:'得输'},{validator:(rule,value,callback)=>{
                            if(!value){
                                // callback('你得输密码啊')
                            return Promise.reject('你得输密码啊')
                            }else if(value.length<4){
                                // callback('太短了')
                               return Promise.reject('太短了')
                            }else if(value.length>12){
                                // callback('太长了')
                               return Promise.reject('太长了')
                            }else if(!/^[0-9]+$/.test(value)){
                                // callback('你觉得你输的那些符号能往这里输吗')
                               return Promise.reject('你觉得你输的那些符号能往这里输吗')
                            }
                            // callback();
                            return Promise.resolve();
                        }}]}>
                            <Input 
                                prefix={<LockOutlined style={{color:'rgba(0,0,0,.5)'}}/>}
                                placeholder={this.state.password||'密码'}
                                type="password"
                            />
                        </Item>
                        <Item label="角色" name="role_id" rules={[{required:true,message:'必须选择'}]}>
                          <Select placeholder={this.state.select||'请输入'}>
                            {
                              this.state.roleList.map((value)=>{
                                return <Option key={value._id} value={value._id} children={value.name}></Option>
                              })
                            }
                          </Select> 
                        </Item>
                      </Form>
                    </Modal>
                  </>
                }>

                <Table dataSource={dataSource} columns={columns} pagination={{defaultPageSize:4}} rowKey="_id"/>;
                </Card>
            </div>
        )
      }
        
}