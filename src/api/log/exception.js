import request from '@/utils/request'

// Lấy danh sách API của sản phẩm
export function GetTotalException() {
    return request({
        url: '/api/Tracking/get-dashboard-exception-today',
        method: 'GET'
    })
}

// Lấy danh sách API của sản phẩm
export function GetListException(info) {
    return request({
        url: '/api/Tracking/search-and-paging-exception',
        method: 'POST',
        data: info
    })
}

// Lấy thông tin chi tiết của exception
export function GetDetailException(exceptionId) {
    return request({
        url: 'api/Tracking/get-detail-exception?id=' + exceptionId,
        method: 'GET'
    })
}

// Lấy thông tin chi tiết của exception theo thời gian
export function ReportRequestOrExceptionByTime(type) {
  return request({
    url: '/api/Tracking/report-request-or-exception-by-time?type=' + type,
    method: 'GET'
  })
}

