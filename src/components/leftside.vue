<!--左侧菜单导航-->
<template>
  <div class="leftside">
    <el-menu
      style="border-right: none; font-size: 18px"
      class="el-menu-vertical-demo"
      background-color="#1F469A"
      text-color="#fff"
      router
      :collapse="collapse"
      :default-active="activePath"
      active-text-color="#ffd04b"
    >
      <el-submenu index="importData">
        <template slot="title">
          <i class="el-icon-document-add"></i>
          <span>案件管理</span>
        </template>
        <el-menu-item index="/caseList">
          <i class="el-icon-menu"></i>
          <span slot="title" style="font-size: 15px">案件列表</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="caseManage">
        <template slot="title">
          <i class="el-icon-monitor"></i>
          <span>数据治理</span>
        </template>
        <el-menu-item index="/transactionDetails">
          <i class="el-icon-menu"></i>
          <span slot="title" style="font-size: 15px">数据导入</span>
        </el-menu-item>
        <!-- <el-menu-item index="/transactionDetails">交易明细</el-menu-item> -->
        <!-- <el-menu-item index="/accountInfor">开户信息</el-menu-item> -->
        <el-menu-item index="/dataClean">
          <i class="el-icon-menu"></i>
          <span slot="title" style="font-size: 15px">数据快照</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="accountAnalysis">
        <template slot="title">
          <i class="el-icon-mobile"></i>
          <span>账号分析</span>
        </template>
        <!--   <el-menu-item index="/model">
          <i class="el-icon-menu"></i>
          <span slot="title">模型计算</span>
        </el-menu-item> -->
        <el-submenu index="accountStatistics">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span style="font-size: 15px">账户统计</span>
          </template>
          <el-menu-item index="/accountDictionary">账户字典表</el-menu-item>
          <el-menu-item index="/acountCard">交易对手汇总(卡号)</el-menu-item>
          <el-menu-item index="/acountName">交易对手汇总(户名)</el-menu-item>
          <el-menu-item index="/StatisticalStatement">账户统计表</el-menu-item>
          <el-menu-item index="/accountInforSheet">账户信息表</el-menu-item>
        </el-submenu>
        <el-menu-item index="/accountGroup">
          <i class="el-icon-menu"></i>
          <span slot="title" style="font-size: 15px">账户分组</span>
        </el-menu-item>
        <el-submenu index="trade">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span style="font-size: 15px">交易分析</span>
          </template>
          <el-menu-item index="/externalCapitalFlow">账户关联分析</el-menu-item>
          <el-menu-item index="/accountLawAnalysis">账户规律分析</el-menu-item>
          <el-menu-item index="/ipmacHome">IPMAC分析</el-menu-item>
          <!-- <el-menu-item index="/commonCounterparty">共同交易对手</el-menu-item> -->
          <el-menu-item index="/timeSliceAnalysis">时间切片分析</el-menu-item>
          <!-- <el-menu-item index="/counterpartyAnalysis">交易对手分析</el-menu-item> -->
          <!-- <el-menu-item index="/timeSeriesAnalysis">时序分析</el-menu-item> -->
          <!-- <el-menu-item index="/abstractRemarkAnalysis">摘要备注分析</el-menu-item> -->
        </el-submenu>
      </el-submenu>
      <el-submenu index="throughAnalysis">
        <template slot="title">
          <i class="el-icon-finished"></i>
          <span>穿透分析</span>
        </template>
        <el-menu-item index="/linkAnalysis">
          <i class="el-icon-menu"></i>
          <span slot="title" style="font-size: 15px">链路分析</span>
        </el-menu-item>
        <!-- <el-menu-item index="/loopAnalysis">
          <i class="el-icon-menu"></i>
          <span slot="title">环路分析</span>
        </el-menu-item> -->
      </el-submenu>

      <!-- <el-submenu index="Model (rule)">
        <template slot="title">
          <i class="el-icon-mouse"></i>
          <span>模型(规律)分析</span>
        </template>
        <el-submenu index="IPMAC">
          <template slot="title">
            <i class="el-icon-menu"></i>
            IPMAC分析
          </template>
          <el-menu-item index="/IP">IP</el-menu-item>
          <el-menu-item index="/MAC">MAC</el-menu-item>
        </el-submenu>
        <el-menu-item index="/money">
          <i class="el-icon-menu"></i>
          <span slot="title">现金匹配分析</span>
        </el-menu-item>
        <el-submenu index="errorAnalysis">
          <template slot="title">
            <i class="el-icon-menu"></i>
            异常交易分析
          </template>
          <el-menu-item index="/large">大额交易</el-menu-item>
          <el-menu-item index="/highTrade">高频交易</el-menu-item>
          <el-menu-item index="/active">活跃账号</el-menu-item>
          <el-menu-item index="/largeAmountCash">大额取现</el-menu-item>
          <el-menu-item index="/fastForwardquickly">快进快出</el-menu-item>
          <el-menu-item index="/test">测试账号</el-menu-item>
          <el-menu-item index="/shortTermActive">短期活跃</el-menu-item>
        </el-submenu>
        <el-menu-item index="/abstractRemark">
          <i class="el-icon-menu"></i>
          <span slot="title">摘要备注分析</span>
        </el-menu-item>
        <el-menu-item index="/pendingAccount">
          <i class="el-icon-menu"></i>
          <span slot="title">待调单账户分析</span>
        </el-menu-item>
        <el-submenu index="behave">
          <template slot="title">
            <i class="el-icon-menu"></i>
            交易行为分析
          </template>
          <el-menu-item index="/sameNetwork">同网点账户</el-menu-item>
          <el-menu-item index="/amountFeatures">交易金额特征</el-menu-item>
          <el-menu-item index="/range">交易金额区间规律</el-menu-item>
          <el-menu-item index="/time">交易时间规律</el-menu-item>
          <el-menu-item index="/date">交易日期规律</el-menu-item>
          <el-menu-item index="/type">交易类型分析</el-menu-item>
        </el-submenu>
        <el-submenu index="typeIdentificate">
          <template slot="title">
            <i class="el-icon-menu"></i>
            账户类型识别
          </template>
          <el-menu-item index="/collection">归集账户</el-menu-item>
          <el-menu-item index="/transfer">中转账户</el-menu-item>
          <el-menu-item index="/deposit">沉淀账户</el-menu-item>
          <el-menu-item index="/rebate">返利账户</el-menu-item>
          <el-menu-item index="/unidentification">未识别账户</el-menu-item>
        </el-submenu>
        <el-submenu index="clan">
          <template slot="title">
            <i class="el-icon-menu"></i>
            账户集群分析
          </template>
          <el-menu-item index="/clust">集群分析</el-menu-item>
          <el-menu-item index="/similar">相似账号</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="/report">
        <i class="el-icon-s-flag"></i>
        <span slot="title">报告生成</span>
      </el-menu-item>
      <el-submenu index="tool">
        <template slot="title">
          <i class="el-icon-s-tools"></i>
          <span>工具库</span>
        </template>
        <el-menu-item index="/identityCard">
          <i class="el-icon-menu"></i>
          <span slot="title">身份证查询工具</span>
        </el-menu-item>
        <el-menu-item index="/bankCard">
          <i class="el-icon-menu"></i>
          <span slot="title">银行卡查询工具</span>
        </el-menu-item>
        <el-menu-item index="/telephone">
          <i class="el-icon-menu"></i>
          <span slot="title">电话号码查询工具</span>
        </el-menu-item>
      </el-submenu> -->
      <!-- <el-submenu index="user">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/userlist">
          <i class="el-icon-menu"></i>
          <span slot="title">用户列表</span>
        </el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>

