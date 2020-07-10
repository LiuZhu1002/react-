import React, { Component } from "react";
// 导入antd组件
import { Button, Table } from 'antd'
// 导入antd图标组件
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined

} from '@ant-design/icons'
//导入connect
import { connect } from 'react-redux'

// 导入定义的发送请求的方法
// import { reqGetSubjectList } from '@api/edu/subject'
// 导入redux中的异步action
import { getSubjectList } from
  './redux'
// 导入样式文件
import './index.css'


const columns = [
  // columns 定义表格的列
  // title属性:表示列的名称
  // dataIndex决定：这一列展示的是data中哪一项的数据
  { title: '分类名称', dataIndex: 'title', key: 'title' },
  {
    title: '操作',
    dataIndex: '',// 表示这一列不渲染data里的数据
    key: 'x',
    // 自定义这一列要渲染的内容
    render: () => (
      <>
        <Button type='primary' className='update-btn'>
          <FormOutlined />
        </Button>
        <Button type='danger'>
          <DeleteOutlined />
        </Button>
      </>
    ),
    // 设置这列的宽度
    width: 200
  },
]
const data = [
  {
    key: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: 3,
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    key: 4,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
]
@connect(state => ({ subjectList: state.subjectList }), { getSubjectList })
class Subject extends Component {
  // 给当前组件实例添加cerrentPage属性，表示当前第几页
  currentPage = 1


  componentDidMount () {
    // this.getSubjectList(1, 10)
    this.props.getSubjectList(1, 10)
  }
  // //获取subject数据的方法
  // getSubjectList = async (page, limit) => {
  //   const res = await reqGetSubjectList(page, limit)
  //   console.log(res)

  //   this.setState({
  //     subject: res
  //   })
  // }
  // 点击页码，获取对应页的数据
  handlePageChange = (page, pageSize) => {
    //发送请求
    // this.props.getSubjectList(page, pageSize)
    this.props.getSubjectList(page, pageSize)

    //动态给currentPage赋值，保证当前高亮的页码和实际获取的页码数据保持一致
    this.currentPage = page
  }

  handleSizeChange = (current, size) => {
    // this.props.getSubjectList(current, size)
    this.props.getSubjectList(current, size)

    //动态给currentPage赋值，保证当前高亮的页码和实际获取的页码数据保持一致
    this.currentPage = current
  }

  render () {
    return (
      <div className='Subject'>
        <Button type="primary" className='Subject-btn'><PlusOutlined />新建</Button>
        <Table
          // 控制列
          columns={columns}
          // 控制可展开项
          expandable={{
            //可展开项的内容
            expandedRowRender: record => (<p style={{ margin: 0 }}>{record.description}</p>),
            // 控制这一列是否可展开
            rowExpandable: record => record.name !== 'Not Expandable'
          }}
          // 表示里面的数据
          dataSource={this.props.subjectList.items}
          // 告诉Table组件,使用数据中_id作为key值
          rowKey='_id'
          pagination={{
            total: this.props.subjectList.total, //total表示数据总数
            showQuickJumper: true, //是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数据数量
            pageSizeOptions: ['5', '10', '15', '20'], //设置每页显示数据数量的配置项
            // defaultPageSize:5, //每页默认显示数据条数 默认是10,
            onChange: this.handlePageChange,
            onShowSizeChange: this.handleSizeChange,
            current: this.currentPage
          }}
        />
      </div>
    )
  }
}

export default Subject