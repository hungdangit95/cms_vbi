import request from '@/utils/request'

// Lấy thông tin biểu đồ
export function ReportQueueByTime() {
  return request({
    url: '/api/Tracking/report-queue-by-time',
    method: 'GET'
  })
}


export function ListErrorSignatures(params) {
  return request({
    url: '/api/Tracking/list-error-signatures/' + params.fromdate + '/' + params.todate,
    method: 'GET'
  })
}

export function ListErrorSMS(params) {
  return request({
    url: '/api/Tracking/list-error-sms/' + params.fromdate + '/' + params.todate,
    method: 'GET'
  })
}

export function ListErrorEmail(params) {
  return request({
    url: '/api/Tracking/list-error-email/' + params.fromdate + '/' + params.todate,
    method: 'GET'
  })
}

export function ReportQueueAndJob(params) {
  return request({
    url: '/api/Tracking/report-queue-and-job/' + params.fromdate + '/' + params.todate,
    method: 'GET'
  })
}

export function DownloadFileDataSignature(rabbitMQId) {
  return request({
    url: '/api/Tracking/download-file-data-signature?rabbitMQId=' + rabbitMQId,
    method: 'GET'
  })
}
