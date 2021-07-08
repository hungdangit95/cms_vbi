<template>
  <div class="container">
    <div class="left-board">
      <div class="logo-wrapper">
        <div class="logo">
          <img :src="logo" alt="logo" /> Danh sách sản phẩm
        </div>
      </div>
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div class="components-title">
            <svg-icon icon-class="component" />Sản phẩm
          </div>
          <draggable
            class="components-draggable"
            :list="products"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            draggable=".components-item"
            :sort="false"
          >
            <div
              v-for="(element, index) in products"
              :key="index"
              v-bind:class="element.isActive ? 'components-item-acvtive' : ''"
              class="components-item"
              @click="handleClickItemProduct(element)"
            >
              <div class="components-body">
                <b>{{ element.nv }}</b>
                - {{ element.ten }}
              </div>
            </div>
          </draggable>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <el-scrollbar class="center-scrollbar">
        <el-row style="padding:10px">
          <el-col>
            <el-form ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="Tên API" prop="userName">
                <el-input
                  v-model="query_search"
                  placeholder="Tên api"
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="cyan"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                >Tìm kiếm</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">Làm mới</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row style="padding:10px">
          <el-col>
            <el-table
              v-loading="loading"
              :data="apis"
              @selection-change="handleSelectionChangeListApis"
              class="table-list-partner"
            >
              <el-table-column type="selection" width="55" align="center">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.isCheck"
                      @change="handleCheckProductApiChange(scope.row)"
                    ></el-checkbox>
                  </template>
              </el-table-column>
              <el-table-column label="Đường dẫn" align="left" prop="endpoint" width="400" />
              <el-table-column label="Tên API" align="left" prop="name" width="400" />
            </el-table>
          </el-col>
        </el-row>

        <el-row style="margin-left:10px;">
          <el-col>
            <el-button
                  type="cyan"
                  icon="el-icon-add"
                  size="mini"
                  @click="handleUpdateListProductForProduct"
                >Cập nhật API</el-button>
          </el-col>
        </el-row>

      </el-scrollbar>
    </div>

    
    <div class="right-board">
      <div class="logo-wrapper">
        <div class="logo">
          <svg-icon icon-class="icon-log" />API được cài đặt
        </div>
      </div>
      <div class="components-item"><div class="components-body product-active"><svg-icon icon-class="component" /> <b>{{nvProductSelect}}</b> - {{tenProductSelect}} </div></div>
      <div v-for="o in apiSelected" :key="o.id" class="text item item_ip">
         {{ o.endpoint }}
      </div>
    </div>
  </div>
</template>

<script>
import { getListProduct, UpdateProductApiDocument, GetListApiDocumentOfProduct } from "@/api/partner/partner.js";
import { GetListApiDocument } from "@/api/common/common.js";
import draggable from "vuedraggable";
import logo from "@/assets/logo/logo.png";


