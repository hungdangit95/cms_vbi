import request from '@/utils/request'
export function GetWorkUnit() {
  return request({
    url: '/api/CMS/get-work-unit',
    method: 'GET'
  })
}
export function GetDeparmentByUnitId(unitId) {
  return request({
    url: '/api/CMS/get-deparment-by-unit-id?id=' + unitId,
    method: 'GET'
  })
}

export function GeEmployeeByDepartmentId(departmentId) {
  return request({
    url: '/api/CMS/get-employee-by-department-id?id=' + departmentId,
    method: 'GET'
  })
}

export function GetListAgencyCustomer(key) {
  return request({
    url: '/api/CMS/get-agency-customer?key=' + key,
    method: 'GET'
  })
}

export function GetSwaggerJson() {
  return request({
    url: '/swagger/v1/swagger.json',
    method: 'GET'
  })
}


export function BindTreeModelSwaggerJson(path, modelJson) {
  var paths = path.split("/");
  var model = modelJson[paths[paths.length - 1]];
  if (model.properties != undefined) {
    var properties = Object.getOwnPropertyNames(model.properties)
    var json = new Array();
    properties.map(function (k, v) {
      if (model.properties[k]["type"] == undefined) {
        if (k == "direction") {
          json.push({ name: k, type: 'integer' });
        }
        else {
          var p = model.properties[k]["allOf"][0]["$ref"];
          if(p != undefined){
            p = p.substring(2, p.length);
            var _aBody = BindTreeModelSwaggerJson(p, modelJson);
            json.push({ name: k, type: 'object', body: _aBody });
          }
          
        }
      }
      else if (model.properties[k]["type"] == 'array') {
        var p = model.properties[k]["items"]["$ref"];
        if(p != undefined){
          p = p.substring(2, p.length);
          var _aBody = BindTreeModelSwaggerJson(p, modelJson);
          json.push({ name: k, type: model.properties[k]["type"], body: _aBody });
        }
      }
      else {
        json.push({ name: k, type: model.properties[k]["type"] });
      }
    })
    return json;
  }
}

export function SyncApiDocument(info) {
  let data = {
    apiDocumentModels: info
  }
  return request({
    url: '/api/CMS/sync-apidocument',
    method: 'POST',
    data: data
  })
}

export function GetListApiDocument() {
  return request({
    url: '/api/CMS/get-all-api-document',
    method: 'GET'
  })
}

export function PostApiDocumentDescription(info) {
  return request({
    url: '/api/CMS/create-api-document-description',
    method: 'POST',
    data: info
  })
}

export function PutApiDocumentDescription(info, idApi) {
  return request({
    url: '/api/CMS/update-api-document-description/'+idApi,
    method: 'PUT',
    data: info
  })
}

export function GetListFieldApiDocumentDescriptionById(id) {
  return request({
    url: '/api/CMS/get-api-document-description/'+ id,
    method: 'GET'
  })
}