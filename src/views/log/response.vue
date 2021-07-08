<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card>
          <div slot="header">
            <span>Top 10 response chậm nhất</span>
          </div>
          <el-table v-loading="loading"
                    :data="slowestList"
                    class="table-list-partner"
                    :row-style="tableRowStyle"
                    :header-cell-style="tableHeaderColor">
            <el-table-column label="Request ID" align="left" prop="id" width="250">
              <template slot-scope="scope">
                <el-button :style="styleRow"
                           size="mini"
                           type="text"
                           @click="handleUpdate(scope.row)">{{scope.row.requestId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Mã đối tác" prop="name" :show-overflow-tooltip="true" width="120">
              <template slot-scope="scope">
                <el-button :style="styleRow"
                           size="mini"
                           type="text"
                           @click="handleUpdate(scope.row)">{{scope.row.parnerCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="End Point" prop="endPoint">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.endPoin}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" prop="verb" width="60">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.httpCode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Duration" prop="verb" width="100">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.duration/1000 | formatNumber}}s</span>
              </template>
            </el-table-column>
            <el-table-column label="Ngày tạo" prop="createdDate" width="150">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.createdDate | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Response" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="showRequest(scope.row)">Request</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <br />
    <el-form ref="queryForm"
             :inline="true"
             label-width="68px">
      <el-form-item>
        <el-date-picker v-model="dateParams"
                        type="daterange"
                        format="dd/MM/yyyy"
                        value-format="yyyyMMdd"
                        start-placeholder="Ngày bắt đầu"
                        end-placeholder="Ngày kết thúc"
                        :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="Nhóm đối tác" prop="queryParams.partnerCode" label-width="150px">
        <el-select v-model="queryParams.partnerCode"
                   placeholder="Nhóm đối tác"
                   clearable
                   filterable
                   size="small"
                   style="width: 240px">
          <el-option v-for="g in groupPartnerOptions"
                     :key="g.id"
                     :label="g.name.trim() == '' ? g.id : g.name"
                     :value="g.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">Tìm kiếm</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-card>
          <div slot="header">
            <span>Danh sách response gần đây</span>
          </div>
          <el-table v-loading="loading"
                    :data="partnerList"
                    class="table-list-partner"
                    :row-style="tableRowStyle"
                    :header-cell-style="tableHeaderColor">
            <el-table-column label="Request ID" align="left" prop="id" width="250">
              <template slot-scope="scope">
                <el-button :style="styleRow"
                           size="mini"
                           type="text"
                           @click="handleUpdate(scope.row)">{{scope.row.requestId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Mã đối tác" prop="name" :show-overflow-tooltip="true" width="120">
              <template slot-scope="scope">
                <el-button :style="styleRow"
                           size="mini"
                           type="text"
                           @click="handleUpdate(scope.row)">{{scope.row.parnerCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="End Point" prop="endPoint">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.endPoin}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Status" prop="verb" width="60">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.httpCode}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Duration (s)" prop="verb" width="100">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.duration/1000 | formatNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Ngày tạo" prop="createdDate" width="150">
              <template slot-scope="scope">
                <span :style="styleRow">{{scope.row.createdDate | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="Response" width="100">
              <template slot-scope="scope">
                <el-button size="mini" @click="showRequest(scope.row)">Request</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0"
                      :total="total"
                      :page.sync="queryParams.pageNum"
                      :limit.sync="queryParams.pageSize"
                      @pagination="getList" />
        </el-card>
      </el-col>
    </el-row>
    <!-- Popup -->
    <el-dialog title="Thông tin response"
               :visible.sync="open"
               width="1000px"
               append-to-body
               class="dialog-body">
      <div class="field-box">
        <el-form ref="form"
                 :model="form"
                 label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left"><h4>Thông tin chung</h4></el-divider>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Status" prop="requestId" label-width="20%">
                <el-input v-model="form.httpCode" placeholder="Status" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Duration" prop="duration" label-width="20%">
                <el-input v-model="form.duration" placeholder="Duration" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="End Point" prop="ip" label-width="20%">
                <el-input v-model="form.endPoin" placeholder="End Point" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="IP" prop="method" label-width="20%">
                <el-input v-model="form.ip" placeholder="IP" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Parner Code" prop="type" label-width="20%">
                <el-input v-model="form.parnerCode" placeholder="Parner Code" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center">
              <el-button @click="cancel">Hủy</el-button>
            </el-col>
          </el-row>
          <br />
        </el-form>
      </div>
    </el-dialog>
    <!-- Popup Request-->
    <el-dialog title="Thông tin request"
               :visible.sync="openRequest"
               width="1000px"
               append-to-body
               class="dialog-body">
      <div class="field-box">
        <el-form ref="formRequest"
                 :model="formRequest"
                 label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left"><h4>Thông tin chung</h4></el-divider>
            </el-col>
            <el-col :span="24">
              <el-form-item label="URL" prop="endPoint" label-width="20%">
                <el-input v-model="formRequest.endPoint" placeholder="URL" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="IP" prop="ip" label-width="20%">
                <el-input v-model="formRequest.ip" placeholder="IP" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Method" prop="method" label-width="20%">
                <el-input v-model="formRequest.verb" placeholder="Method" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Parner Code" prop="type" label-width="20%">
                <el-input v-model="formRequest.parnerCode" placeholder="Parner Code" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left"><h4>Header</h4></el-divider>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Accept" label-width="20%">
                <el-input v-model="formRequest.header.Accept" placeholder="Accept" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Accept-Encoding" label-width="20%">
                <el-input v-model="formRequest.header['Accept-Encoding']" placeholder="Accept-Encoding" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Accept-Language" label-width="20%">
                <el-input v-model="formRequest.header['Accept-Language']" placeholder="Accept-Language" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Authorization" label-width="20%">
                <el-input v-model="formRequest.header.Authorization" placeholder="Authorization" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Connection" label-width="20%">
                <el-input v-model="formRequest.header.Connection" placeholder="Connection" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Host" label-width="20%">
                <el-input v-model="formRequest.header.Host" placeholder="Host" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Referer" label-width="20%">
                <el-input v-model="formRequest.header.Referer" placeholder="Referer" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="User-Agent" label-width="20%">
                <el-input v-model="formRequest.header['User-Agent']" placeholder="User-Agent" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center">
              <el-button @click="cancelRequest">Hủy</el-button>
            </el-col>
          </el-row>
          <br />
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listAllGroupPartner
  } from "@/api/partner/partner.js";
  import {
    SearchAndPagingLogResponse,
    GetTopLogResponseSlowest,
    GetResponseLoggingByRequestId
  } from "@/api/log/response.js";
  import {
    GetRequestLoggingByRequestId
  } from "@/api/log/request.js";

  export default {
    data() {
      return {
        loading: true,
        partnerList: null,
        slowestList:null,
        groupPartnerOptions: [],
        styleRow: "color:black;font-size: 13px;",
        styleRow_reject: "color:red;font-size: 13px;font-weight:600",
        styleRow_waitting: "color:#ffba00;font-size: 13px;font-weight:600",
        styleRow_approverd: "color:#13ce66;font-size: 13px;font-weight:600",

        dateParams: [this.getFormattedDate(new Date(new Date().getFullYear(), 0, 1)), this.getFormattedDate(new Date())],
        total:0,
        queryParams: {
          fromDate: this.getFormattedDate(new Date(new Date().getFullYear(), 0, 1)),
          toDate: this.getFormattedDate(new Date()),
          pageNum: 1,
          pageSize: 10,
          partnerCode: ""
        },

        open: false,
        form: {
          requestModel: ""
        },

        openRequest: false,
        formRequest: {requestModel: "", header: ""}
      };
    },
    created() {
      this.getTopSlowest();
      this.getList();
      this.getListGroupPartner();
    },
    methods: {
      tableRowStyle({ row, rowIndex }) {
        return 'font-family: monospace;font-size: 14px;'
      },
      tableHeaderColor({ row, column, rowIndex, columnIndex }) {
        if (rowIndex === 0) {
          return 'font-size: 12px;'
        }
      },

      // Lấy danh sách nhóm đối tác
      getListGroupPartner() {
        this.loading = true;
        listAllGroupPartner().then((response) => {
          this.groupPartnerOptions = response.result;
          this.groupPartnerOptions.unshift({ id: "", name: "Tất cả" });
          this.loading = false;
        });
      },

      getList() {
        this.loading = true;
        var params = {
          partnerCode: this.queryParams.partnerCode,
          fromdate: this.dateParams[0],
          todate: this.dateParams[1],
          pageIndex: this.queryParams.pageNum,
          pageSize: this.queryParams.pageSize
        };
        SearchAndPagingLogResponse(params).then((response) => {
          this.partnerList = response.result.items;
          this.total = response.result.count;
          this.loading = false;
        });
      },
      resetQuery() {
        this.resetForm("queryForm");
      },
      handleQuery() {
        this.queryParams.page = 1;
        this.getList();
      },
      getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + month + day;
      },
      getTopSlowest() {
        GetTopLogResponseSlowest().then((response) => {
          this.slowestList = response.result;
        })
      },
      cancel() {
        this.open = false;
      },
      handleUpdate(row) {
        const _requestId = row.requestId;
        GetResponseLoggingByRequestId(_requestId).then((response) => {
          this.form = response.result;
          this.open = true;
        });
      },

      cancelRequest() {
        this.openRequest = false;
      },
      showRequest(row) {
        const _requestId = row.requestId;
        GetRequestLoggingByRequestId(_requestId).then((response) => {
          this.formRequest = response.result;
          var string = response.result.header.replace(/[\[\]']+/g, '')
          this.formRequest.header = JSON.parse(string);
          this.openRequest = true;
          
        });
      }
    },
  };
</script>
<style scoped>
  .table-list-partner {
    font-size: 12px !important;
  }
  .el-form-item {
    margin-bottom: .5rem;
  }
  .el-form-item__label {
    font-size: 18px;
  }
</style>
