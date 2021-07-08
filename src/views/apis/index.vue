<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-badge :value="syncCountApiNew" class="item" type="warning">
        <el-button
          type="cyan"
          icon="el-icon-refresh"
          size="mini"
          @click="handleSyncApiDocument"
          >Đồng bộ API</el-button
        >
      </el-badge>
    </el-row>
    <el-table
      v-loading="loading"
      :data="listEndpoints"
      @selection-change="handleSelectionChange"
      class="table-list-partner"
    >
      <el-table-column
        label="Endpoint"
        align="left"
        prop="endpoint"
        width="400"
      />
      <el-table-column
        label="Endpoint name"
        align="left"
        prop="name"
        width="400"
      />
      <el-table-column
        label="Controller"
        align="left"
        prop="tags[0]"
        width="150"
      />
      <el-table-column label="Method" align="left" prop="method" width="150" />
      <el-table-column
        label="Hành động"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >Modify</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
    />

    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="800px"
      append-to-body
      style="padding-top: 0px !important"
    >
      <el-tabs
        v-model="currentTab"
        class="center-tabs"
        style="padding-top: 0px !important"
      >
        <el-tab-pane label="Thông tin api" name="info" />
        <el-tab-pane label="Thông tin các trường dữ liệu" name="field" />
      </el-tabs>
      <el-form
        v-show="currentTab === 'info'"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="Đường dẫn url"
              prop="endpoint"
              label-width="120px"
            >
              <el-input
                v-model="form.endpoint"
                placeholder="Đường dẫn url"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Tên api" prop="name" label-width="120px">
              <el-input v-model="form.name" placeholder="Tên api" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Phương thức" prop="method" label-width="120px">
              <el-input
                v-model="form.method"
                placeholder="Phương thức"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form
        v-show="currentTab === 'field'"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="Chọn trường dữ liệu" label-width="30%">
              <el-select
                v-model="selectedField.name"
                value-key="item"
                @change="selectField()"
                placeholder="Chọn trường dữ liệu"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="f in listField"
                  :key="f.key"
                  :label="f.name + ' - ' + f.description"
                  :value="f.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isSelectParent">
          <el-col :span="12">
            <el-form-item
              label="Mô tả trường"
              prop="description"
              label-width="120px"
            >
              <input
                type="text"
                class="el-input__inner"
                v-model="selectedField.description"
                placeholder="Mô tả trường"
                @change="fnChangeFieldItem()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Định dạng"
              prop="defaultValue"
              label-width="120px"
            >
              <input
                type="text"
                class="el-input__inner"
                v-model="selectedField.defaultValue"
                placeholder="Định dạng dữ liệu"
                @change="fnChangeFieldItem()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Độ dài" prop="rangeValue" label-width="120px">
              <input
                type="text"
                class="el-input__inner"
                v-model="selectedField.rangeValue"
                placeholder="Độ dài dữ liệu"
                @change="fnChangeFieldItem()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bắt buộc" label-width="30%">
              <el-select
                v-model="isRequired"
                value-key="item"
                @change="selectFieldIsRequired()"
                placeholder="Trường required"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option label="Bắt buộc nhập" :value="true" />
                <el-option label="Không buộc nhập" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isSelectChild">
          <el-col :span="24">
            <el-form-item label="Danh sách trường" label-width="30%">
              <el-select
                v-model="selectedField.childItems.name"
                value-key="item"
                @change="selectFieldChild()"
                placeholder="Chọn trường dữ liệu"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="f in listFieldChild"
                  :key="f.key"
                  :label="f.name + ' - ' + f.description"
                  :value="f.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isSelectFieldChild && isSelectChild">
          <el-col :span="12">
            <el-form-item
              label="Mô tả trường"
              prop="description"
              label-width="120px"
            >
              <input
                type="text"
                class="el-input__inner"
                v-model="selectedField.childItems.description"
                placeholder="Mô tả trường"
                @change="fnChangeFieldItem()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Định dạng"
              prop="defaultValue"
              label-width="120px"
            >
              <input
                type="text"
                class="el-input__inner"
                v-model="selectedField.childItems.defaultValue"
                placeholder="Định dạng dữ liệu"
                @change="fnChangeFieldItem()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Độ dài" prop="rangeValue" label-width="120px">
              <input
                type="text"
                class="el-input__inner"
                v-model="selectedField.childItems.rangeValue"
                placeholder="Độ dài dữ liệu"
                @change="fnChangeFieldItem()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Bắt buộc" label-width="30%">
              <el-select
                v-model="isRequiredChild"
                value-key="item"
                @change="selectFieldIsRequiredChild()"
                placeholder="Trường required"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option label="Bắt buộc nhập" :value="true" />
                <el-option label="Không buộc nhập" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Cập nhật</el-button>
        <el-button @click="cancel">Hủy</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VbiTableRender from "@/components/common/vbi-table-render.vue";
