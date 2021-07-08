import request from '@/utils/request'
import requestFormData from '@/utils/request-file'

// Lấy danh sách nhóm đối tác theo điểu kiện filter
export function listGroupPartner(info) {
    return request({
        url: '/api/CMS/search-and-pagging-partner-group',
        method: 'post',
        data: info
    })
}

// Lấy danh sách tất cả nhóm đối tác
export function listAllGroupPartner() {
    return request({
        url: '/api/CMS/get-all-group-partner',
        method: 'GET'
    })
}

// Cập nhật thông tin đối tác
export function postPartner(info) {
    return request({
        url: '/api/CMS/create-or-update-partner',
        method: 'post',
        data: info
    })
}

// Lấy thông tin nhóm đối tác
export function getGroupPartnerInfo(groupId) {
    return request({
        url: '/api/CMS/get-group-partner-by-id?id=' + groupId,
        method: 'GET'
    })
}

// Lấy danh sách sản phẩm
export function getListProduct() {
    return request({
        url: '/api/CMS/get-list-product',
        method: 'GET'
    })
}

// Lấy danh sách đối tác
export function listPartner(info) {
    return request({
        url: '/api/CMS/search-and-pagging-partner',
        method: 'post',
        data: info
    })
}

// Lấy danh sách đại lý đối tác
export function GetSuperiorPartner(groupId, partnerId) {
    return request({
        url: '/api/CMS/get-superior-partner?groupId=' + groupId + "&partnerId=" + partnerId,
        method: 'GET'
    })
}

// Lấy thông tin đối tác
export function GetPartnerInfo(partnerId) {
    return request({
        url: '/api/CMS/get-partner-detail-by-id?id=' + partnerId,
        method: 'GET'
    })
}

// Cập nhật danh sách sản phẩm cho nhóm đối tác
export function UpdateProductsOfGroupPartner(info) {
    return request({
        url: '/api/CMS/add-or-update-group-partner-product',
        method: 'POST',
        data: info
    })
}

// Cập nhật danh sách API cho sản phẩm
export function UpdateProductApiDocument(info) {
    return request({
        url: '/api/CMS/add-or-update-product-api-documnet',
        method: 'POST',
        data: info
    })
}

// Update thông tin nhóm đối tác
export function UpdateGroupPartner(info) {
    return request({
        url: '/api/CMS/add-or-update-group-partner',
        method: 'POST',
        data: info
    })
}

// Lấy danh sách API của sản phẩm
export function GetListApiDocumentOfProduct(productId) {
    return request({
        url: '/api/CMS/get-api-by-product?id=' + productId,
        method: 'GET'
    })
}

// Lấy danh sách API của sản phẩm
export function GetTotalException(type) {
    return request({
        url: '/api/Tracking/get-dashboard-exception-today?type=' + type,
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

// update trang thai doi tac
export function UpdateStatusPartner(partnerId, info) {
    return request({
        url: '/api/CMS/update-status-partner/' + partnerId,
        method: 'PUT',
        data: info
    })
}

// Upload file
export function UploadFile(groupId, nv, printTemplateType, ProcedureName, file) {
    let bodyFormData = new FormData()
    bodyFormData.append('GrouptId', groupId)
    bodyFormData.append('NV', nv)
    bodyFormData.append('PrintTemplateType', printTemplateType)
    bodyFormData.append('ProcedureName', ProcedureName)
    bodyFormData.append('File', file)
    return requestFormData({
        url: '/api/CMS/upload-print-template',
        method: 'POST',
        data: bodyFormData
    })
}

// get giay chung nhan theo groupID
export function getGCNByGroupID(groupID) {
    return request({
        url: '/api/CMS/get-print-form-by-partner-group-id?partnerGroupId=' + groupID,
        method: 'GET'
    })
}

// get list business partner
export function getListBusinessPartner(groupID) {
    return request({
        url: '/api/CMS/get-list-business-partner?partner=' + groupID,
        method: 'GET'
    })
}

// get list package
export function getListPackage(serviceCode, gender) {
    let genderParam = gender ? '&gender=' + gender : ''
    let url = '/api/CMS/get-list-package?serviceCode=' + serviceCode + genderParam
    return request({
        url: url,
        method: 'GET'
    })
}

// submit form insurance
export function managePackagePartner(data) {
    return request({
        url: '/api/CMS/manage-package-partner',
        method: 'POST',
        data: data
    })
}

// get list insurance of partner 
export function getListPackageOfPartner(groupId, serviceCode) {
    return request({
        url: '/api/CMS/get-list-package-of-partner?partnerCode=' + groupId + '&serviceCode=' + serviceCode,
        method: 'GET',
    })
}