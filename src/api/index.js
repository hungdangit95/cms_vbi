import request from '@/utils/request'

export function GetListIpWhiteListByGroupId(groupId) {
  return request({
    url: '/api/CMS/get-white-list-ip-by-group-partner?groupPartnerId=' + groupId,
    method: 'GET'
  })
}

export function PostListIpWhiteList(data) {
  let info = {};
  if (data.id == 0 && data.status == 0) {
    info.ip = data.ip;
    info.grouptPartnerId = data.groupId
  }
  else {
    info.id = data.id;
    info.ip = data.ip;
    info.status = data.status;
    info.grouptPartnerId = data.groupId
  }
  return request({
    url: '/api/CMS/create-or-update-whitelistIp',
    method: 'POST',
    data: info
  })
}

