import React, { Component } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { reqGetQiniuToken } from '@api/edu/lesson'

import * as qiniu from 'qiniu-js'
import { nanoid } from 'nanoid'

const MAX_VIDEO_SIZE = 20 * 1024 * 1024

export default class MyUpload extends Component {

  //定义构造函数
  // 构造函数中只是从缓存中获取数据/定义状态
  constructor() {
    super()
    //一进来要从缓存中获取有没有token
    const str = localStorage.getItem('upload_token')

    if (str) {
      // 如果有，直接将缓存信息解析后给state赋值
      const res = JSON.parse(str)
      this.state = {
        expires: res.expires,
        uploadToken: res.uploadToken
      }
    } else {
      // 没有则初始化state
      this.state = {
        expires: 0,
        uploadToken: ''
      }
    }

  }

  // 上传视频之前调用
  handleBeforeUpload = (file, fileList) => {
    return new Promise(async (resolve, reject) => {
      // 在上传视频之前要做的两件事情
      //1. 限制视频大小
      //比如要限制的视频大小是20m
      //MAX_VIDEO_SIZE
      if (file.size > MAX_VIDEO_SIZE) {
        message.error('视频太大，不能超过20m')
        reject('视频太大，不能超过20m')
        //如果视频过大后面的代码不执行
        return
      }

      //在请求之前，只需要判断token是否过期
      if (Date.now() > this.state.expires) {
        //过期了就要重新获取
        const { uploadToken, expires } = await reqGetQiniuToken()

        //将数据储存起来
        //state里面有最新的数据，本地缓存中也有最新数据
        this.saveUploadToken(uploadToken, expires)
      }

      resolve(file)
    })
  }

  //储存uploadToken和过期时间的方法
  saveUploadToken = (uploadToken, expires) => {
    //1.发送请求获取数据
    //2.储存到本地缓存中
    const targetTime = Date.now() + expires * 1000 - 2 * 60 * 1000
    expires = targetTime
    const upload_token = JSON.stringify({ uploadToken, expires })
    localStorage.setItem('upload_token', upload_token)
    //3. 储存到state里面
    this.setState({
      uploadToken, expires
    })
  }

  //真正上传视频时调用，这个函数会覆盖默认上传方式
  handleCustomRequest = value => {
    console.log(value)

    //要上传的文件对象
    const file = value.file
    //key 新定义的文件名 尽可能不要重复
    const key = nanoid(10)//生成一个长度为10的id,保证是唯一的
    // token 就是七牛云返回的token
    const token = this.state.uploadToken
    //putExtra 上传的额外配置项  可以配置上传文件的类型
    // 可以上传所有格式的视频
    // 后台限制上传文件的类型，不是视频，就不能上传
    const putExtra = {
      mimeType: 'video/*'
    }

    // config 配置项 可以控制上传到哪个区域
    const config = {
      region: qiniu.region.z2
    }

    const observable = qiniu.upload(
      file, // 上传的文件
      key,//最终上传之后的文件资源名 (保证唯一) 使用nanoid库,生成这个key
      token,//上传验证信息，前端通过接口请求后端获得
      putExtra,
      config)

    // 创建上传过程中触发回调函数的对象
    const observer = {
      //上传过程中触发的回调函数
      next (res) {
        console.log(res)
        //由于res.total是一个对象，并且有percent属性，所以可以显示进度条
        value.onProgress(res.total)
      },
      //上传失败触发的回调函数
      error (err) {
        console.log(err)
        // 上传失败，调用onError，会展示一个错误的样式
        value.onError(err)
      },
      //上传成功触发的回调函数
      complete: res => {
        console.log(res)
        //上传成功会调用，展示一个上传成功的样式
        value.onSuccess(res)
        // 注意：解决视频上传成功，表单验证不通过的问题
        // 手动调用Form.Item传过来onChange方法，onChange方法传入需要表单控制的数据
        // 未来要给本地服务器存储的实际上就是 上传视频成功的地址
        //地址：自己七牛云空间的域名 + 文件名
        this.props.onChange('http://qdcdb1qpp.bkt.clouddn.com/' + res.key)
      }
    }
    // 开始上传
    this.subscription = observable.subscribe(observer)
  }

  // 如果组件卸载，上传取消
  componentWillUnmount () {
    this.subscription && this.subscription.unsubscribe()
    // 上传取消
  }

  render () {
    return (
      <div>
        <Upload
          beforeUpload={this.handleBeforeUpload}
          customRequest={this.handleCustomRequest}
          // 前端控制上传视频的类型，不是视频文件，就看不到
          accept='video/*'
        >
          <Button>
            <UploadOutlined /> 上传视频
          </Button>
        </Upload>
      </div>
    )
  }
}
