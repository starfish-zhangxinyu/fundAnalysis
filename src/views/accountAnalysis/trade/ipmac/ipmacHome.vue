<!--账户规律分析详情页-->
<template>
  <div id="ipmacHome">
    <div class="content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="ip分析" name="first"><ip /></el-tab-pane>
        <el-tab-pane label="mac分析" name="second"><mac /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ip from "./components/ip";
import mac from "./components/mac";

export default {
  name: "ipmacHome",
  components: { ip, mac },
  inject: ["reload"],
  data() {
    return {
      activeName: "first",
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
#ipmacHome {
  width: 100%;
  .identityCard {
    width: 100%;
    background-color: #66b1ff;
    span {
      color: #fff;
      margin-right: 6%;
    }
  }
  /* 修改card padding */
  /deep/.el-card__body {
    padding: 14px;
  }
}
</style>
