import request from '@utils/request'

const BASE_URL = '/admin/edu/subject'

// const MOCK_URL = `http://localhost:8888${BASE_URL}`

//获取课程
export function reqGetSubjectList (page, limit) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  });
}