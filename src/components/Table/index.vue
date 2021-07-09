<template >
  <el-table
    border
    style="width: 100%"
    v-loading="loading"
    :data="data"
    class="table-list-partner"
    :row-style="tableRowStyle"
    :header-cell-style="tableHeaderColor"
  >
    <template v-if="metadata.canSelectAll == true">
      <el-table-column type="selection" style="width: 50%" align="center" />
    </template>
    <template v-for="(column, index) in metadata.columns">
      <template v-if="column.displayType == 'template'">
        <el-table-column
          :key="index"
          v-bind="column"
          :prop="column.fieldName"
          :label="column.name"
          :style="column.style"
          :width="column.width"
        >
          <template slot-scope="scope">
            <slot
              v-bind="{
                scope: scope,
                templateName: column.templateName,
              }"
            ></slot>
          </template>
        </el-table-column>
      </template>
      <template v-if="column.displayType == 'datetime'">
        <el-table-column
          :key="index"
          v-bind="column"
          :prop="column.fieldName"
          :label="column.fieldName"
          :style="column.style"
          :width="column.width"
        >
          <template slot-scope="scope">
            <span>{{ scope.row[column.fieldName] | formatDate }}</span>
          </template>
        </el-table-column>
      </template>
      <template v-if="column.displayType == 'text'">
        <el-table-column
          :key="index"
          v-bind="column"
          :prop="column.fieldName"
          :label="column.fieldName"
          :style="column.style"
          :width="column.width"
        >
        </el-table-column>
      </template>
    </template>
  </el-table>
</template>

<script>
import { get } from "lodash";

export default {
  name: "data-table",
  props: {
    loading: Boolean,
    data: Array,
    metadata: Object,
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
    getText(rowData, fieldName) {
      const value = fieldName ? get(rowData, fieldName, rowData) : undefined;
      return value === undefined ? "-" : value;
    },
  },
};
</script>
