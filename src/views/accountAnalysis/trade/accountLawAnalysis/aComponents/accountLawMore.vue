<!--账户规律分析详情页-->
<template>
  <div id="accountLawMore">
    <el-card shadow="hover" class="identityCard">
      <span>交易户名：{{ name }} </span>
      <span>交易卡号：{{ card }}</span>
    </el-card>
    <div class="content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane label="人员档案" name="infor">人员档案</el-tab-pane> -->
        <el-tab-pane label="交易明细分析" name="first"
          ><jymx :fCard="card"
        /></el-tab-pane>
        <el-tab-pane label="交易对手卡号分析" name="second"
          ><jydskh
        /></el-tab-pane>
        <el-tab-pane
          label="交易对手户名分析"
          name="name"
          v-if="this.$route.query.name"
          ><jydshm
        /></el-tab-pane>

        <!-- <el-tab-pane label="摘要备注分析" name="third"
          >摘要备注分析</el-tab-pane
        >
        <el-tab-pane label="现金转账分析" name="four">现金转账分析</el-tab-pane>
        <el-tab-pane label="交易类型分析" name="five">交易类型分析</el-tab-pane>
        <el-tab-pane label="交易金额分析" name="six">交易金额分析</el-tab-pane>
        <el-tab-pane label="快进快出分析" name="seven"
          >快进快出分析</el-tab-pane
        >
        <el-tab-pane label="活跃时间分析" name="eight"
          >活跃时间分析</el-tab-pane
        >
        <el-tab-pane label="交易时间分析" name="nine">交易时间分析</el-tab-pane>
        <el-tab-pane label="交易时段统计" name="ten">交易时段统计</el-tab-pane>
        <el-tab-pane label="活动轨迹分析" name="eleven"
          >活动轨迹分析</el-tab-pane
        >
        <el-tab-pane label="定时任务补偿" name="twelve"
          >定时任务补偿</el-tab-pane
        > -->
      </el-tabs>
    </div>
    <div class="page"></div>
  </div>
</template>

<script>
import jymx from "../aComponents/moreCom/jymx";
import jydskh from "../aComponents/moreCom/jydskh";
import jydshm from "../aComponents/moreCom/jydshm";

export default {
  name: "accountLawMore",
  components: { jymx, jydskh, jydshm },
  inject: ["reload"],
  data() {
    return {
      card: "", //卡号
      name: "", //户名
      activeName: "first",
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    this.changeTitle();
  },
  watch: {
    $route() {
      this.changeTitle();
    },
  },
  methods: {
    /* 交易户名和卡号 */
    changeTitle() {
      if (this.$route.query.name == "") {
        this.name = "空";
      } else {
        this.name = this.$route.query.name;
      }
      if (this.$route.query.fundcard == "") {
        this.card = "空";
      } else {
        this.card = this.$route.query.fundcard;
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
  },
};
</script>

<style lang="less" scoped>
#accountLawMore {
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