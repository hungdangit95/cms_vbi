<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="Mã" prop="partnerId">
        <el-input
          v-model="queryParams.partnerId"
          placeholder="Mã đối tác"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Tên" prop="partnerName">
        <el-input
          v-model="queryParams.partnerName"
          placeholder="Tên đối tác"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="Nhóm đối tác"
        prop="groupPartnerId"
        label-width="150px"
      >
        <el-select
          v-model="queryParams.groupPartnerId"
          placeholder="Nhóm đối tác"
          clearable
          filterable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="(g, index) in groupPartnerOptions"
            :key="index"
            :label="g.name.trim() == '' ? g.id : g.name"
            :value="g.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >Tìm kiếm</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >Làm mới</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >Thêm</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdateStatus"
          >Xét duyệt đối tác</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >Xóa</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport">Export</el-button>
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <DataTable
      :everthingIsReady="loading"
      :data="partnerList"
      :metadata="{
        cssClass: 'cssClass',
        sort: 'createdDate',
        selectModel: 'single',
        noResultMessage: string,
        noResultDescription: 'Không tìm thấy gì cả',
        noResultIcon: '',
        noResultImage: '',
        noResultNoBorders: true,
        canSelectAll: true,
        columns: [
          {
            name: 'Mã đối tác',
            description: 'mã đối tác',
            fieldName: 'id',
            sortable: true,
            order: 1,
            templateName: '',
            displayType: 'text',
            style: 'width:180',
            width: 180,
          },
          {
            name: 'Tên đối tác',
            description: 'Name',
            fieldName: 'name',
            sortable: true,
            order: 2,
            displayType: 'text',
            style: 'width:180',
            width: 180,
          },
          {
            name: 'Nhóm',
            description: 'Name',
            fieldName: 'groupId',
            sortable: true,
            order: 1,
            displayType: 'text',
            style: 'width:180',
            width: 180,
          },
          {
            name: 'Mã ĐVQL',
            description: 'Mã ĐVQL',
            fieldName: 'managermentUnitId',
            order: 1,
            displayType: 'text',
            style: 'width:180',
            width: 180,
          },
          {
            name: 'Người quản lý',
            description: 'Người quản lý',
            fieldName: 'employeeManagerment',
            order: 1,
            displayType: 'text',
            style: 'width:180',
            width: 180,
          },
          {
            name: 'Ngày tạo',
            description: 'Ngày tạo',
            fieldName: 'createdDate',
            displayType: 'datetime',
            style: 'width:180',
            width: 180,
          },
        ],
      }"
    ></DataTable>
    <!-- <el-table
      border
      style="width: 100%"
      v-loading="loading"
      :data="partnerList"
      @selection-change="handleSelectionChange"
      class="table-list-partner"
      :row-style="tableRowStyle"
      :header-cell-style="tableHeaderColor"
    >
      <el-table-column type="selection" style="width: 50%" align="center" />
      <el-table-column
        label="MÃ ĐỐI TÁC"
        align="left"
        prop="id"
        style="width: 10%"
      >
        <template slot-scope="scope">
          <el-button
            :style="styleRow"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >{{ scope.row.id }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="TÊN ĐỐI TÁC"
        align="left"
        prop="name"
        style="width: 30%"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button
            :style="styleRow"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >{{ scope.row.name }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="NHÓM"
        align="left"
        prop="groupId"
        style="width: 10%"
      >
        <template slot-scope="scope">
          <span :style="styleRow">{{ scope.row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="MÃ ĐVQL"
        align="center"
        prop="managermentUnitId"
        style="width: 10%"
      >
        <template slot-scope="scope">
          <span :style="styleRow">{{ scope.row.managermentUnitId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="NGƯỜI QL"
        align="center"
        prop="employeeManagerment"
        style="width: 15%"
      >
        <template slot-scope="scope">
          <span :style="styleRow">{{ scope.row.employeeManagerment }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="NGÀY TẠO"
        align="center"
        prop="createdDate"
        style="width: 20%"
      >
        <template slot-scope="scope">
          <span :style="styleRow">{{
            scope.row.createdDate | formatDate
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="TRẠNG THÁI"
        align="left"
        prop="status"
        style="width: 20%"
      >
        <template slot-scope="scope">
          <span :style="styleRow_approverd" v-if="scope.row.status == 1"
            >Đang hoạt động</span
          >
          <span
            :style="styleRow_waitting"
            v-if="scope.row.status == 2"
            style="color: #ffba00"
            >Đăng ký mới</span
          >
          <span :style="styleRow_reject" v-if="scope.row.status == 3"
            >Từ chối</span
          >
          <span :style="styleRow_reject" v-if="scope.row.status == 4"
            >Tạm dừng</span
          >
        </template>
      </el-table-column>
    </el-table> -->

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Nhóm đối tác"
              prop="groupPartnerId"
              label-width="120px"
            >
              <el-select
                v-model="form.groupPartnerId"
                placeholder="Nhóm đối tác"
                clearable
                filterable
                size="small"
                style="width: 100%"
                @change="handleChangeGroupPartner"
              >
                <el-option
                  v-for="(g, index) in groupPartnerOptions"
                  :key="index"
                  :label="g.name.trim() == '' ? g.id : g.name"
                  :value="g.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Mã đối tác" prop="id" label-width="120px">
              <el-input
                v-model="form.id"
                placeholder="Mã đối tác"
                @change="handleChangePartnerId"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Tên đối tác" prop="name" label-width="120px">
              <el-input v-model="form.name" placeholder="Tên đối tác" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Cấp trên" prop="parentId" label-width="120px">
              <el-select
                v-model="form.parentId"
                placeholder="Cấp trên"
                clearable
                filterable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="(s, index) in superiors"
                  :key="index"
                  :label="s.name"
                  :value="s.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Tên viết tắt"
              prop="aliasName"
              label-width="120px"
            >
              <el-input v-model="form.aliasName" placeholder="Tên viết tắt" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Địa chỉ" prop="address" label-width="120px">
              <el-input v-model="form.address" placeholder="Địa chỉ" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Điện thoại" prop="phone" label-width="120px">
              <el-input v-model="form.phone" placeholder="Điện thoại" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Fax" prop="fax" label-width="120px">
              <el-input v-model="form.fax" placeholder="Fax" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Mã số thuế" prop="taxId" label-width="120px">
              <el-input v-model="form.taxId" placeholder="Mã số thuế" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Đại lý" prop="agencyId" label-width="120px">
              <el-select
                v-model="form.agencyId"
                placeholder="Đại lý"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="handleChangeAgency"
                :loading="loading"
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="(g, index) in agencys"
                  :key="index"
                  :label="g.name"
                  :value="g.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item
              label="Kiểu TT"
              t
              prop="orderType"
              label-width="120px"
            >
              <el-select
                v-model="form.orderType"
                placeholder="Kiểu thanh toán"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="s in paymentypes"
                  :key="s.key"
                  :label="s.name"
                  :value="s.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="Ngày chốt"
              prop="dateQuantity"
              label-width="120px"
            >
              <el-input-number
                style="width: 100%"
                v-model="form.dateQuantity"
                controls-position="right"
                placeholder="Ngày chốt"
                :min="0"
                :max="31"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="Gửi email"
              prop="sendMailType"
              label-width="120px"
            >
              <el-select
                v-model="form.sendMailType"
                placeholder="Gửi mail"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="g in keyValues"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Gửi SMS"
              prop="sendSmsType"
              label-width="120px"
            >
              <el-select
                v-model="form.sendSmsType"
                placeholder="Gửi SMS"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="g in keyValues"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Gửi hóa đơn"
              prop="sendOrderType"
              label-width="120px"
            >
              <el-select
                v-model="form.sendOrderType"
                placeholder="Gửi hóa đơn"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="g in keyValues"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="Hủy hoàn phí"
              prop="cancelRefundFee"
              label-width="120px"
            >
              <el-select
                v-model="form.cancelRefundFee"
                placeholder="Hủy hoàn phí"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="g in yesOrNos"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Thụ hưởng"
              prop="beneficiaries"
              label-width="120px"
            >
              <el-select
                v-model="form.beneficiaries"
                placeholder="Thụ hưởng"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="g in yesOrNos"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Xuất hóa đơn"
              prop="exportOrder"
              label-width="120px"
            >
              <el-select
                v-model="form.exportOrder"
                placeholder="Xuất hóa đơn"
                clearable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="g in yesOrNos"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item
              label="Địa bàn"
              prop="managermentUnitId"
              label-width="120px"
            >
              <el-select
                v-model="form.managermentUnitId"
                placeholder="Địa bàn"
                clearable
                filterable
                size="small"
                style="width: 100%"
                @change="handleChangeUnitVBI"
              >
                <el-option
                  v-for="(g, index) in unitVbis"
                  :key="index"
                  :label="g.name"
                  :value="g.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Phòng GD"
              prop="departmentManagerment"
              label-width="120px"
            >
              <el-select
                v-model="form.departmentManagerment"
                placeholder="Phòng giao dịch"
                clearable
                filterable
                size="small"
                style="width: 100%"
                @change="handleChangeDepartmentVBI"
              >
                <el-option
                  v-for="(g, index) in deparmentVbis"
                  :key="index"
                  :label="g.name"
                  :value="g.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="Cán bộ QL"
              prop="employeeManagerment"
              label-width="120px"
            >
              <el-select
                v-model="form.employeeManagerment"
                placeholder="Cán bộ quản lý"
                clearable
                filterable
                size="small"
                style="width: 100%"
              >
                <el-option
                  v-for="(g, index) in employeeManagerments"
                  :key="index"
                  :label="g.name"
                  :value="g.id"
                />
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

    <el-dialog
      :title="title"
      :visible.sync="openStatus"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="formStatus" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Trạng thái" prop="status" label-width="120px">
              <el-select
                v-model="formStatus.key"
                placeholder="-- Trạng thái hoạt động --"
                clearable
                filterable
                size="small"
                style="width: 100%"
                @change="handleChangeGroupPartner"
              >
                <el-option
                  v-for="g in statusPartners"
                  :key="g.key"
                  :label="g.name"
                  :value="g.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateStatusPartner"
          >Cập nhật</el-button
        >
        <el-button @click="cancelDiaLogStatus">Hủy</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listGroupPartner,
  listPartner,
  GetSuperiorPartner,
  GetPartnerInfo,
  postPartner,
  listAllGroupPartner,
  UpdateStatusPartner,
} from "@/api/partner/partner.js";
import {
  GetWorkUnit,
  GetDeparmentByUnitId,
  GeEmployeeByDepartmentId,
  GetListAgencyCustomer,
} from "@/api/common/common.js";
import paymentype from "../../json/payment-type.json";
import keyValueCommons from "../../json/key-value-common.json";
import yesOrNo from "../../json/yes-or-no.json";
import statusPartner from "../../json/status-partner.json";
import DataTable from "../../components/Table";
export default {
  name: "Partner",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      partnerList: null,
      superiors: [],
      unitVbis: [],
      deparmentVbis: [],
      employeeManagerments: [],
      agencys: [],
      paymentypes: [],
      keyValues: [],
      yesOrNos: [],
      statusPartners: [],
      title: "",
      open: false,
      openStatus: false,
      groupPartnerOptions: [],
      form: {},
      isFormUpdate: true,
      formStatus: {},
      styleRow: "color:black;font-size: 13px;",
      styleRow_reject: "color:red;font-size: 13px;font-weight:600",
      styleRow_waitting: "color:#ffba00;font-size: 13px;font-weight:600",
      styleRow_approverd: "color:#13ce66;font-size: 13px;font-weight:600",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupPartnerId: "",
        partnerId: "",
        partnerName: "",
      },
      rules: {
        groupPartnerId: [
          {
            required: true,
            message: "Nhóm đối tác là bắt buộc",
            trigger: "change",
          },
        ],
        id: [
          {
            required: true,
            message: "Mã đối tác là bắt buộc",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "Tên đối tác là bắt buộc",
            trigger: "change",
          },
        ],
        cancelRefundFee: [
          {
            required: true,
            message: "Trường bắt buộc chọn",
            trigger: "change",
          },
        ],
        beneficiaries: [
          {
            required: true,
            message: "Trường bắt buộc chọn",
            trigger: "change",
          },
        ],
        exportOrder: [
          {
            required: true,
            message: "Trường bắt buộc chọn",
            trigger: "change",
          },
        ],
        sendMailType: [
          {
            required: true,
            message: "Trường bắt buộc chọn",
            trigger: "change",
          },
        ],
        sendOrderType: [
          {
            required: true,
            message: "Trường bắt buộc chọn",
            trigger: "change",
          },
        ],
        sendSmsType: [
          {
            required: true,
            message: "Trường bắt buộc chọn",
            trigger: "change",
          },
        ],
        managermentUnitId: [
          {
            required: true,
            message: "Địa bàn quản lý là bắt buộc",
            trigger: "change",
          },
        ],
        departmentManagerment: [
          {
            required: true,
            message: "Phòng giao dịch là bắt buộc",
            trigger: "change",
          },
        ],
        employeeManagerment: [
          {
            required: true,
            message: "Cán bộ quản lý là bắt buộc",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {},
  created() {
    this.getList();
    this.getListGroupPartner();
    this.paymentypes = paymentype.data;
    this.keyValues = keyValueCommons.data;
    this.yesOrNos = yesOrNo.data;
    this.statusPartners = statusPartner.data;
    this.getWorkUnit();
    //this.getListAgencyCustomer();
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return "font-family: monospace;font-size: 14px;";
    },
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "font-size: 12px;";
      }
    },

    // Lấy danh sách cấp trên
    getSuperiorPartner(groupId, partnerId) {
      this.loading = true;
      GetSuperiorPartner(groupId, partnerId).then((response) => {
        this.superiors = response.result;
        this.loading = false;
      });
    },
    // Lấy danh sách đơn vị VBI
    getWorkUnit() {
      this.loading = true;
      GetWorkUnit().then((response) => {
        this.unitVbis = response.result;
        this.loading = false;
      });
    },

    // Lấy danh sách phòng ban chi nhanh theo đơn vị VBI
    getDeparmentByUnitId(unitId) {
      this.loading = true;
      GetDeparmentByUnitId(unitId).then((response) => {
        this.deparmentVbis = response.result;
        this.loading = false;
      });
    },

    // Lấy danh sách nhóm đối tác
    getListGroupPartner() {
      this.loading = true;
      listAllGroupPartner().then((response) => {
        this.groupPartnerOptions = response.result;
        this.loading = false;
      });
    },

    // Lấy thông tin đối tác
    getPartnerInfo(partnerId) {
      this.loading = true;
      GetPartnerInfo(partnerId).then((response) => {
        this.getSuperiorPartner(
          response.result.groupPartnerId,
          response.result.id
        );
        this.form = response.result;
        this.open = true;
        this.title = "Cập nhật đối tác";
        this.loading = false;
      });
    },

    // Lấy thông tin cán bộ quản lý
    geEmployeeByDepartmentId(departmentId) {
      this.loading = true;
      GeEmployeeByDepartmentId(departmentId).then((r) => {
        this.employeeManagerments = r.result;
        this.loading = false;
      });
    },

    getListAgencyCustomer(key) {
      this.loading = true;
      GetListAgencyCustomer(key).then((r) => {
        this.agencys = r.result;
        this.loading = false;
      });
    },

    getList() {
      this.loading = true;
      var params = {
        filter: {
          groupPartnerId: this.queryParams.groupPartnerId,
          partnerId: this.queryParams.partnerId,
          partnerName: this.queryParams.partnerName,
        },
        orderBy: "",
        direction: 0,
        pageIndex: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        showTotal: true,
      };
      listPartner(params).then((response) => {
        this.partnerList = response.result.items;
        console.log(this.partnerList);
        this.total = response.result.count;
        this.loading = false;
      });
    },

    cancel() {
      this.open = false;
      this.reset();
    },

    reset() {
      this.form = {
        address: "",
        agencyId: "",
        aliasName: "",
        beneficiaries: "",
        dateQuantity: 0,
        departmentManagerment: "",
        employeeManagerment: "",
        exportOrder: "",
        fax: "",
        groupPartnerId: "",
        id: "",
        managermentUnitId: "",
        name: "",
        parentId: "",
        phone: "",
      };
      this.isFormUpdate = true;
      this.resetForm("form");
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
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.reset();
      this.isFormUpdate = false;
      this.open = true;
      this.title = "Thêm mới đối tác";
    },
    handleUpdate(row) {
      let id = "";
      if (row.id == undefined) {
        id = this.ids[0];
      } else {
        id = row.id;
      }
      this.reset();
      this.loading = true;
      GetPartnerInfo(id).then((r0) => {
        if (
          r0.result.cancelRefundFee == null ||
          r0.result.cancelRefundFee == ""
        )
          r0.result.cancelRefundFee = "1";
        if (r0.result.sendSmsType == null || r0.result.sendSmsType == "")
          r0.result.sendSmsType = "1";
        if (r0.result.sendMailType == null || r0.result.sendMailType == "")
          r0.result.sendMailType = "1";
        if (r0.result.sendOrderType == null || r0.result.sendOrderType == "")
          r0.result.sendOrderType = "1";
        if (r0.result.exportOrder == null || r0.result.exportOrder == "")
          r0.result.exportOrder = "1";
        if (r0.result.beneficiaries == null || r0.result.beneficiaries == "")
          r0.result.beneficiaries = "1";
        if (r0.result.agencyId == null) r0.result.agencyId = "";
        this.superiors = r0.result.managerPartner;
        this.deparmentVbis = r0.result.deparmentByUnitId;
        this.employeeManagerments = r0.result.userManagementByDeparmentId;
        this.agencys = [];
        this.form = r0.result;
        this.open = true;
        this.title = "Cập nhật đối tác";
        this.loading = false;
      });
    },

    handleUpdateStatus(row) {
      let id = this.ids;
      let status = 0;
      this.partnerList.map(function (k, v) {
        if (k.id == id) {
          status = k.status;
        }
      });
      this.formStatus.id = id;
      this.formStatus.key = status;
      this.openStatus = true;
      this.title = "Duyệt đối tác";
    },
    cancelDiaLogStatus() {
      this.openStatus = false;
    },

    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.isUpdate = this.isFormUpdate;
          if (this.isFormUpdate) {
            postPartner(this.form).then((response) => {
              this.msgSuccess("Cập nhật thành công");
              this.open = false;
              this.getList();
            });
          } else {
            postPartner(this.form).then((response) => {
              this.msgSuccess("Thêm mới thành công");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const parterId = row.id || this.ids;
      this.$confirm(
        "Bạn có chắn chắn muốn xóa " + parterId + " ?",
        "Thông báo",
        {
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          type: "warning",
        }
      )
        .then(function () {
          //this.msgSuccess("Tính năng xóa đang thực hiện...");
          //return delUser(userIds);
        })
        .then(() => {
          this.getList();
        });
    },

    handleChangeUnitVBI() {
      if (this.form.managermentUnitId == "") {
        this.deparmentVbis = [];
        this.form.departmentManagerment = "";
        this.form.employeeManagerment = "";
        this.employeeManagerments = [];
      } else {
        this.form.departmentManagerment = "";
        this.form.employeeManagerment = "";
        this.getDeparmentByUnitId(this.form.managermentUnitId);
      }
    },

    handleChangeDepartmentVBI() {
      if (this.form.departmentManagerment == "") {
        this.employeeManagerments = [];
        this.form.employeeManagerment = "";
        this.employeeManagerments = [];
      } else {
        this.form.employeeManagerment = "";
        this.geEmployeeByDepartmentId(this.form.departmentManagerment);
      }
    },

    handleChangeGroupPartner() {
      if (this.form.groupPartnerId == "") {
        this.superiors = [];
        this.form.parentId = "";
      } else {
        this.form.parentId = "";
        this.getSuperiorPartner(this.form.groupPartnerId, this.form.id);
      }
    },
    handleChangePartnerId() {
      this.getSuperiorPartner(this.form.groupPartnerId, this.form.id);
    },

    handleChangeAgency(query) {
      this.getListAgencyCustomer(query);
    },
    updateStatusPartner() {
      UpdateStatusPartner(this.formStatus.id[0], this.formStatus.key).then(
        (response) => {
          if (response.isError === false) {
            this.msgSuccess("Cập nhật trạng thái thành công");
            this.openStatus = false;
            this.getList();
          } else {
            this.msgError("Cập nhật trạng thái không thành công");
            this.openStatus = false;
          }
        }
      );
    },
  },
  components: {
    DataTable,
  },
};
</script>
<style scoped>
.table-list-partner {
  font-size: 12px !important;
}
.el-table td {
  padding: 4px 0 !important;
}
</style>
