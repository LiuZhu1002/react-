const express = require('express')
const Mock = require('mockjs')
const app = express()

const Random = Mock.Random
// 返回中文标题
Random.ctitle()

// 解决跨域
// use是express中的一个中间件
app.use((req, res, next) => {
  //设置响应头
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Headers', 'content-type,token')
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  //调用下一个中间件
  next()
})

app.get('/admin/edu/subject/:page/:limit', (req, res) => {
  let { page, limit } = req.params
  // 利用mock，创建虚拟数据
  const data = Mock.mock({
    // total表示分类列表总共有多少条数据
    // 需求：返回的total的值是一个在指定返回内的随机整数
    // 注意：limit从浏览器中获取的，是 一个字符串
    total: Random.integer(+limit + 2, limit * 2),
    [`item|${limit}`]: [
      {
        '_id+1': 1,
        title: '@ctitle(2,5)',
        parentId: 0
      }
    ]
  })

  res.json({
    code: 20000,
    success: true,
    data,
    message: ''
  })
})

app.listen(8888, (err) => {
  if (err) {
    return console.log('服务启动失败')
  }
  console.log('服务器启动成功，8888端口监听中...')
})

