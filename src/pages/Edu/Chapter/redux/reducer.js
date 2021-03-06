import {
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
  BATCH_DEL_LESSON,
  BATCH_DEL_CHAPTER
} from './constant'

const initChapterList = {
  total: 0,
  items: []
}

export default function chapterList (prevState = initChapterList, action) {
  switch (action.type) {
    case GET_CHAPTER_LIST:
      action.data.items.forEach(item => {
        item.children = []
      })
      return action.data
    case GET_LESSON_LIST:
      //将课时添加到对应的章节的children中

      //1. 从返回的数据中,获取chapterId
      if (action.data.length > 0) {
        const chapterId = action.data[0].chapterId

        prevState.items.forEach(chapter => {
          if (chapter._id === chapterId) {
            chapter.children = action.data
          }
        })
      }
      return {
        ...prevState
      }
    case BATCH_DEL_CHAPTER:
      const chapterIds = action.data
      const newChapters = prevState.items.filter(chapter => {
        if (chapterIds.indexOf(chapter._id) > -1) {
          return false
        }
        return true
      })
      return {
        ...prevState,
        items: newChapters
      }


    case BATCH_DEL_LESSON:
      let lessonIds = action.data
      let chapterList = prevState.items
      chapterList.forEach(chapter => {
        const newChildren = chapter.children.filter(lesson => {
          if (lessonIds.indexOf(lesson._id) > -1) {
            return false
          }
          return true
        })
        chapter.children = newChildren
      })

      return {
        ...prevState,
        items: chapterList
      }

    default:
      return prevState
  }
}
