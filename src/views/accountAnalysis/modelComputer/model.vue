<!--
 * @Author: your name
 * @Date: 2021-01-28 10:30:58
 * @LastEditTime: 2021-02-01 10:11:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \bwxti:\webstorm\资金分析工具(新)\fundAnalysis\src\views\accountAnalysis\modelComputer\model.vue
-->
<!--模型计算-->
<template>
  <div id="model">
    <div class="step">
      <div class="stepItem">
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="开始计算"></el-step>
          <el-step title="数据统计"></el-step>
          <el-step title="IPMAC分析"></el-step>
          <el-step title="现金匹配计算"></el-step>
        </el-steps>
        <el-steps :active="activeT" finish-status="success" simple>
          <el-step title="摘要备注分析"></el-step>
          <el-step title="待调单账户分析"></el-step>
          <el-step title="账户类型识别"></el-step>
          <el-step title="计算完成"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "model",
  components: {},
  data() {
    return {
      active: 0,
      activeT: -1,
      t: "",
    };
  },
  mounted() {
    this.t = setInterval(this.test, 1000);
  },
  beforeDestroy() {
    clearInterval(this.t);
  },
  methods: {
    test() {
      if (this.active < 4) {
        this.active++;
      } else if (this.active == 4) {
        this.activeT = 1;
        this.active = 5;
      } else if (this.activeT >= 0 && this.activeT < 4) {
        this.activeT++;
      } 
      else if(this.activeT == 4){
        this.activeT = 5
        this.$message({
          message: '数据计算完毕',
          type: 'success'
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
#model {
  width: 100%;
  .step {
    width: 100%;

    .el-steps {
      margin: 10% 8%;
    }
  }
}
</style>