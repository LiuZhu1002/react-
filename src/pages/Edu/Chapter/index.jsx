import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import {
  FullscreenOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

import { connect } from "react-redux";
//导入知乎提供的视频播放组件
import Player from 'griffith'
//导入全屏的包
import screenfull from 'screenfull'

import SearchForm from "./SearchForm";
import {
  getLessonList,
  chapterList,
  batchDelChapter,
  batchDelLesson
} from './redux'
import "./index.less"

dayjs.extend(relativeTime)

@connect(
  state => ({
    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )
    chapterList: state.chapterList
  }),
  { getLessonList, batchDelChapter, batchDelLesson }
  // { getcourseList }
)
class Chapter extends Component {
  state = {
    searchLoading: false,
    previewVisible: false,
    previewImage: "",
    selectedRowKeys: [],
    video: ''
  }

  //viedo就是要预览的视频的路径
  showModal = video => () => {
    this.setState({
      previewVisible: true,
      video
    })
  }


  handleImgModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  componentDidMount () {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    this.getcourseList({ page, limit }).finally(() => {
      this.setState({
        tableLoading: false,
        page,
        limit,
      });
    });
  };

  getcourseList = ({ page, limit, Coursename, nickName }) => {
    return this.props
      .getcourseList({ page, limit, Coursename, nickName })
      .then((total) => {
        if (total === 0) {
          message.warning("暂无用户列表数据");
          return;
        }
        message.success("获取用户列表数据成功");
      });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys
    })
  }

  // handleClickExpand ray 定义的点击展开按钮的事件处理函数
  handleClickExpand = (expand, record) => {
    console.log(expand, record)
    // console.log(expand)
    if (expand) {
      // 发送请求获取数据
      this.props.getLessonList(record._id)
    }
  }

  //点击跳转到新增课时页面
  handleGoAddLesson = data => () => {
    this.props.history.push('/edu/chapter/addlesson', data)
  }

  //批量删除按钮的事件处理函数
  handleBatchDel = () => {
    Modal.confirm({
      title: '确定要批量删除嘛？',
      onOk: async () => {
        let chapterIds = [] //存储选中章节id
        let lessonIds = [] // 存储选中课时id

        //拿到所有的选中的id
        let selectedRowKeys = this.state.selectedRowKeys
        let chapterList = this.props.chapterList.items

        //遍历查找章节id
        chapterList.forEach(chapter => {
          let chapterId = chapter._id
          let index = selectedRowKeys.indexOf(chapterId)
          if (index > -1) {
            let newArr = selectedRowKeys.splice(index, 1)
            chapterIds.push(newArr[0])
          }
        })
        lessonIds = [...selectedRowKeys]
        // console.log(chapterIds)
        // console.log(selectedRowKeys)

        //需要定义异步接口，动议redux里面的代码
        await this.props.batchDelChapter(chapterIds)
        await this.props.batchDelLesson(lessonIds)
        message.success('批量删除成功')
      }
    })
  }

  //让整个页面全屏
  handlescreenFull = () => {
    screenfull.toggle()
  }

  render () {
    const { previewVisible, previewImage, selectedRowKeys } = this.state;

    const columns = [
      {
        title: "章节名称",
        dataIndex: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        render: isFree => {
          return isFree === true ? "是" : isFree === false ? "否" : "";
        }
      },
      {
        title: '视频',
        render: value => {
          if (!value.free) return
          return <Button onClick={this.showModal(value.video)}>预览</Button>
        }


      },
      {
        title: "操作",
        width: 300,
        fixed: "right",
        render: data => {
          // 如果是章节，章节数据中没有free属性，课时数据中有
          return (
            <div>
              {data.free === undefined && (
                <Tooltip title="新增课时">
                  <Button
                    type='primary'
                    onClick={this.handleGoAddLesson(data)}
                    style={{ marginRight: 10 }}
                  >
                    <PlusOutlined />
                  </Button>
                </Tooltip>
              )}

              <Tooltip
                title={data.free === undefined ? '更新章节' : '更新课时'}>
                <Button
                  type="primary"
                  style={{ margin: "0 10px" }}
                >
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip
                title={data.free === undefined ? '删除章节' : '删除课时'}>
                <Button type="danger">
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </div>
          );
        }

      },
    ];

    const sources = {
      hd: {
        play_url: this.state.video,
        bitrate: 1,
        duration: 1000,
        format: '',
        height: 500,
        size: 160000,
        width: 500
      }
    }

    const data = [
      {
        id: "111",
        title: "第一章节",
        children: [
          {
            id: "1",
            title: "第一课时",
            free: false,
            videoSourceId: "756cf06db9cb4f30be85a9758b19c645",
          },
          {
            id: "2",
            title: "第二课时",
            free: true,
            videoSourceId: "2a02d726622f4c7089d44cb993c531e1",
          },
          {
            id: "3",
            title: "第三课时",
            free: true,
            videoSourceId: "4e560c892fdf4fa2b42e0671aa42fa9d",
          },
        ],
      },
      {
        id: "222",
        title: "第二章节",
        children: [
          {
            id: "4",
            title: "第一课时",
            free: false,
            videoSourceId: "756cf06db9cb4f30be85a9758b19c645",
          },
          {
            id: "5",
            title: "第二课时",
            free: true,
            videoSourceId: "2a02d726622f4c7089d44cb993c531e1",
          },
          {
            id: "6",
            title: "第三课时",
            free: true,
            videoSourceId: "4e560c892fdf4fa2b42e0671aa42fa9d",
          },
        ],
      },
      {
        id: "333",
        title: "第三章节",
        children: [
          {
            id: "1192252824606289921",
            title: "第一课时",
            free: false,
            videoSourceId: "756cf06db9cb4f30be85a9758b19c645",
          },
          {
            id: "1192628092797730818",
            title: "第二课时",
            free: true,
            videoSourceId: "2a02d726622f4c7089d44cb993c531e1",
          },
          {
            id: "1192632495013380097",
            title: "第三课时",
            free: true,
            videoSourceId: "4e560c892fdf4fa2b42e0671aa42fa9d",
          },
        ],
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      //#region 
      // hideDefaultSelections: true,
      // selections: [
      //   Table.SELECTION_ALL,
      //   Table.SELECTION_INVERT,
      //   {
      //     key: "odd",
      //     text: "Select Odd Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return false;
      //         }
      //         return true;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   },
      //   {
      //     key: "even",
      //     text: "Select Even Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return true;
      //         }
      //         return false;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   }
      // ]
      //#endregion
    };

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>
        <div className="course-table">
          <div className="course-table-header">
            <h3>课程章节列表</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新增</span>
              </Button>
              <Button
                type="danger"
                style={{ marginRight: 10 }}
                onClick={this.handleBatchDel}
              >
                <span>批量删除</span>
              </Button>
              <Tooltip
                title="全屏"
                className="course-table-btn"
                onClick={this.handlescreenFull}
              >
                <FullscreenOutlined />
              </Tooltip>
              <Tooltip title="刷新" className="course-table-btn">
                <RedoOutlined />
              </Tooltip>
              <Tooltip title="设置" className="course-table-btn">
                <SettingOutlined />
              </Tooltip>
            </div>
          </div>
          <Alert
            message={
              <span>
                <InfoCircleOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {`已选择 ${selectedRowKeys.length} 项`}
              </span>
            }
            type="info"
            style={{ marginBottom: 20 }}
          />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.chapterList.items}
            rowKey="_id"
            expandable={{
              onExpand: this.handleClickExpand
            }}
          />
        </div>

        <Modal
          title='视频'
          visible={previewVisible}
          footer={null}
          // 点击modal的关闭按钮，触发这个函数
          onCancel={this.handleImgModal}
          destroyOnClose={true}
        >
          <Player
            sources={sources}// 必须有，定义预览视频的路径，多个视频源
            id={'1'}
            cover={'http://localhost:3000/logo512.png'}//视频封面
            duration={1000}
          >

          </Player>
        </Modal>
      </div>
    );
  }
}

export default Chapter
