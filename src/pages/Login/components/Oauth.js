import React, { Component } from 'react'
import { loginSuccessSync } from '@redux/actions/login'
import { connect } from 'react-redux'

@connect()

class Oauth extends Component {
  componentDidMount () {
    //1.从浏览器地址栏把token的值切出去
    const token = window.location.search.split('=')[1]
    //2. 把token存储到redux中
    // 调用成功的同步action
    this.props.dispatch(loginSuccessSync({ token }))
    //3. 把token存储到本地缓存中
    localStorage.setItem('use_token', token)
    //4. 跳转到首页
    this.props.history.replace('/')
  }
  render () {
    return <div>git授权登录</div>
  }
}
export default Oauth
