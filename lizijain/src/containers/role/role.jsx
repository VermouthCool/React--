import { Button, Card ,Modal,Table,Form,Input,message,Tree} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import React, { Component}  from 'react'
import {connect} from 'react-redux'
import menuList from '../../config/menu.js'
import { reqAddrole, reqRolelist, reqUpdaterole } from '../../api';
@connect(
    state=>({username:state.logindata.user.username})
)
class Role extends Component{
    state={
        isModalVisible:false,
        xiu:false,
        rolelist:[],
        checkedKeys:['product'],
        menuList
    }
    componentDidMount(){
        reqRolelist().then((value)=>{
            this.setState({rolelist:value.data})
        })
    }
    handleOk = () => {
        if(this.state.isModalVisible){
            if(this.form.current.getFieldValue('rolename')){
            reqAddrole(this.form.current.getFieldValue('rolename')).then((value)=>{
                reqRolelist().then((value)=>{
                    this.setState({rolelist:value.data})
                })
            })
            this.setState({isModalVisible:false})
            this.form.current.resetFields()
            }else{
                message.error('请输入对话框的内容')
                this.form.current.resetFields()
            }
        }else{
            let {checkedKeys} = this.state;
            let {username} = this.props;
            reqUpdaterole({_id:this.id,menu:checkedKeys,auth_name:username}).then((value)=>{
                message.success('授权成功');
                reqRolelist().then((value)=>{
                    this.setState({rolelist:value.data})
                })
            })
            this.setState({xiu:false})
        }
    };
    
    handleCancel = () => {
        if(this.state.isModalVisible){
            this.form.current.resetFields()
            this.setState({isModalVisible:false})
        }else{

            this.setState({xiu:false})
        }
    };
       onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({
            checkedKeys
        });
      };
      
      /*
menu:[],
_id:'',
name:'',
create_time:'',
auth_name:'',
auth_time:''
*/
      render(){
        let dataSource = this.state.rolelist
        this.form = React.createRef();
        const columns = [
          {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'age',
          },
          {
            title: '授权时间',
            dataIndex: 'auth_time',
            key: 'address',
          },
          {
            title: '授权人',
            dataIndex: 'auth_name',
            key: 'whogive',
          },
          {
            title: '设置权限',
          //   dataIndex: 'menu',
            key: 'oper',
            render:(item)=>{
                      return   <>
                    <Button type='link' onClick={()=>{
                        this.setState({xiu:true});this.id=item._id;
                        var a = this.state.rolelist.find((value)=>{
                            return value._id == this.id
                        })
                        this.setState({checkedKeys:a.menu})
                        }}>
                            设置权限
                            
                        </Button>
                        <Modal title="权限修改" visible={this.state.xiu} onOk={this.handleOk} onCancel={this.handleCancel}>
                        <Tree
                        checkable
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        treeData={treeData}
                        defaultExpandAll
                        />
                        </Modal>
                        </>
                
            }
          },
        ];
        let treeData = [{
            title:'全部权限',
            key:'0',
            children:this.state.menuList
        }];

          return (
            <div>
                <Card title={
                    <div>
                        <Button type="primary" onClick={()=>{this.setState({isModalVisible:true})}}>
                        <PlusOutlined/>添加角色
                    </Button>
                    <Modal title="Basic Modal" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form  onFinish = {this.finish} ref={this.form}>
                        <Form.Item name='rolename' rules={[{required:true,message:"我亲爱的舍友请输入" },
                        ]}>
                            <Input style={{color:'rgba(0,0,0,.5)'}} />
                        </Form.Item>
                        </Form>
                    </Modal>
                    </div>
                }>

                <Table dataSource={dataSource} columns={columns} pagination={{defaultPageSize:4}}/>;
                </Card>
            </div>
        )
      }
        
}
export default Role