export default {
  components: {
    draggable,
  },
  data() {
    return {
      query_search: '',
      loading: true,
      nvProductSelect : '',
      tenProductSelect: '',
      logo,
      products: [],
      apis: [],
      apiSelected: [],
    };
  },
  created() {
    this.listProduct();
  },
  methods: {
    listProduct() {
      getListProduct().then((res) => {
        this.products = res.result;
        this.products.map(function(k,v){
          k.isActive = false;
        });
        this.nvProductSelect = this.products[0].nv;
        this.tenProductSelect = this.products[0].ten;
        this.listApi();
      });
    },
    listApi() {
      GetListApiDocument().then((res) => {
        let listApis = [];
        let apiSelected = [];
        GetListApiDocumentOfProduct(this.nvProductSelect).then((r) => {
          if(!r.isError && r.statusCode == 200){
            apiSelected = r.result;
            res.result.map(function(k,v){
              let isCheck = true;
              let _indexOf = apiSelected.findIndex(x => x.endpoint === k.endpoint);
              if(_indexOf < 0) isCheck = false;
              listApis.push({ id: k.id, endpoint: k.endpoint, createdDate: k.createdDate, 
                commonStatus: k.commonStatus,bodyJson: k.bodyJson, isCache:k.isCache, isSync:k.isSync,
                limitCount: k.limitCount,method:k.method,name:k.name, parammeters:k.parammeters,summary:k.summary,tags: k.tags, timeCache:k.timeCache, isCheck:isCheck
              });
            
            });
            this.apis = listApis;
            this.apiSelected = apiSelected;
          }
          this.loading = false;
        });
      });
    },

    handleSelectionChangeListApis(selection) {
      this.apis.map(function(k,v){
        let _indexOf = -1;
        if(selection.length <=0) _indexOf = -1;
        else { _indexOf = selection.findIndex(x => x.endpoint === k.endpoint);}
        if(_indexOf < 0) k.isCheck = false;
        else {
          k.isCheck = true;
        }
      });
      this.apiSelected = selection;
    },

    handleCheckProductApiChange(selection){
      let _apiSelected = [];
      this.apis.map(function (value, key) {
        if (value.endpoint == selection.endpoint) {
          value.isCheck = selection.isCheck;
        }
        if(value.isCheck){
          _apiSelected.push({id: value.id, endpoint: value.endpoint});
        }
      });
      this.apiSelected = _apiSelected;
    },

    resetQuery(){

    },
    handleQuery(){},
    
    handleClickItemProduct(item) {
        this.products.map(function(k,v){
          k.isActive = false;
          if(k.nv == item.nv){
            k.isActive = true;
          }
        })
        this.nvProductSelect = item.nv;
        this.tenProductSelect = item.ten;
        let listApis = [];
        let apiSelected = [];
        GetListApiDocumentOfProduct(this.nvProductSelect).then((r) => {
          if(!r.isError && r.statusCode == 200){
            apiSelected = r.result;
             this.apis.map(function(k,v){
              let isCheck = true;
              let _indexOf = apiSelected.findIndex(x => x.endpoint === k.endpoint);
              if(_indexOf < 0) isCheck = false;
              listApis.push({ id: k.id, endpoint: k.endpoint, createdDate: k.createdDate, 
                commonStatus: k.commonStatus,bodyJson: k.bodyJson, isCache:k.isCache, isSync:k.isSync,
                limitCount: k.limitCount,method:k.method,name:k.name, parammeters:k.parammeters,summary:k.summary,tags: k.tags, timeCache:k.timeCache, isCheck:isCheck
              });
            });
            this.apis = listApis;
            this.apiSelected = r.result
          }
        });
    },
    // Cập nhật danh sách API cho sản phẩm
    handleUpdateListProductForProduct(){
      let _endpoints = [];
      this.apiSelected.map(function(k,v){
        _endpoints.push(k.endpoint);
      });
      let data = {
        productId: this.nvProductSelect,
        apiDocumentEndpoint: _endpoints
      }
      UpdateProductApiDocument(data).then((res) => {
        if(!res.isError && res.statusCode == 200){
          this.msgSuccess("Cập nhật danh sách api cho sản phẩm thành công");
        }
        else{
          this.msgError(res.mesage);
        }
      });
    },
  },
};
</script>

<style lang='scss'>
.item_ip {
    color: brown;
    padding: 1px 10px;
    background: #f6f7ff;
    font-size: 12px;
    margin: 10px;
    border-radius: 3px;
    text-align: left;
}
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 3px;
  .field-box {
    position: relative;
    height: calc(100vh - 42px);
    box-sizing: border-box;
    overflow: hidden;
  }
  .el-scrollbar {
    height: 100%;
  }
}
body,
html {
  margin: 0;
  padding: 0;
  background: #fff;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
}

input,
textarea {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
}

