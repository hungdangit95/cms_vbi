<template>
  <div class="app-container">
    <el-row class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-job">
            <svg-icon icon-class="job" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Tổng số Queue
            </div>
            <span class="card-panel-num">{{ objStat.countQueue}}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-bug">
            <svg-icon icon-class="bug" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Ký lỗi
            </div>
            <span class="card-panel-num">{{ objStat.countSignatureError}}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              SMS lỗi
            </div>
            <span class="card-panel-num">{{ objStat.countSmsError}}</span>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-email">
            <svg-icon icon-class="email" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              Email lỗi
            </div>
            <span class="card-panel-num">{{ objStat.countEmailError}}</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart :dataLabel="chartLabel" :dataLine="chartLine" />
        </div>
      </el-col>
    </el-row>

    <el-form ref="queryForm" :inline="true" v-show="showSearch">
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
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">Tìm kiếm</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col>
        <el-card>
          <div slot="header">
            <span>Danh sách ký lỗi</span>
          </div>
          <el-table v-loading="loading"
                    :data="listSignatures"
                    class="table-list-group">
            <el-table-column label="RabbitMQ Id" align="left" prop="rabbitMQId">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.rabbitMQId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Order Id" align="left" prop="orderId">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.orderId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Contract Id" align="left" prop="contractID">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.contractID}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Time" align="left" prop="updatedDate">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.updatedDate}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Message" align="left" prop="signatureMessage">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.signatureMessage}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Download data" width="120">
              <template slot-scope="scope">
                <el-button size="mini" @click="downloadData(scope.row)">Download</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <br />
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-card>
          <div slot="header">
            <span>Danh sách SMS lỗi</span>
          </div>
          <el-table v-loading="loading"
                    :data="listSms"
                    class="table-list-group">
            <el-table-column label="RabbitMQ Id" align="left" prop="rabbitMQId">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.rabbitMQId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Phone" align="left" prop="phone">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.phone}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Time" align="left" prop="updatedDate">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.updatedDate}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Message" align="left" prop="sendSmsMessage">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.sendSmsMessage}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <br />
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-card>
          <div slot="header">
            <span>Danh sách Email lỗi</span>
          </div>
          <el-table v-loading="loading"
                    :data="listEmail"
                    class="table-list-group">
            <el-table-column label="RabbitMQ Id" align="left" prop="rabbitMQId">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.rabbitMQId}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Email" align="left" prop="email">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.email}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Time" align="left" prop="updatedDate">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.updatedDate}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Message" align="left" prop="sendEmailMessage">
              <template slot-scope="scope">
                <el-button style="color:black"
                           size="mini"
                           type="text">{{scope.row.sendEmailMessage}}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="Download data" width="120">
              <template slot-scope="scope">
                <el-button size="mini" @click="downloadData(scope.row)">Download</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <br />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    ListErrorSignatures,
    ListErrorSMS,
    ListErrorEmail,
    ReportQueueAndJob,
    DownloadFileDataSignature
  } from "@/api/log/queue.js";
  import {
    ReportQueueByTime
  } from "@/api/log/queue.js";
  import BarChart from "./BarChart"
  export default {
    name: "GroupPartner",
    components: {
      BarChart,
    },
    data() {
      return {
        loading: true,
        showSearch: true,
        open: false,
        chartLabel: [],
        chartLine: [],
        listSignatures: [],
        listSms: [],
        listEmail: [],
        objStat: {},
        dateParams: [this.getFormattedDate(new Date(new Date().getFullYear(), 0, 1)), this.getFormattedDate(new Date())],
      };
    },
    mounted() {
      this.getStat();
      this.genChart();
      this.getList();
    },
    methods: {
      getStat() {
        var params = {
          fromdate: this.dateParams[0],
          todate: this.dateParams[1]
        };
        ReportQueueAndJob(params).then((response) => {
          this.objStat = response.result;
        });
      },
      getList() {
        var params = {
          fromdate: this.dateParams[0],
          todate: this.dateParams[1]
        };
        this.loading = true;
        ListErrorSignatures(params).then((response) => {
          this.listSignatures = response.result;
        });
        ListErrorSMS(params).then((response) => {
          this.listSms = response.result;
        });
        ListErrorEmail(params).then((response) => {
          this.listEmail = response.result;
        });
        this.loading = false;
      },
      genChart() {
        ReportQueueByTime().then((response) => {
          response.result.forEach((value, index) => {
            this.chartLabel.push(value.time);
            this.chartLine.push(value.count);
          });
        });
      },
      getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + month + day;
      },
      handleQuery() {
        this.getList();
      },
      downloadData(row) {
        const rabbitMQId = row.rabbitMQId;
        DownloadFileDataSignature(rabbitMQId).then((response) => {
        });
      }
    },
  };
</script>

<style scoped lang="scss">
  .panel-group {
    margin-top: 18px;
    .card-panel-col

  {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover

  {
    .card-panel-icon-wrapper

  {
    color: #fff;
  }

  .icon-job {
    background: #40c9c6;
  }

  .icon-message {
    background: #36a3f7;
  }

  .icon-email {
    background: #f4516c;
  }

  .icon-bug {
    background: #34bfa3
  }

  }

  .icon-job {
    color: #40c9c6;
  }

  .icon-message {
    color: #36a3f7;
  }

  .icon-email {
    color: #f4516c;
  }

  .icon-bug {
    color: #34bfa3
  }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;
    .card-panel-text

  {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    margin-bottom: 12px;
  }

  .card-panel-num {
    font-size: 20px;
  }

  }
  }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;
      .svg-icon

  {
    display: block;
    margin: 14px auto !important;
    float: none !important;
  }

  }
  }
</style>
