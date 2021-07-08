<template >
  <el-table
    border
    style="width: 100%"
    v-loading="loading"
    :data="data != null ? data : []"
    class="table-list-partner"
    :row-style="tableRowStyle"
    :header-cell-style="tableHeaderColor"
  >
    <template v-if="metadata.canSelectAll == true">
      <el-table-column type="selection" style="width: 50%" align="center" />
    </template>
    <template v-for="(column, index) in metadata.columns">
      <!-- <template v-if="column.displayType == 'template'"> 
          <el-table-column
            :key="index"
            v-bind="column"
            :prop="column.fieldName"
            :label="column.fieldName"
            :style="column.style"
            :width="column.width"
      >

      </el-table-column>
        
      </template> -->
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
// const DataTableSelectMode = {
//   none = 0,
//   single = 1,
//   multiple = 2,
// }

// const  DataTableDataDisplayType = {
//   index = 0,
//   text,
//   datetime,
//   template,
// }

// const DataTableColumnDisplayMode = {
//   always = 1,
//   hidden = 2,
//   visible = 3,
// }

export default {
  name: "data-table",
  props: {
    loading: Boolean,
    data: Array,
    metadata: Object,
  },
  created: function () {
    console.log(this.data, this.metadata, this.everthingIsReady);
  },
  mounted: function () {},
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
      debugger;
      const value = fieldName ? get(rowData, fieldName, rowData) : undefined;
      return value === undefined ? "-" : value;
    },
  },
  directives: {
    test: {
      bind(el, binding) {
        debugger;
        console.log(el, binding);
      },
    },
  },
};
</script>