import paymentype from "../../json/payment-type.json";
import keyValueCommons from "../../json/key-value-common.json";
import {
  GetSwaggerJson,
  BindTreeModelSwaggerJson,
  SyncApiDocument,
  GetListApiDocument,
  PutApiDocumentDescription,
  GetListFieldApiDocumentDescriptionById,
} from "@/api/common/common.js";
export default {
  name: "Partner",
  components: {
    VbiTableRender,
  },
  data() {
    return {
      syncCountApiNew: 0,
      loading: true,
      currentTab: "info",
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      paymentypes: [],
      keyValues: [],
      listEndpoints: null,
      listApiInDbs: [],
      listField: [],
      listFieldChild: [],
      isRequired: false,
      isRequiredChild: false,
      title: "",
      selectedField: {
        description: "",
        defaultValue: "",
        rangeValue: "",
        isRequired: false,
        type: "",
        name: "",
        childItems: {
          description: "",
          defaultValue: "",
          rangeValue: "",
          isRequired: false,
          type: "",
          name: "",
        },
      },
      isSelectParent: false,
      isSelectChild: false,
      isSelectFieldChild: false,
      open: false,
      form: {},
      queryParams: {
        pageNum: 1,
        pageSize: 10000,
        groupPartnerId: "",
        partnerId: "",
        partnerName: "",
      },
      rules: {},
    };
  },
  watch: {},
  created() {
    this.paymentypes = paymentype.data;
    this.keyValues = keyValueCommons.data;
    this.readListFormSwagger();
  },
  methods: {
    selectField() {
      if (this.selectedField != null && this.selectedField != "") {
        this.isSelectParent = true;
        let fileds = this.selectedField;
        let child = false;
        let listChild = [];
        this.listField.map(function (v, k) {
          if (v.name == fileds.name) {
            fileds.description = v.description;
            fileds.defaultValue = v.defaultValue;
            fileds.rangeValue = v.rangeValue;
            fileds.isRequired = v.isRequired;
          }
          if (v.name == fileds.name && v.type == "array") {
            child = true;
            listChild = v.childItems;
          }
        });
        this.listFieldChild = listChild;
        this.isSelectChild = child;
        this.selectedField = fileds;
        this.isRequired = this.selectedField.isRequired;
      }
    },
    selectFieldChild() {
      if (this.selectedField != null && this.selectedField != "") {
        this.isSelectFieldChild = true;
        let itemChild = this.selectedField;
        this.listField.map(function (v, k) {
          if (v.childItems.length > 0) {
            v.childItems.map(function (v1, k1) {
              if (v1.name == itemChild.childItems.name) {
                itemChild.childItems.defaultValue = v1.defaultValue;
                itemChild.childItems.description = v1.description;
                itemChild.childItems.rangeValue = v1.rangeValue;
                itemChild.childItems.isRequired = v1.isRequired;
              }
            });
          }
        });
        this.isRequiredChild = itemChild.childItems.isRequired;
        this.selectedField = itemChild;
      }
    },
    selectFieldIsRequired() {
      this.selectedField.isRequired = this.isRequired;
      this.fnMapListField(1);
    },
    selectFieldIsRequiredChild() {
      this.selectedField.childItems.isRequired = this.isRequiredChild;
      this.fnMapListField(1);
    },

    fnChangeFieldItem() {
      this.fnMapListField(0);
    },

    fnMapListField(type) {
      let fileds = this.selectedField;
      this.listField.map(function (v, k) {
        if (v.name == fileds.name) {
          if (type == 0) {
            v.description = fileds.description;
            v.defaultValue = fileds.defaultValue;
            v.rangeValue = fileds.rangeValue;
          } else {
            v.isRequired = fileds.isRequired;
          }
          if (v.childItems != null && v.childItems.length > 0) {
            v.childItems.map(function (v1, k1) {
              if (v1.name == fileds.childItems.name) {
                if (type == 0) {
                  v1.description = fileds.childItems.description;
                  v1.defaultValue = fileds.childItems.defaultValue;
                  v1.rangeValue = fileds.childItems.rangeValue;
                } else {
                  v1.isRequired = fileds.childItems.isRequired;
                }
              }
            });
          }
        }
      });
    },

    /** Lấy danh sách IP white list */
    handleTabs(tab, event) {},

    readListFormSwagger() {
      this.loading = true;
      GetSwaggerJson().then((response) => {
        var paths = [];
        paths = Object.getOwnPropertyNames(response.paths);
        var listApis = new Array();
        paths.map(function (p, k) {
          var method = "";
          var tags = new Array();
          let summary = "";
          var parameters = new Array();
          var body = new Array();
          if (response.paths[p].get == undefined) {
            method = "POST";
            tags = response.paths[p].post.tags;
            summary = response.paths[p].post.summary;
            var requestBody =
              response.paths[p].post.requestBody.content["application/json"]
                .schema["$ref"];
            if (requestBody != undefined) {
              requestBody = requestBody.substring(2, requestBody.length);
              body = BindTreeModelSwaggerJson(
                requestBody,
                response.components.schemas
              );
            }
          } else {
            method = "GET";
            tags = response.paths[p].get.tags;
            summary = response.paths[p].get.summary;
            let params = response.paths[p].get.parameters;
            if (params != undefined) {
              params.forEach((element) => {
                parameters.push({
                  name: element.name,
                  type: element.schema.type,
                });
              });
            }
          }
          listApis.push({
            id: k,
            idApi: "",
            endpoint: p,
            method: method,
            tags: tags,
            summary: summary == undefined ? "" : summary,
            name: summary == undefined ? "" : summary,
            parameters: parameters,
            body: body,
            isSync: false,
          });
        });
        GetListApiDocument().then((res) => {
          let totalSyncNew = 0;
          listApis.map(function (k, v) {
            let isCheckSync = false;
            res.result.map(function (k1, v1) {
              if (k.endpoint == k1.endpoint) {
                isCheckSync = true;
                k.idApi = k1.id;
              }
            });
            if (isCheckSync) {
              k.isSync = true;
            } else {
              totalSyncNew = totalSyncNew + 1;
            }
          });
          this.syncCountApiNew = totalSyncNew;
          this.listEndpoints = listApis;
          this.total = this.listEndpoints.length;
          this.loading = false;
        });
      });
    },

    getList() {
      this.loading = true;
      GetListApiDocument().then((res) => {
        this.listApiInDbs = res.result;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },

    reset() {
      this.form = {};
      this.resetForm("form");
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Thêm mới đối tác";
    },
    handleUpdate(row) {
      // this.listField = [];
      this.form = row;
      if (this.form.body.length > 0) {
        this.listField = this.form.body;
      }
      if (this.form.parameters.length > 0) {
        this.listField = this.form.parameters;
      }

      if (this.listField.length > 0) {
        this.listField.map(function (v, k) {
          v.description = "";
          v.rangeValue = "";
          v.isRequired = false;
          v.defaultValue = "";
          if (v.type !== "array") {
            v.childItems = [];
          } else {
            let childs = v.body;
            childs.map(function (v1, k1) {
              v1.description = "";
              v1.rangeValue = "";
              v1.isRequired = false;
              v1.defaultValue = "";
            });
            v.childItems = childs;
          }
        });
      }
      let fields = this.listField;

      if (this.form.idApi != "") {
        GetListFieldApiDocumentDescriptionById(this.form.idApi).then((res) => {
          //  console.log(res);
          if (!res.isError && res.statusCode == 200) {
            if (res.result != null) {
              if (res.result.apiDocumentDescriptions.length > 0) {
                fields.map(function (v, k) {
                  res.result.apiDocumentDescriptions.map(function (v1, k1) {
                    if (v.name == v1.fieldName) {
                      v.description = v1.description;
                      v.rangeValue = v1.rangeValue;
                      v.isRequired = v1.isRequired;
                      v.defaultValue = v1.defaultValue;
                      if (v.type == "array") {
                        v.childItems.map(function (v2, k2) {
                          v1.childItems.map(function (v3, k3) {
                            if (v2.name == v3.fieldName) {
                              v2.description = v3.description;
                              v2.rangeValue = v3.rangeValue;
                              v2.isRequired = v3.isRequired;
                              v2.defaultValue = v3.defaultValue;
                            }
                          });
                        });
                      }
                    }
                  });
                });
              }
            }
          }
        });
      }

      this.listField = fields;
      this.title = "Cập nhật thông tin API";
      this.open = true;
    },

    submitForm: function () {
      if (this.form.idApi == "") {
        this.msgSuccess(
          "API này chưa được đồng bộ, Bạn Vui lòng đồng bộ API mới này."
        );
        return;
      }

      let data = {
        items: [],
        errorIds: [],
      };

      this.listField.map(function (v, k) {
        let item = {};
        item.fieldName = v.name;
        item.description = v.description;
        item.rangeValue = v.rangeValue;
        item.isRequired = v.isRequired;
        let child = [];
        if (v.childItems.length > 0) {
          v.childItems.map(function (v1, k1) {
            let itemChild = {};
            itemChild.fieldName = v1.name;
            itemChild.description = v1.description;
            itemChild.rangeValue = v1.rangeValue;
            itemChild.isRequired = v1.isRequired;
            itemChild.childItems = [];
            child.push(itemChild);
          });
        }
        item.childItems = child;
        data.items.push(item);
      });
      PutApiDocumentDescription(data, this.form.idApi).then((res) => {
        if (!res.isError && res.statusCode == 200) {
          this.msgSuccess(
            "Cập nhật thông tin mô tả trường dữ liệu của API thành công!"
          );
        } else {
          this.msgSuccess("Xảy ra lỗi khi cập nhật!");
        }
      });
    },

    handleSyncApiDocument() {
      let list = this.listEndpoints;
      var data = [];
      list.map(function (v, k) {
        let item = {};
        item.endpoint = v.endpoint;
        item.name = v.summary;
        item.tags = v.tags[0];
        item.summary = v.summary;
        item.method = v.method;
        item.parammeters = JSON.stringify(v.parameters);
        item.bodyJson = JSON.stringify(v.body);
        item.isSync = true;
        data.push(item);
      });
      SyncApiDocument(data).then((r) => {
        if (!r.isError && r.statusCode == 200) {
          this.readListFormSwagger();
          this.msgSuccess(r.message);
        } else {
          messageText = r.message;
          this.msgError(r.message);
        }
      });
    },
  },
};
</script>
<style scoped>
.table-list-partner {
  font-size: 12px !important;
}
</style>