.editor-tabs {
  background: #121315;
  .el-tabs__header {
    margin: 0;
    border-bottom-color: #121315;
    .el-tabs__nav {
      border-color: #121315;
    }
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
    color: #888a8e;
    border-left: 1px solid #121315 !important;
    background: #363636;
    margin-right: 5px;
    user-select: none;
  }
  .el-tabs__item.is-active {
    background: #1e1e1e;
    border-bottom-color: #1e1e1e !important;
    color: #fff;
  }
  .el-icon-edit {
    color: #f1fa8c;
  }
  .el-icon-document {
    color: #a95812;
  }
}

// home
.right-scrollbar {
  .el-scrollbar__view {
    padding: 12px 18px 15px 15px;
  }
}
.left-scrollbar .el-scrollbar__wrap {
  box-sizing: border-box;
  overflow-x: hidden !important;
  margin-bottom: 0 !important;
}
.center-tabs {
  .el-tabs__header {
    margin-bottom: 0 !important;
  }
  .el-tabs__item {
    width: 50%;
    text-align: center;
  }
  .el-tabs__nav {
    width: 100%;
  }
}
.reg-item {
  padding: 12px 6px;
  background: #f8f8f8;
  position: relative;
  border-radius: 4px;
  .close-btn {
    position: absolute;
    right: -6px;
    top: -6px;
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    z-index: 1;
    cursor: pointer;
    font-size: 12px;
    &:hover {
      background: rgba(210, 23, 23, 0.5);
    }
  }
  & + .reg-item {
    margin-top: 18px;
  }
}
.action-bar {
  & .el-button + .el-button {
    margin-left: 15px;
  }
  & i {
    font-size: 20px;
    vertical-align: middle;
    position: relative;
    top: -1px;
  }
}

.custom-tree-node {
  width: 100%;
  font-size: 14px;
  .node-operation {
    float: right;
  }
  i[class*="el-icon"] + i[class*="el-icon"] {
    margin-left: 6px;
  }
  .el-icon-plus {
    color: #409eff;
  }
  .el-icon-delete {
    color: #157a0c;
  }
}

.left-scrollbar .el-scrollbar__view {
  overflow-x: hidden;
}

.el-rate {
  display: inline-block;
  vertical-align: text-top;
}
.el-upload__tip {
  line-height: 1.2;
}

$selectedColor: #f6f7ff;
$lighterBlue: #409eff;

.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.components-list {
  padding: 8px;
  box-sizing: border-box;
  height: 100%;
  .components-item {
    display: inline-block;
    width: 48%;
    margin: 1%;
    transition: transform 0ms !important;
  }
}
.components-draggable {
  padding-bottom: 20px;
}
.components-title {
  font-size: 14px;
  color: #222;
  margin: 6px 2px;
  .svg-icon {
    color: #666;
    font-size: 18px;
  }
}

.components-body {
  padding: 8px 10px;
  background: $selectedColor;
  font-size: 12px;
  cursor: move;
  border: 1px dashed $selectedColor;
  border-radius: 3px;
  .svg-icon {
    color: #777;
    font-size: 15px;
  }
  &:hover {
    border: 1px dashed #787be8;
    color: #787be8;
    .svg-icon {
      color: #787be8;
    }
  }
}

