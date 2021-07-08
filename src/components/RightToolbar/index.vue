<template>
  <div class="top-right-btn">
    <el-row>
      <el-tooltip class="item" effect="dark" :content="showSearch ? 'Hide' : 'Show'" placement="top">
        <el-button size="mini" circle icon="el-icon-search" @click="toggleSearch()" />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Làm mới" placement="top">
        <el-button size="mini" circle icon="el-icon-refresh" @click="refresh()" />
      </el-tooltip>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "RightToolbar",
  data() {
    return {};
  },
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    toggleSearch() {
      this.$emit("update:showSearch", !this.showSearch);
    },
    refresh() {
      this.$emit("queryTable");
    },
  },
};
</script>