<script>
import bus from "./bus";

export default {
  name: "leftside",
  data() {
    return {
      collapse: false,
      activePath: "",
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
      bus.$emit("collapse-content", msg);
    });
    bus.$on("changeActive", (path) => {
      this.saveActivePath(path);
    });
  },
  methods: {
    saveActivePath(activePath, id) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less">
.el-submenu__title {
  font-size: 16px;
}
.el-submenu .el-menu-item {
  font-size: 14px;
}
</style>
<style lang="less" scoped>
#leftside {
  background-color: #1f469a;
  .el-menu {
    /deep/ .el-submenu__title {
      background: linear-gradient(90deg, #1f469a, #1d4589);
    }
    /deep/ .el-submenu__title:hover {
      background: rgba(0, 0, 0, 0.2) !important;
    }

    /deep/ .el-menu-item {
      position: relative;
      background: linear-gradient(90deg, #1f469a, #1d4589);
    }

    /deep/ .el-menu-item:hover {
      background: rgba(0, 0, 0, 0.2) !important;
    }

    /deep/ .el-submenu:hover {
      background: rgba(0, 0, 0, 0.2) !important;
    }

    /deep/ .is-active {
      background: rgba(0, 0, 0, 0.6) !important;
    }

    /deep/ .is-active::after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 0;
      content: "";
      width: 0;
      height: 0;
      overflow: hidden;
      font-size: 0; /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
      line-height: 0; /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
      border-width: 10px;
      border-style: solid; /*ie6下会出现不透明的兼容问题*/
      border-color: transparent #f2f2f7 transparent transparent;
    }

    /deep/ .is-opened::after {
      border: 0;
    }
  }
}
</style>
