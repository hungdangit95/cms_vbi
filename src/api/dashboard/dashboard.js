import request from '@/utils/request'

// Thống kê tổng số đối tác theo trang thái
export function DashboardPartnerByStatus(obj) {
  return request({
    url: 'api/CMS/dashboard-partner-by-status/' + obj.fromdate + '/' + obj.todate,
    method: 'GET'
  })
}

// Danh sách đối tác mới được phê duyệt
export function NewPartnerApproved(obj) {
  return request({
    url: 'api/CMS/new-partner-approved/' + obj.fromdate + '/' + obj.todate,
    method: 'GET'
  })
}

// Thống kê 10 đầu api được call nhiều nhất
export function GetTheTenApiMostCalled(obj) {
  return request({
    url: 'api/CMS/get-the-ten-api-most-called/'+ obj.fromdate + '/' + obj.todate,
    method: 'GET'
  })
}
