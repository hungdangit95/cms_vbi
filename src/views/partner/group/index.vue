<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="Mã" prop="groupId">
        <el-input
          v-model="queryParams.groupId"
          placeholder="Mã nhóm"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Tên" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="Tên nhóm"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Trạng thái" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Trạng thái"
          clearable
          size="small"
        >
          <el-option
            v-for="s in statusOptions"
            :key="s.key"
            :label="s.name"
            :value="s.key"
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
          >Add</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>
    <el-table
      v-loading="loading"
      :data="postList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="table-list-group"
    >
      <el-table-column type="selection" style="width: 5%" align="center" />
      <el-table-column
        label="Mã nhóm"
        align="left"
        prop="groupId"
        style="width: 30%"
      >
        <template slot-scope="scope">
          <el-button
            style="color: black"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >{{ scope.row.groupId }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="Tên nhóm"
        align="left"
        style="width: 30%"
        prop="groupName"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-button
            style="color: black"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            >{{ scope.row.groupName }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="Trạng thái"
        align="left"
        prop="status"
        style="width: 15%"
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
            >Tạm dừng</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Ngày tạo"
        align="center"
        prop="createdDate"
        style="width: 20%"
        ><template slot-scope="scope">
          <span>{{ scope.row.createdDate | formatDate }}</span>
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

    <el-dialog
      :title="title"
      :visible.sync="open"
      :close-on-click-modal="false"
      width="1000px"
      append-to-body
      class="dialog-body"
    >
      <el-tabs v-model="currentTab" class="center-tabs" @tab-click="handleTabs">
        <el-tab-pane label="Thông tin nhóm đối tác" name="info" />
        <el-tab-pane label="Sản phẩm nhóm đối tác" name="product" />
        <el-tab-pane label="Gói bảo hiểm" name="insurances" />
        <el-tab-pane label="Đăng ký địa chỉ ip" name="ip_white_list" />
        <el-tab-pane
          v-if="this.showChildPartner"
          label="Danh sách đối tác"
          name="child_partner"
        />
      </el-tabs>
      <div class="field-box">
        <!-- Tabs info -->
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          v-show="currentTab === 'info'"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="Mã" prop="groupId" v-if="form.status == 3">
                <el-input
                  v-model="form.groupId"
                  placeholder="Mã nhóm"
                  disabled
                />
              </el-form-item>
              <el-form-item label="Mã" prop="groupId" v-if="form.status != 3">
                <el-input v-model="form.groupId" placeholder="Mã nhóm" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Tên nhóm đối tác"
                prop="groupName"
                label-width="150px"
              >
                <el-input v-model="form.groupName" placeholder="Tên nhóm" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Đtac key"
                prop="partnerKey"
                label-width="83px"
              >
                <el-input v-model="form.partnerKey" placeholder="Đối tác key" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Private key"
                prop="privateKey"
                label-width="150px"
              >
                <el-input v-model="form.privateKey" placeholder="Private key" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="TT TVV" prop="prefix">
                <el-input v-model="form.prefix" placeholder="Tiền tố TVV" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Mã đăng ký 4Sale"
                prop="referId"
                label-width="150px"
              >
                <el-input
                  v-model="form.referId"
                  placeholder="Mã đăng ký 4Sale"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Địa chỉ" prop="address">
                <el-input v-model="form.address" placeholder="Địa chỉ" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Trạng thái"
                prop="status"
                label-width="150px"
              >
                <el-select
                  v-model="form.status"
                  placeholder="Trạng thái"
                  clearable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="s in statusOptions"
                    :key="s.key"
                    :label="s.name"
                    :value="s.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" placeholder="Email" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Kiểu hóa đơn"
                prop="orderType"
                label-width="150px"
              >
                <el-select
                  v-model="form.orderType"
                  placeholder="Kiểu hóa đơn"
                  clearable
                  size="small"
                  style="width: 100%"
                >
                  <el-option
                    v-for="s in orderPaymentypes"
                    :key="s.key"
                    :label="s.name"
                    :value="s.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="dialog-footer">
            <el-col :span="24" style="text-align: center">
              <el-button type="primary" @click="submitForm">{{
                actionNameInfoGroupPartner
              }}</el-button>
              <el-button @click="cancel">Hủy</el-button>
            </el-col>
          </el-row>
        </el-form>

        <!-- Tabs sản phẩm -->
        <el-form
          v-show="currentTab === 'product'"
          size="small"
          label-width="90px"
        >
          <el-row style="max-height: 400px; overflow: auto">
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="listProducts"
                @selection-change="handleSelectionChangeListProduct"
              >
                <el-table-column type="expand">
                  <template #default="props" style="padding: 12px 0">
                    <el-table style="width: 100%" :data="props.row.listGcn">
                      <el-table-column
                        prop="key"
                        label="Chứng nhận"
                        width="110"
                      />
                      <el-table-column
                        prop="name"
                        label="Tên chứng nhận"
                        width="210"
                      />
                      <el-table-column
                        label="Mẫu in"
                        align="center"
                        style="width: 40%"
                        prop="url"
                      />
                      <el-table-column
                        label="Thủ tục"
                        align="center"
                        style="width: 25%"
                        prop="procedure"
                      >
                        <template slot-scope="scope">
                          <input
                            type="text"
                            class="procedure-name"
                            @blur="updateProcedure(scope, props.row)"
                            @change="isChange = true"
                            v-model="scope.row.procedure"
                          />
                        </template>
                      </el-table-column>

                      <el-table-column align="left" width="100">
                        <template slot-scope="scope">
                          <input
                            type="file"
                            class="upload-file-custom"
                            @change="validateFile(scope, props.row)"
                          />
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column type="selection" width="55" align="center">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.isChecked"
                      @change="handleCheckProductChange(scope.row)"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  label="Mã sản phẩm"
                  align="center"
                  width="400"
                  prop="nv"
                >
                </el-table-column>
                <el-table-column
                  label="Tên sản phẩm"
                  align="center"
                  width="400"
                  prop="ten"
                />
              </el-table>
            </el-col>
          </el-row>
          <el-row class="dialog-footer">
            <el-col :span="24" style="text-align: center">
              <el-button
                type="primary"
                style="margin-top: 10px"
                @click="handleUpdateProductForGroupPartner"
                >Cập nhật sản phẩm</el-button
              >
            </el-col>
          </el-row>
        </el-form>
        <!-- Tab goi bao hiem -->
        <el-form
          v-show="currentTab === 'insurances'"
          ref="formInsurance"
          size="small"
          :rules="ruleInsurance"
          label-width="90px"
          style="height: 100%"
          :model="formInsurance"
        >
          <el-row>
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item name="1">
                <template #title> Form đăng ký </template>
                <el-col :span="12"
                  ><el-form-item label="Gói bảo hiểm" label-width="120px">
                    <el-select
                      v-model="formInsurance.businessType"
                      placeholder="Chọn gói bảo hiểm"
                      style="width: 90%"
                      class="custom-select"
                      @change="getListPackage(this)"
                    >
                      <el-option
                        v-for="product in listBusinessPartner"
                        :key="product.businessType"
                        :label="product.businessName"
                        :value="product.businessType"
                      >
                        <span style="float: left">{{
                          product.businessType
                        }}</span>
                        <span
                          style="float: right; color: #8492a6; font-size: 13px"
                          >{{ product.businessName }}</span
                        >
                      </el-option>
                    </el-select>
                  </el-form-item></el-col
                >

                <el-col :span="12"
                  ><el-form-item label="Mã đơn vị" label-width="120px">
                    <el-select
                      v-model="formInsurance.branch"
                      placeholder="Chọn đơn vị"
                      style="width: 90%"
                      @change="getListPackage"
                    >
                      <el-option
                        v-for="item in this.vbiBranches"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select> </el-form-item
                ></el-col>
                <el-col :span="12"
                  ><el-form-item label="Gender" label-width="120px">
                    <el-select
                      v-model="formInsurance.gender"
                      placeholder="Chọn giới tính"
                      style="width: 90%"
                      @change="getListPackage"
                    >
                      <el-option label="Nam" value="nam"></el-option>
                      <el-option label="Nữ" value="nữ"></el-option>
                      <el-option label="Khác" value="khác"></el-option>
                    </el-select> </el-form-item
                ></el-col>
                <template v-if="this.listPackageInsurances.length > 0">
                  <el-col :span="12"
                    ><el-form-item
                      label="Trạng thái"
                      prop="status"
                      label-width="120px"
                    >
                      <el-select
                        v-model="formInsurance.status"
                        placeholder="Chọn trạng thái hoạt động"
                        style="width: 90%"
                        class="custom-select"
                      >
                        <el-option label="Hoạt động" value="D"></el-option>
                        <el-option label="Khóa" value="C"></el-option>
                      </el-select> </el-form-item
                  ></el-col>

                  <el-col :span="12">
                    <el-form-item
                      label="Ngày áp dụng"
                      prop="date"
                      label-width="120px"
                    >
                      <input
                        type="text"
                        id="date-custom"
                        placeholder="DD / MM / YYYY"
                        v-model="formInsurance.date"
                        v-cleave="this.options"
                        @blur="validateDate"
                      />
                    </el-form-item>
                  </el-col>
                </template>
              </el-collapse-item>
              <el-collapse-item
                title="Tìm kiếm gói bảo hiểm"
                name="2"
                v-if="this.listPackageInsurances.length > 0"
              >
                <el-row :gutter="10" class="mb8">
                  <el-col :span="1.5">
                    <el-input
                      v-model="queryInsuranceParams.input"
                      placeholder="Mã nhóm"
                      clearable
                      size="small"
                      @keyup.enter.native="searchInsurance"
                    />
                  </el-col>
                  <el-button
                    type="cyan"
                    icon="el-icon-search"
                    size="mini"
                    @click="searchInsurance"
                    >Tìm kiếm</el-button
                  >
                </el-row>
              </el-collapse-item>
            </el-collapse>
            <template v-if="this.listPackageInsurances.length > 0">
              <el-table
                :data="this.listInsuranceForPagination"
                style="width: 100%; height: 240px; overflow: auto"
                @selection-change="handleSelectionListInsurance"
              >
                <el-table-column type="selection" width="55" align="center">
                  <template slot-scope="scope">
                    <el-checkbox
                      v-model="scope.row.isChecked"
                      @change="handleInsuranceChecked(scope.row)"
                    ></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column prop="packageCode" label="Mã gói bảo hiểm">
                </el-table-column>
                <el-table-column prop="packageName" label="Tên gói bảo hiểm">
                </el-table-column>
              </el-table>
              <pagination
                style="margin-bottom: 40px"
                v-show="totalInsurance > 0"
                :total="totalInsurance"
                :page.sync="queryInsuranceParams.pageNum"
                :limit.sync="queryInsuranceParams.pageSize"
                @pagination="
                  insuranceTabPagination(
                    queryInsuranceParams.pageNum,
                    queryInsuranceParams.pageSize
                  )
                "
              />
              <el-row class="dialog-footer">
                <el-col :span="24" style="text-align: center">
                  <el-button
                    type="primary"
                    style="margin-top: 10px"
                    @click="submitFormInsurance"
                    >Cập nhật danh sách bảo hiểm</el-button
                  >
                </el-col>
              </el-row>
            </template>
            <template
              v-else-if="
                formInsurance.businessType !== undefined &&
                formInsurance.gender !== undefined
              "
            >
              <el-col :span="24">
                <h1 style="text-align: center">Không có gói bảo hiểm</h1>
              </el-col>
            </template>
          </el-row>
        </el-form>
        <!-- Tabs IP white list -->
        <el-form
          v-show="currentTab === 'ip_white_list'"
          size="small"
          label-width="90px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="Địa chỉ IP" prop="ip">
                <el-input v-model="ips.ip" placeholder="Địa chỉ IP" />
              </el-form-item>
              <el-form-item>
                <el-button type="cyan" size="mini" @click="updateIpWhiteList">{{
                  actionNameIpWhiteList
                }}</el-button>
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetFormIpWhiteList"
                ></el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="margin-left: 20px; float: right">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span>Danh sách IP</span>
                </div>
                <div style="height: 250px; overflow-y: auto">
                  <div
                    class="el-alert el-alert--warning is-light"
                    v-if="listIpWhiteLists === null"
                  >
                    <i class="el-alert__icon el-icon-warning"></i>
                    <div class="el-alert__content">
                      <span
                        class="el-alert__title"
                        style="color: gray; text-align: center"
                        >Chưa có địa chỉ IP nào.</span
                      >
                    </div>
                  </div>

                  <div
                    v-for="o in listIpWhiteLists"
                    :key="o.id"
                    class="text item item_ip"
                  >
                    {{ o.ip }}
                    <div>
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="fnClickItemUpdateIpWhiteList(o)"
                        >Modify</el-button
                      >
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDeleteIpWhiteList(o)"
                        >Delete</el-button
                      >
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-form>

        <!-- Tabs đối tác con list -->
        <el-form
          v-show="currentTab === 'child_partner'"
          size="small"
          label-width="90px"
        >
          <el-table
            style="max-height: 400; overflow: auto"
            v-loading="loading"
            sticky
            :data="listPartnerByGroupId"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="Mã đối tác"
              align="center"
              prop="id"
              width="200"
            />
            <el-table-column
              label="Tên đối tác"
              align="center"
              prop="name"
              width="380"
            />
            <el-table-column
              label="Mã ĐV QL"
              align="center"
              prop="managermentUnitId"
              width="120"
            />
            <el-table-column
              label="Người QL"
              align="center"
              prop="employeeManagerment"
              width="120"
            />
            <el-table-column
              label="Điện thoại"
              align="center"
              prop="phone"
              width="140"
            />
          </el-table>
          <pagination
            v-show="totalPartner > 0"
            :total="totalPartner"
            :page.sync="queryPartnerParams.pageNum"
            :limit.sync="queryPartnerParams.pageSize"
            @pagination="getListPartnerByGroup"
            class="custom-pagination"
          />
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listGroupPartner,
  getGroupPartnerInfo,
  getListProduct,
  listPartner,
  UpdateProductsOfGroupPartner,
  UpdateGroupPartner,
  UploadFile,
  getGCNByGroupID,
  getListBusinessPartner,
  getListPackage,
  managePackagePartner,
  getListPackageOfPartner,
} from "@/api/partner/partner.js";
import {
  GetListIpWhiteListByGroupId,
  PostListIpWhiteList,
} from "@/api/index.js";
import { generator } from "../../../utils/auth";
import statusGroupPartner from "../../../json/status-group-partner.json";
import orderPaymentype from "../../../json/order-payment-type.json";
import gcnType from "../../../json/gcn-type.json";
import vbiBranch from "../../../json/VBI-branch.json";
import Cleave from "cleave.js";
import moment from "moment";

export default {
  name: "GroupPartner",
  data() {
    return {
      isShowBoxListPartner: true,
      actionNameIpWhiteList: "Thêm mới",
      actionNameInfoGroupPartner: "Thêm mới",
      currentTab: "info",
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      isChange: false,
      showChildPartner: true,
      total: 0,
      totalPartner: 0,
      totalInsurance: 0,
      postList: [],
      listPartnerByGroupId: [],
      listProducts: [],
      listBusinessPartner: [],
      listPackageInsurances: [],
      listInsuranceForPagination: [],
      listInsurancePicked: [],
      listInsurancePickedFromAPI: [],
      listIpWhiteLists: [],
      title: "",
      open: false,
      statusOptions: [],
      orderPaymentypes: [],
      gcnTypes: [],
      vbiBranches: [],
      listProductWithGCNType: [],
      styleRow: "color:black;font-size: 13px;",
      styleRow_reject: "color:red;font-size: 13px;font-weight:600",
      styleRow_waitting: "color:#ffba00;font-size: 13px;font-weight:600",
      styleRow_approverd: "color:#13ce66;font-size: 13px;font-weight:600",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: "",
        groupName: "",
        status: null,
      },
      queryPartnerParams: {
        pageNum: 1,
        pageSize: 10,
        groupId: "",
        groupName: "",
        status: null,
      },
      queryInsuranceParams: {
        pageNum: 1,
        pageSize: 10,
        input: "",
      },
      form: {},
      formInsurance: {},
      ips: {
        id: 0,
        ip: "",
        groupId: "",
        status: 0,
      },
      options: {
        date: true,
        delimiter: " / ",
        datePattern: ["d", "m", "Y"],
      },
      rules: {
        groupId: [
          { required: true, message: "Mã nhóm là bắt buộc", trigger: "change" },
        ],
        groupName: [
          {
            required: true,
            message: "Tên nhóm là bắt buộc",
            trigger: "change",
          },
        ],
        partnerKey: [
          {
            required: true,
            message: "Đối tác key là bắt buộc",
            trigger: "change",
          },
        ],
        privateKey: [
          {
            required: true,
            message: "Private key là bắt buộc",
            trigger: "change",
          },
        ],
        address: [
          { required: true, message: "Địa chỉ là bắt buộc", trigger: "change" },
        ],
        status: [
          {
            required: true,
            message: "Trạng thái là bắt buộc",
            trigger: "change",
          },
        ],
        email: [
          { required: true, message: "Email là bắt buộc", trigger: "change" },
        ],
        orderType: [
          {
            required: true,
            message: "Kiểu hóa là bắt buộc",
            trigger: "change",
          },
        ],
      },
      ruleInsurance: {
        status: [
          { required: true, message: "Chọn trạng thái", trigger: "change" },
        ],
        date: [
          {
            required: true,
            message: "Nhập ngày áp dụng",
            trigger: "change",
          },
        ],
      },
      activeName: "1",
    };
  },
  components: {
    Cleave,
  },
  created() {
    this.getList();
    this.getListProducts();
    this.statusOptions = statusGroupPartner.data;
    this.orderPaymentypes = orderPaymentype.data;
    this.gcnTypes = gcnType.data;
    this.vbiBranches = vbiBranch.data;
  },
  directives: {
    cleave: {
      inserted: (el, binding) => {
        el.cleave = new Cleave(el, binding.value || {});
      },
      update: (el) => {
        const event = new Event("input", { bubbles: true });
        setTimeout(function () {
          el.value = el.cleave.properties.result;
          el.dispatchEvent(event);
        }, 100);
      },
    },
  },
  methods: {
    /** Lấy danh sách nhóm đối tác */
    getList() {
      this.loading = true;
      var params = {
        filter: {
          groupId: this.queryParams.groupId,
          groupName: this.queryParams.groupName,
          status: this.queryParams.status == null ? 6 : this.queryParams.status,
        },
        orderBy: "CreatedDate",
        direction: 0,
        pageIndex: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        showTotal: true,
      };
      if (params.filter.status == "") params.filter.status = 6;
      listGroupPartner(params).then((response) => {
        this.postList = response.result.items;
        this.total = response.result.count;
        this.loading = false;
      });
    },

    /** Lấy danh sách sản phẩm */
    getListProducts() {
      this.loading = true;
      getListProduct().then((response) => {
        if (response.result.length > 0) {
          response.result.map(function (value, key) {
            value.isChecked = false;
          });
          this.listProducts = response.result;
        }
        this.loading = false;
      });
    },

    /** function lấy danh sách ip white list */
    getListIpWhiteListByGroupId(groupId) {
      this.loading = true;
      GetListIpWhiteListByGroupId(groupId).then((response) => {
        this.listIpWhiteLists = response.result;
        this.ips.ip = "";
        this.ips.id = 0;
        this.ips.status = 0;
        this.actionNameIpWhiteList = "Thêm mới";
        this.loading = false;
      });
    },

    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        groupId: undefined,
        groupName: undefined,
        postSort: 0,
        status: null,
        remark: undefined,
      };
      this.resetForm("form");
      this.listIpWhiteLists = [];
      this.listProducts.map(function (k, v) {
        k.isChecked = false;
      });
      this.formInsurance = {
        businessType: undefined,
        gender: undefined,
      };
      this.activeName = "1";
      this.listPackageInsurances = [];
      this.currentTab = "info";
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.groupId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    handleSelectionChangeListProduct(selection) {
      if (selection.length > 0) {
        this.listProducts.map(function (value, key) {
          value.isChecked = true;
        });
      } else {
        this.listProducts.map(function (value, key) {
          value.isChecked = false;
        });
      }
    },
    handleCheckProductChange(selection) {
      this.listProducts.map(function (value, key) {
        if (value.nv == selection.nv) {
          value.isChecked = selection.isChecked;
        }
      });
    },

    /** Cập nhật sản phẩm cho nhóm đối tác */
    handleUpdateProductForGroupPartner() {
      getGroupPartnerInfo(this.form.groupId).then((response) => {
        if (response.result == null) {
          this.msgError(
            "Thông tin nhóm đối tác chưa có, Bạn cần tạo thông tin đối tác trước"
          );
          this.currentTab = "info";
        } else {
          let products = [];
          this.listProducts.map(function (k, v) {
            if (k.isChecked) {
              products.push({ productId: k.nv });
            }
          });
          let data = {
            groupId: this.form.groupId,
            productOfGroups: products,
          };
          UpdateProductsOfGroupPartner(data).then((res) => {
            if (!res.isError && res.statusCode == 200) {
              this.msgSuccess("Cập nhật sản phẩm thành công!");
              this.currentTab = "insurances";
            } else {
              this.msgError(res.message);
            }
          });
        }
      });
    },

    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Thêm mới";
      this.actionNameInfoGroupPartner = "Thêm mới";
      this.showChildPartner = false;
      this.form.partnerKey = generator(40);
      this.form.privateKey = generator(40);
    },

    getListPartnerByGroup() {
      this.loading = true;
      var params = {
        filter: {
          groupPartnerId: this.form.groupId,
          partnerId: "",
          partnerName: "",
        },
        orderBy: "",
        direction: 0,
        pageIndex: this.queryPartnerParams.pageNum,
        pageSize: this.queryPartnerParams.pageSize,
        showTotal: true,
      };
      listPartner(params).then((response) => {
        this.listPartnerByGroupId = response.result.items;
        this.totalPartner = response.result.count;
        this.loading = false;
      });
    },

    /** Cập nhật hoặc tạo mới nhóm đối tác */
    handleUpdate(row) {
      this.reset();
      this.actionNameInfoGroupPartner = "Cập nhật";
      const groupId = row.groupId;
      this.listProducts.map(function (value, key) {
        value.isChecked = false;
      });
      let gcnTypes = this.gcnTypes;
      getGroupPartnerInfo(groupId).then((response) => {
        this.listProducts.map(function (value, key) {
          let arrGcn = [];
          gcnTypes.map(function (k, v) {
            arrGcn.push({ key: k.key, name: k.name, url: "", procedure: "" });
          });
          value.listGcn = arrGcn;
          var item = response.result.products.find(
            (item) => item.nv === value.nv
          );
          if (item !== undefined) {
            value.isChecked = true;
          }
        });

        this.form = response.result;
        this.open = true;
        this.title = "Cập nhật";
      });
    },

    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.groupId != undefined) {
            let info = {
              id: this.form.groupId,
              name: this.form.groupName,
              orderType: this.form.orderType,
              partnerKey: this.form.partnerKey,
              logo: "",
              userManager: "",
              privateKey: this.form.privateKey,
              url: "",
              procedure: "",
              managerment: "",
              prefix: this.form.prefix,
              referId: this.form.referId,
              email: this.form.email,
              address: this.form.address,
              status: this.form.status,
              isCms: true,
              isUpdate: false,
            };
            UpdateGroupPartner(info).then((response) => {
              this.msgSuccess("Thêm mới nhóm đối tác thành công");
              this.currentTab = "product";
            });
          }
        }
      });
    },

    /** Lấy danh sách IP white list */
    handleTabs(tab, event) {
      if (tab.name == "ip_white_list") {
        this.getListIpWhiteListByGroupId(this.form.groupId);
      } else if (tab.name == "child_partner") {
        this.getListPartnerByGroup();
      } else if (tab.name == "product") {
        this.getGCN(this.form.groupId);
      } else if (tab.name == "insurances") {
        this.getListBusinessPartner(this.form.groupId);
      }
    },

    /** Cập nhật hoặc tạo mới IP white list */
    updateIpWhiteList() {
      this.loading = true;
      this.ips.groupId = this.form.groupId;
      PostListIpWhiteList(this.ips).then((response) => {
        this.loading = false;
        if (!response.isError && response.statusCode == 200) {
          if (this.ips.id != 0 && this.ips.status == 0) {
            this.msgSuccess("Cập nhật Ip thành công");
          } else if (this.ips.status == 2) {
            this.msgSuccess("Xóa Ip thành công");
          } else {
            this.msgSuccess("Thêm mới Ip thành công");
          }
          this.getListIpWhiteListByGroupId(this.form.groupId);
        }
      });
    },

    fnClickItemUpdateIpWhiteList(row) {
      this.actionNameIpWhiteList = "Cập nhật";
      this.ips.ip = row.ip;
      this.ips.id = row.id;
      this.ips.status = 0;
    },

    handleDeleteIpWhiteList(row) {
      this.ips.status = 2;
      this.ips.ip = row.ip;
      this.ips.id = row.id;
      this.ips.groupId = row.groupId;
      this.updateIpWhiteList();
    },

    resetFormIpWhiteList() {
      this.actionNameIpWhiteList = "Thêm mới";
      this.ips.ip = "";
      this.ips.id = 0;
      this.ips.status = 0;
    },

    validateFile(scope, data) {
      let file = document.getElementsByClassName("upload-file-custom")[
        scope.$index
      ].files;
      if (file[0].type === "text/xml" && file[0].size <= 3 * 1024 * 1024) {
        let group = this.form.groupId;
        let nv = data.nv;
        let gcn = scope.row.key;
        UploadFile(group, nv, gcn, null, file[0]).then((response) => {
          if (response.isError === false) {
            this.getGCN(group);
            this.msgSuccess("Upload file thành công");
          } else this.msgError("Xin thử lại");
        });
      } else {
        this.msgError("Vui lòng chọn file xml và size nhỏ hơn 3MB");
      }
    },

    updateProcedure(scope, data) {
      let procedure = scope.row.procedure;
      if (procedure && this.isChange === true) {
        let group = this.form.groupId;
        let nv = data.nv;
        let gcn = scope.row.key;
        UploadFile(group, nv, gcn, procedure, null).then((response) => {
          if (response.isError === false) {
            this.getGCN(group);
            this.msgSuccess("Update thủ tục thành công");
          } else this.msgError(response.message);
        });
        this.isChange = false;
      }
    },

    getGCN(groupId) {
      getGCNByGroupID(groupId).then((res) => {
        if (!res.isError && res.statusCode == 200) {
          let arrProduct = this.listProducts;
          res.result.map(function (k, v) {
            arrProduct.map(function (k1, v1) {
              if (k.nv == k1.nv) {
                k1.listGcn.map(function (k2, v2) {
                  if (k2.key == k.loai) {
                    k2.url = k.url;
                    if (k.procedurE_NAME !== "null")
                      k2.procedure = k.procedurE_NAME;
                  }
                });
              }
            });
          });
        }
      });
    },
    getListBusinessPartner(groupId) {
      getListBusinessPartner(groupId).then((response) => {
        if (!response.isError && response.result.length > 0) {
          this.listBusinessPartner = response.result;
        }
      });
    },
    getListPackage() {
      let groupId = this.form.groupId;
      let businessType = this.formInsurance.businessType;
      let gender =
        this.formInsurance.gender !== "khác" ? this.formInsurance.gender : null;
      if (
        businessType !== undefined &&
        this.formInsurance.branch !== undefined
      ) {
        getListPackage(businessType, gender).then((response) => {
          if (!response.isError && response.result.length > 0) {
            response.result.map(function (value, key) {
              value.isChecked = false;
            });
            this.listPackageInsurances = response.result;
            this.totalInsurance = response.result.length;
            this.listInsuranceForPagination = response.result.slice(0, 10);
            getListPackageOfPartner(groupId, businessType).then((response) => {
              if (!response.isError) {
                response.result.map((o) => {
                  this.listPackageInsurances.find((i) => {
                    if (i.packageCode === o.packageCode) {
                      i.isChecked = true;
                    }
                  });
                });
              }
            });
          } else {
            this.listPackageInsurances = [];
          }
        });
      }
    },
    insuranceTabPagination(pageNum, pageSize) {
      let pageNumber = pageNum ? pageNum : 1;
      let numberInsuranceInPage = pageSize ? pageSize : 10;
      // neu co input nhap tai o search thi chay function search
      this.queryInsuranceParams.input && this.searchInsurance();
      let listPackageInsurances = this.queryInsuranceParams.input
        ? this.listInsuranceForPagination
        : this.listPackageInsurances;
      let listInsurance = [];
      listPackageInsurances.map((element, i) => {
        if (i % numberInsuranceInPage === 0) {
          listInsurance.push(
            listPackageInsurances.slice(i, i + numberInsuranceInPage)
          );
        }
      });
      this.listInsuranceForPagination = listInsurance[pageNumber - 1];
    },
    handleSelectionListInsurance(selection) {
      if (selection.length > 0) {
        this.listInsuranceForPagination.map(function (value, key) {
          value.isChecked = true;
        });
      } else {
        this.listInsuranceForPagination.map(function (value, key) {
          value.isChecked = false;
        });
      }
    },
    handleInsuranceChecked(scope) {
      this.listInsuranceForPagination.map((o, i) => {
        if (o.packageCode === scope.packageCode) {
          o.isChecked = scope.isChecked;
          this.listInsurancePicked.push(o);
        }
      });
    },
    searchInsurance() {
      let input = this.queryInsuranceParams.input.toLowerCase();
      if (input === "") {
        this.insuranceTabPagination();
      } else {
        let listInsuranceChecked = this.listPackageInsurances.filter(
          (o) => o.isChecked === true
        );
        this.listInsuranceForPagination = this.listPackageInsurances.filter(
          (o) =>
            o.packageName.toLowerCase().includes(input) ||
            o.packageCode.toLowerCase().includes(input)
        );
        listInsuranceChecked.map((o) => {
          let test = this.listInsuranceForPagination.find(
            (ins) => ins.packageCode === o.packageCode
          );
          const index = this.listInsuranceForPagination.indexOf(test);
          if (index > -1) {
            this.listInsuranceForPagination.splice(index, 1);
          }
          this.listInsuranceForPagination.unshift(o);
        });
        this.totalInsurance = this.listInsuranceForPagination.length;
      }
    },
    validateDate(event) {
      let date = document.getElementById("date-custom");
      if (event.target.value.length === 14) {
        date.nextSibling && date.nextSibling.remove();
        date.style.borderColor = "#DCDFE6";
      } else {
        date.style.borderColor = "red";
      }
    },
    submitFormInsurance() {
      this.$refs["formInsurance"].validate((valid) => {
        if (valid && this.formInsurance.date.length === 14) {
          if (this.listInsurancePicked.length === 0) {
            this.msgError("Vui lòng chọn gói bảo hiểm trước khi cập nhật");
          } else {
            this.listInsurancePicked.forEach((element) => {
              let date = this.formInsurance.date;
              let formatDate = moment(
                date.replaceAll(/\s/g, ""),
                "DD/MM/YYYY"
              ).format("YYYY/MM/DD");

              date = formatDate.replaceAll(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
              let data = {
                partnerCode: this.form.groupId,
                packageCode: "",
                startDate: date,
                startAge: 0,
                endAge: 0,
                status: this.formInsurance.status,
                serviceCode: this.formInsurance.businessType,
                genger: this.formInsurance.gender,
              };

              data.packageCode = element.packageCode;
              managePackagePartner(JSON.stringify(data)).then((response) => {
                if (!response.isError && response.statusCode === 200) {
                  this.msgSuccess("Cập nhật gói bảo hiểm thành công!");
                  this.currentTab = "ip_white_list";
                } else {
                  this.msgError(response.message);
                }
              });
            });
          }
        } else {
          document.getElementById("date-custom").style.borderColor = "red";
          this.activeName = "1";
        }
      });
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

.el-alert {
  padding: 8px 0;
}

.upload-file-custom::file-selector-button {
  visibility: hidden;
}
.upload-file-custom::before {
  content: "Upload";
  display: inline-block;
  background: #409eff;
  border: 1px solid #409eff;
  border-radius: 3px;
  padding: 3px 20px;
  outline: none;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  color: white;
  font-weight: 700;
  font-size: 10pt;
}
.upload-file-custom:hover::before {
  border-color: #7ab1ea;
  background: #7ab1ea;
}
.upload-file-custom:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}
.dialog-footer {
  padding: 0 0 30px 0;
}
.custom-pagination {
  padding: 60px 16px !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.custom-table {
  padding: 0 !important;
}

.custom-select {
  margin-left: 0;
}

#date-custom {
  width: 90%;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  outline: none;
  padding: 0 15px;
  color: #606266;
}
#date-custom:focus {
  outline: none;
  border-color: #1890ff;
}
#date-custom:hover {
  outline: none;
  border-color: #c0c4cc;
}
#date-custom::placeholder {
  color: #c0c4cc;
}

.procedure-name {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  outline: none;
  padding: 0 15px;
  color: #606266;
  height: 32px;
  line-height: 32px;
}
</style>