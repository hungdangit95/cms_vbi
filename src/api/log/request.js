import request from '@/utils/request'

// Lấy danh sách request
export function searchAndPagingLogRequest(info) {
    return request({
      url: '/api/Tracking/search-and-paging-log-request',
        method: 'post',
        data: info
    })
}

// Lấy thông tin chi tiết của request
export function GetRequestLoggingByRequestId(requestId) {
  return request({
    url: '/api/Tracking/get-request-logging-by-request-id?requestId=' + requestId,
    method: 'GET'
  })
}
