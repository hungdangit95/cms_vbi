<template>
  <div class="app-container">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :data="pieChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <bar-chart :dataLabel="chartLabel" :dataLine="chartLine" />
        </div>
      </el-col>
    </el-row>

    <br />
    <el-form ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item>
        <el-date-picker
          v-model="dateParams"
          type="daterange"
          format="dd/MM/yyyy"
          value-format="yyyyMMdd"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >Tìm kiếm</el-button
        >
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-card>
          <div slot="header">
            <span>Danh sách exception gần đây</span>
          </div>
          <el-table
            v-loading="loading"
            :data="postList"
            class="table-list-group"
          >
            <el-table-column label="Request Id" align="left" prop="requestId">
              <template slot-scope="scope">
                <el-button
                  style="color: black"
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                  >{{ scope.row.requestId }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="End Point" align="left" prop="endpoint">
              <template slot-scope="scope">
                <el-button
                  style="color: black"
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                  >{{ scope.row.endpoint }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              label="Loại exception"
              align="center"
              prop="exceptionType"
              width="150"
            >
              <template slot-scope="scope">
                <el-alert
                  v-if="scope.row.exceptionType === 0"
                  class="bacgound-none"
                  title="Validation"
                  type="error"
                  :closable="false"
                  show-icon
                ></el-alert>
                <el-alert
                  v-if="scope.row.exceptionType === 1"
                  class="bacgound-none"
                  title="Business Logic"
                  type="warning"
                  :closable="false"
                  show-icon
                ></el-alert>
                <el-alert
                  v-if="scope.row.exceptionType === 2"
                  class="bacgound-none"
                  title="Khác"
                  type="warning"
                  :closable="false"
                  show-icon
                ></el-alert>
              </template>
            </el-table-column>
            <el-table-column
              label="Ngày tạo"
              align="center"
              prop="createdDate"
              width="150"
            >
              <template slot-scope="scope">
                <span :style="styleRow">{{
                  scope.row.createdDate | formatDate
                }}</span>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="1000px"
      append-to-body
      class="dialog-body"
    >
      <div class="field-box">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-date"></i> Exception</span>
            <!-- Tabs exception -->
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="24">
                  <el-divider content-position="left"
                    ><h4>Thông tin chung</h4></el-divider
                  >
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="End Point"
                    prop="endPoint"
                    label-width="20%"
                  >
                    <el-input v-model="form.endPoint" placeholder="End Point" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="Method" prop="method" label-width="20%">
                    <el-input v-model="form.method" placeholder="Method" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Message"
                    prop="message"
                    label-width="20%"
                  >
                    <el-input v-model="form.message" placeholder="Message" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Api Error"
                    prop="apiError"
                    label-width="20%"
                  >
                    <el-input v-model="form.apiError" placeholder="Api Error" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Type"
                    prop="exceptionType"
                    label-width="20%"
                  >
                    <span
                      :style="styleRow_approverd"
                      v-if="form.exceptionType == 1"
                      >Lỗi hệ thống</span
                    >
                    <span
                      :style="styleRow_waitting"
                      v-if="form.exceptionType == 2"
                      >Lỗi nghiệp vụ</span
                    >
                    <span
                      :style="styleRow_reject"
                      v-if="form.exceptionType == 3"
                      >Lỗi validation</span
                    >
                    <span :style="styleRow" v-if="form.exceptionType == 4"
                      >Lỗi khác</span
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Parner Code"
                    prop="type"
                    label-width="20%"
                  >
                    <el-input
                      v-model="form.parnerCode"
                      placeholder="Parner Code"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-divider content-position="left"
                    ><h4>Stack Trace</h4></el-divider
                  >
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Trace"
                    prop="trackTrace"
                    label-width="20%"
                  >
                    <el-input
                      type="textarea"
                      :rows="5"
                      placeholder="Track Trace"
                      v-model="form.trackTrace"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="text-align: center">
                  <el-button @click="cancel">Hủy</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Config">
            <span slot="label"><i class="el-icon-date"></i> Request</span>
            <!-- Tabs request -->
            <el-form ref="form" :model="form" label-width="80px">
              <el-row>
                <el-col :span="24">
                  <el-divider content-position="left"
                    ><h4>Thông tin chung</h4></el-divider
                  >
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Request Id"
                    prop="requestId"
                    label-width="20%"
                  >
                    <el-input
                      v-model="form.requestModel.requestId"
                      placeholder="requestId"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="Parner Code"
                    prop="type"
                    label-width="20%"
                  >
                    <el-input
                      v-model="form.requestModel.parnerCode"
                      placeholder="Parner Code"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="Method" prop="method" label-width="20%">
                    <el-input
                      v-model="form.requestModel.verb"
                      placeholder="Method"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="IP" prop="ip" label-width="20%">
                    <el-input v-model="form.requestModel.ip" placeholder="IP" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="End Point"
                    prop="endPoint"
                    label-width="20%"
                  >
                    <el-input
                      v-model="form.requestModel.endPoint"
                      placeholder="End Point"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="Header" prop="header" label-width="20%">
                    <el-input
                      type="textarea"
                      :rows="5"
                      placeholder="Header"
                      v-model="form.requestModel.header"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" style="text-align: center">
                  <el-button @click="cancel">Hủy</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <br />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetListException,
  GetDetailException,
  ReportRequestOrExceptionByTime,
  GetTotalException,
} from "@/api/log/exception.js";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
export default {
  name: "GroupPartner",
  components: {
    BarChart,
    PieChart,
  },
  data() {
    return {
      isShowBoxListPartner: true,
      loading: true,
      showSearch: true,
      title: "",
      dateParams: [
        this.getFormattedDate(new Date(new Date().getFullYear(), 0, 1)),
        this.getFormattedDate(new Date()),
      ],
      queryParams: {
        fromDate: this.getFormattedDate(
          new Date(new Date().getFullYear(), 0, 1)
        ),
        toDate: this.getFormattedDate(new Date()),
        pageNum: 1,
        pageSize: 10,
      },
      open: false,
      postList: [],
      total: 0,
      form: { requestModel: "" },
      pieChartData: [],
      chartLabel: [],
      chartLine: [],
      styleRow: "color:black;font-size: 13px;",
      styleRow_reject: "color:red;font-size: 13px;font-weight:600",
      styleRow_waitting: "color:#ffba00;font-size: 13px;font-weight:600",
      styleRow_approverd: "color:#13ce66;font-size: 13px;font-weight:600",
    };
  },
  mounted() {
    this.genChart();
    this.getList();
  },
  methods: {
    /** Lấy danh sách nhóm đối tác */
    getList() {
      this.loading = true;
      var params = {
        fromdate: this.dateParams[0],
        todate: this.dateParams[1],
        pageIndex: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
      };
      GetListException(params).then((response) => {
        this.postList = response.result;
        this.total = response.result.length;
        this.loading = false;
      });
    },
    genChart() {
      //Exception = 1
      ReportRequestOrExceptionByTime(1).then((response) => {
        response.result.forEach((value, index) => {
          this.chartLabel.push(value.time);
          this.chartLine.push(value.count);
        });
      });
      GetTotalException().then((response) => {
        var objOther1 = {
          name: "Lỗi khác",
          value: response.result.totalOtherError,
        };
        var objOther2 = {
          name: "Lỗi validation",
          value: response.result.totalValidationError,
        };
        var objOther3 = {
          name: "Lỗi dữ liệu",
          value: response.result.totalDataError,
        };
        var objOther4 = {
          name: "Lỗi hệ thống",
          value: response.result.totalSystemError,
        };
        this.pieChartData.push(objOther1);
        this.pieChartData.push(objOther2);
        this.pieChartData.push(objOther3);
        this.pieChartData.push(objOther4);
      });
    },

    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    cancel() {
      this.open = false;
    },
    handleUpdate(row) {
      const _Id = row._Id;
      GetDetailException(_Id).then((response) => {
        this.form = response.result;
        this.open = true;
        this.title = "Cập nhật";
      });
    },
    getFormattedDate(date) {
      let year = date.getFullYear();
      let month = (1 + date.getMonth()).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");
      return year + month + day;
    },
  },
};
</script>

<style scoped>
.table-list-group {
  font-size: 12px !important;
}

tbody {
  font-size: 12px !important;
}

.row-l-p {
  height: 250px !important;
  overflow-y: auto !important;
}

.center-tabs {
  margin-top: -35px !important;
}

.item_ip {
  border: 1px dashed #787be8;
  color: brown;
  padding: 8px 10px;
  background: #f6f7ff;
  font-size: 12px;
  cursor: move;
  margin: 10px;
  border-radius: 3px;
  text-align: center;
}

.bacgound-none {
  background-color: white;
}
</style>
