import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../config'
import React from 'react'
import { reqDelpic } from '../../api';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class Uploadpic extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [
     
    ],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ file,fileList }) => {
      if(file.status === 'done'){
        fileList[fileList.length-1].url = file.response.url;
        fileList[fileList.length-1].name = file.response.name;
      }
      if(file.status === 'removed'){
        reqDelpic(file.name).then((value)=>{
          if(value.state){
            message.error('删除失败')
          }else{
            message.success('成功删除')
          }
        })
      }
    this.setState({ fileList })
  };
  getImgs = ()=>{
    let imgs=[];
    this.state.fileList.forEach((value)=>{
      imgs.push(value.name)
    })
    return imgs;
  }
  setFileList=(imgs)=>{
    let arr = [];
    imgs.forEach((value,index)=>{
      arr.push({uid:-index,name:value,url:`${value}`})
    })
    this.setState({fileList:arr})
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          method="post"
          name="image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
export default Uploadpic