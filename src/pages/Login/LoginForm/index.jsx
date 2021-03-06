import React, { Component, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login } from "@redux/actions/login";
import { reqGetverifyCode } from '@api/acl/oauth'

import "./index.less";

const { TabPane } = Tabs;


function LoginForm (props) {
  const [form] = Form.useForm()

  const [isShowDownCount, setIsShowDownCount] = useState(false)
  let [downCount, setDownCount] = useState(5)
  const [activeKey, setActivekey] = useState('user')

  // 登录按钮 点击事件的事件处理函数
  const onFinish = () => {
    // 1. 判断当前这个登录按钮，是用户名密码登录还是手机登录
    if (activeKey === 'user') {
      //校验用户名和密码
      form.validateFields(['username', 'password']).then(res => {
        let { username, password } = res
        props.login(username, password).then(token => {
          // 登录成功
          // console.log("登陆成功~");
          // 持久存储token
          localStorage.setItem("user_token", token);
          props.history.replace("/");
        });
      })
    } else {
      //校验手机号和验证码
      //校验用户名和密码
      form.validateFields(['phone', 'verify']).then(res => {
        let { phone, verify } = res
        props.mobileLogin(phone, verify).then(token => {
          localStorage.setItem("user_token", token);
          props.history.replace("/");
        })
      })
    }

    // .catch(error => {
    //   notification.error({
    //     message: "登录失败",
    //     description: error
    //   });
    // });
  };

  // antd 中第二种校验方式
  const validator = (rules, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        return reject('必须填写用户名密码')
      }
      if (value.length < 4) {
        return reject('至少填写4个字符')
      }
      if (value.length > 16) {
        return reject('最多16个字符')
      }
      if (!/^[a-z0-9A-Z_]+$/.test(value)) {
        return reject('只能填写数字、字母、下划线')
      }
      resolve()
    })
  }

  //获取验证码事件处理函数
  const getVerifyCode = async () => {
    //1.手动触发表单的校验，只有校验通过了，才能执行后续的代码

    const res = await form.validateFields(['phone'])
    // 如果验证不成功，后面的就不执行，成功了后面的代码就可以执行
    // console.log('成功', res);
    // 2. 给开发者服务器发送请求
    // 注意:为了节省开支,获取验证码的代码,测试一次之后,最好注释掉,手机登录所有逻辑完成再打开

    await reqGetverifyCode(res.phone)
    //如果后面的代码可以执行，说明验证码请求成功了

    //3. 当请求发出去之后，按钮应该展示倒计时，并且倒计时的过程中，按钮不能点击
    // 点击获取验证码之后，让按钮禁用，然后展示倒计时
    setIsShowDownCount(true)
    // 定义一个计时器，修改倒计时的时间
    let timeId = setInterval(() => {
      // 修改倒计时的时间
      downCount--
      setDownCount(downCount)
      if (downCount <= 0) {
        // 清除定时器
        clearInterval(timeId)
        // 取消按钮禁用
        setIsShowDownCount(false)
        // 恢复倒计时事件
        setDownCount(5)
      }
    }, 1000)
  }

  //tab切换触发的事件处理函数
  const handleTabChange = activeKey => {
    setActivekey(activeKey)
  }
  //git 第三方授权登录点击事件
  const gitOauthLogin = () => {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=ecc1abb87bcf40588f1d'
  }

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        //将form实例和Form组件关联起来
        form={form}
      >
        <Tabs
          defaultActiveKey="user"
          tabBarStyle={{ display: "flex", justifyContent: "center" }}
          onChange={handleTabChange}
        >
          <TabPane tab="账户密码登陆" key="user">
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '必填项'
                },
                {
                  min: 4,
                  message: '用户名最少4位'
                },
                {
                  max: 16,
                  message: '不能炒股16位'
                },
                {
                  pattern: /^[0-9a-zA-Z]+$/,
                  message: '只能输入数字自摸下划线'
                }

              ]
              }>
              <Input
                prefix={<UserOutlined className="form-icon" />}
                placeholder="用户名: admin"
              />
            </Form.Item>
            <Form.Item
              name="password"
              // antd 表单校验第二种方式
              rules={[{ validator }]}
            >
              <Input
                prefix={<LockOutlined className="form-icon" />}
                type="password"
                placeholder="密码: 111111"
              />
            </Form.Item>
          </TabPane>
          <TabPane tab="手机号登陆" key="phone">
            <Form.Item
              name="phone"
              rules={[
                {
                  required: true,
                  message: '请输入手机号'
                },
                {
                  pattern: /^1[3456789]\d{9}$/,
                  message: '请输入正确的手机号'
                }

              ]}>
              <Input
                prefix={<MobileOutlined className="form-icon" />}
                placeholder="手机号"
              />
            </Form.Item>

            <Row justify="space-between">
              <Col span={16}>
                <Form.Item
                  name="verify"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码'
                    },
                    {
                      pattern: /^[\d]{6}$/,
                      message: '请输入验证码'
                    }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="form-icon" />}
                    placeholder="验证码"
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Button
                  className="verify-btn"
                  onClick={getVerifyCode}
                  disabled={isShowDownCount}
                >
                  {isShowDownCount ? `${downCount}秒后获取` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <Row justify="space-between">
          <Col span={7}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>自动登陆</Checkbox>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Button type="link">忘记密码</Button>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            // htmlType="submit"
            className="login-form-button"
            onClick={onFinish}
          >
            登陆
            </Button>
        </Form.Item>
        <Form.Item>
          <Row justify="space-between">
            <Col span={16}>
              <span>
                其他登陆方式
                  <GithubOutlined className="login-icon"
                  onClick={gitOauthLogin}
                />
                <WechatOutlined className="login-icon" />
                <QqOutlined className="login-icon" />
              </span>
            </Col>
            <Col span={3}>
              <Button type="link">注册</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );

}

export default withRouter(
  connect(
    null,
    { login }
  )(LoginForm)
)
