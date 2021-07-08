import request from '@/utils/request'

// Lấy danh sách response
export function SearchAndPagingLogResponse(info) {
    return request({
        url: '/api/Tracking/search-and-paging-log-response',
        method: 'post',
        data: info
    })
}

// Lấy danh sách response
export function GetTopLogResponseSlowest() {
  return request({
    url: '/api/Tracking/get-top-log-response-slowest',
    method: 'post',
    data: {
      "pageIndex": 1,
      "pageSize": 10
    }
  })
}

// Lấy thông tin chi tiết của response
export function GetResponseLoggingByRequestId(requestId) {
  return request({
    url: '/api/Tracking/get-response-logging-by-request-id?requestId=' + requestId,
    method: 'GET'
  })
}