.left-board {
  width: 260px;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
}
.left-scrollbar {
  height: calc(100vh - 42px);
  overflow: hidden;
}
.center-scrollbar {
  height: calc(100vh - 42px);
  overflow: hidden;
  border-left: 1px solid #f1e8e8;
  border-right: 1px solid #f1e8e8;
  box-sizing: border-box;
}
.center-board {
  height: 100vh;
  width: auto;
  margin: 0 350px 0 260px;
  box-sizing: border-box;
}
.empty-info {
  position: absolute;
  top: 46%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  color: #ccb1ea;
  letter-spacing: 4px;
}
.action-bar {
  position: relative;
  height: 42px;
  text-align: right;
  padding: 0 15px;
  box-sizing: border-box;
  border: 1px solid #f1e8e8;
  border-top: none;
  border-left: none;
  .delete-btn {
    color: #f56c6c;
  }
}
.logo-wrapper {
  position: relative;
  height: 42px;
  background: #fff;
  border-bottom: 1px solid #f1e8e8;
  box-sizing: border-box;
}
.logo {
  position: absolute;
  left: 12px;
  top: 6px;
  line-height: 30px;
  color: #00afff;
  font-weight: 600;
  font-size: 17px;
  white-space: nowrap;
  > img {
    width: 30px;
    height: 30px;
    vertical-align: top;
  }
  .github {
    display: inline-block;
    vertical-align: sub;
    margin-left: 15px;
    > img {
      height: 22px;
    }
  }
}

.center-board-row {
  padding: 12px 12px 15px 12px;
  box-sizing: border-box;
  & > .el-form {
    // 69 = 12+15+42
    height: calc(100vh - 69px);
  }
}
.drawing-board {
  height: 100%;
  position: relative;
  .components-body {
    padding: 0;
    margin: 0;
    font-size: 0;
  }
  .sortable-ghost {
    position: relative;
    display: block;
    overflow: hidden;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 3px;
      background: rgb(89, 89, 223);
      z-index: 2;
    }
  }
  .components-item.sortable-ghost {
    width: 100%;
    height: 60px;
    background-color: $selectedColor;
  }
  .active-from-item {
    & > .el-form-item {
      background: $selectedColor;
      border-radius: 6px;
    }
    & > .drawing-item-copy,
    & > .drawing-item-delete {
      display: initial;
    }
    & > .component-name {
      color: $lighterBlue;
    }
  }
  .el-form-item {
    margin-bottom: 15px;
  }
}
.drawing-item {
  position: relative;
  cursor: move;
  &.unfocus-bordered:not(.activeFromItem) > div:first-child {
    border: 1px dashed #ccc;
  }
  .el-form-item {
    padding: 12px 10px;
  }
}
.drawing-row-item {
  position: relative;
  cursor: move;
  box-sizing: border-box;
  border: 1px dashed #ccc;
  border-radius: 3px;
  padding: 0 2px;
  margin-bottom: 15px;
  .drawing-row-item {
    margin-bottom: 2px;
  }
  .el-col {
    margin-top: 22px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .drag-wrapper {
    min-height: 80px;
  }
  &.active-from-item {
    border: 1px dashed $lighterBlue;
  }
  .component-name {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 12px;
    color: #bbb;
    display: inline-block;
    padding: 0 6px;
  }
}
.drawing-item,
.drawing-row-item {
  &:hover {
    & > .el-form-item {
      background: $selectedColor;
      border-radius: 6px;
    }
    & > .drawing-item-copy,
    & > .drawing-item-delete {
      display: initial;
    }
  }
  & > .drawing-item-copy,
  & > .drawing-item-delete {
    display: none;
    position: absolute;
    top: -10px;
    width: 22px;
    height: 22px;
    line-height: 22px;
    text-align: center;
    border-radius: 50%;
    font-size: 12px;
    border: 1px solid;
    cursor: pointer;
    z-index: 1;
  }
  & > .drawing-item-copy {
    right: 56px;
    border-color: $lighterBlue;
    color: $lighterBlue;
    background: #fff;
    &:hover {
      background: $lighterBlue;
      color: #fff;
    }
  }
  & > .drawing-item-delete {
    right: 24px;
    border-color: #f56c6c;
    color: #f56c6c;
    background: #fff;
    &:hover {
      background: #f56c6c;
      color: #fff;
    }
  }
}
.product-active{
    border: 1px dashed #787be8;
    color: #787be8;
    .svg-icon {
      color: #787be8;
    }
}
.components-item-acvtive{
  border: 1px dashed #787be8;
  color: #787be8;
}
</style>
