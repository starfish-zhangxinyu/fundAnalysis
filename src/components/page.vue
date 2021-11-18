<!--
 * @Author: your name
 * @Date: 2021-01-28 10:30:58
 * @LastEditTime: 2021-03-05 15:34:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bwxti:\webstorm\资金分析工具(新)\fundAnalysis\src\components\page.vue
-->
<template>
  <div id="page">
    <el-pagination
      :page-size="20"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      layout="total, prev, pager, next,jumper"
      :total="total"
      background
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "page",
  props: {
    currentPg: Number,
    totalPage: Number,
  },
  data() {
    return {
      currentPage: this.currentPg,
      total: this.totalPage,
    };
  },
  watch: {
    currentPg: function (val) {
      this.currentPage = val;
    },
    totalPage: function (val) {
      this.total = val;
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("pageChange", val);
    },
  },
};
</script>
<style lang="less" scoped>
</style>
