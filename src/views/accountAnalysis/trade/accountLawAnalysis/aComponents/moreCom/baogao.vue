<!--账号特征汇总报告-->
<template>
  <div id="baogao">
    <el-button type="warning" class="pdfBtn" @click="getPdf()"
      >导出pdf</el-button
    >
    <div id="pdfDom">
      <div class="header">
        <div class="top">
          <h1>
            <i style="margin-right: 10px"></i>
            户名：{{ this.$route.query.account | isNull
            }}<span style="font-size: 26px"
              >(卡号：{{ this.$route.query.fundcard | isNull }})</span
            >分析报告
          </h1>
        </div>
      </div>

      <div class="main">
        <div class="base_info" id="base_info">
          <div class="info" id="info">
            <h3>一、卡号信息</h3>
            <h4>1.1 基本信息</h4>
            <el-divider style="margin: 10px 0"></el-divider>
            <div class="item">
              <span class="title">卡号所属人员：</span>
              <span class="content">{{
                accountDict == null ? "暂无" : accountDict.name | isNull
              }}</span>
            </div>
            <div class="item">
              <span class="title">卡号所属人员证件号：</span>
              <span class="content">{{ accountDict.idcard | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">卡号所属人员手机号：</span>
              <span class="content">{{ accountDict.mobile | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">调单状态：</span>
              <span class="content" v-if="accountDict.status == 0">未调单</span>
              <span class="content" v-if="accountDict.status == 1">已调单</span>
              <span
                class="content"
                v-if="accountDict.status != 1 && accountDict.status != 0"
                >暂无</span
              >
            </div>
            <div class="item">
              <span class="title">最早进交易时间：</span>
              <span class="content">{{ summary.innewdealtime | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">最晚进交易时间：</span>
              <span class="content">{{ summary.inolddealtime | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">最早出交易时间：</span>
              <span class="content">{{ summary.outnewdealtime | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">最晚出交易时间：</span>
              <span class="content">{{ summary.outolddealtime | isNull }}</span>
            </div>
          </div>
        </div>
        <div class="gs_info" id="gs_info">
          <div class="info">
            <h4>1.2 资金统计信息</h4>
            <el-divider style="margin: 10px 0"></el-divider>
            <div class="item">
              <span class="title">进对手卡号数量：</span>
              <span class="content">{{ summary.incards | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">出对手卡号数量：</span>
              <span class="content">{{ summary.outcards | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">进交易次数：</span>
              <span class="content">{{ summary.intimes | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">进交易流水</span>
              <span class="content">{{
                (summary.inmoney + "元") | isNull
              }}</span>
            </div>
            <div class="item">
              <span class="title">出交易次数：</span>
              <span class="content">{{ summary.outtimes | isNull }}</span>
            </div>
            <div class="item">
              <span class="title">出交易流水：</span>
              <span class="content">{{
                (summary.outmoney + "元") | isNull
              }}</span>
            </div>
            <div class="item">
              <span class="title">交易总次数：</span>
              <span class="content">{{
                (summary.intimes + summary.outtimes) | isNull
              }}</span>
            </div>
            <div class="item">
              <span class="title">交易总流水：</span>
              <span class="content">{{
                ((summary.inmoney + summary.outmoney).toFixed(2) + "元")
                  | isNull
              }}</span>
            </div>
          </div>
        </div>
        <div class="cont_info" id="cont_info">
          <div class="info">
            <h3>二、交易对手分析</h3>
            <h4>2.1 已调单对手卡号交易分析</h4>
            <el-divider style="margin: 10px 0"></el-divider>
            <el-table :data="yicardData" stripe style="width: 100%" border>
              <el-table-column prop="fundcard" label="卡号" width="500">
              </el-table-column>
              <el-table-column prop="othercard" label="对手卡号" width="500">
              </el-table-column>
              <el-table-column prop="summoney" label="交易总流水">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="yq_info" id="yq_info">
          <div class="info">
            <h4>2.2 未调单对手卡号交易分析</h4>
            <el-divider style="margin: 10px 0"></el-divider>
            <el-table :data="weicardData" stripe style="width: 100%" border>
              <el-table-column prop="fundcard" label="卡号" width="300">
              </el-table-column>
              <el-table-column prop="othercard" label="对手卡号" width="300">
              </el-table-column>
              <el-table-column prop="summoney" label="交易总流水" width="300">
              </el-table-column
              ><el-table-column prop="inmoney" label="进总流水" width="300">
              </el-table-column>
              <el-table-column prop="outmoney" label="出总流水">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="text_info" id="text_info">
          <h3>三、交易金额区间规律</h3>
          <!-- <el-divider style="margin: 10px 0"></el-divider> -->
          <span class="ready">此功能正在开发……</span>
        </div>
        <div class="yq_info" id="yq_info">
          <h3>四、特殊交易金额分析</h3>
          <!-- <el-divider style="margin: 10px 0"></el-divider> -->
          <span class="ready">此功能正在开发……</span>
        </div>
        <div class="time_info" id="time_info">
          <h3>五、交易时间规律</h3>
          <!-- <el-divider style="margin: 10px 0"></el-divider> -->
          <span class="ready">此功能正在开发……</span>
        </div>
        <div class="yc_info" id="yc_info">
          <h3>六、时间切片分析</h3>
          <!-- <el-divider style="margin: 10px 0"></el-divider> -->
          <span class="ready">此功能正在开发……</span>
        </div>
        <div class="icp_info" id="icp_info">
          <h3>七、交易类型分析</h3>
          <!-- <el-divider style="margin: 10px 0"></el-divider> -->
          <span class="ready">此功能正在开发……</span>
        </div>
        <div class="other_info" id="other_info">
          <h3>八、总结</h3>
          <el-divider style="margin: 10px 0"></el-divider>
          <span class="ready">
            卡号{{ this.fundcard }}的调单状态为{{
              accountDict.status == 0 ? "未调单" : "已调单"
            }}，其开户名{{ accountDict.name | isNull }}，身份证号{{
              accountDict.idcard | isNull
            }}，手机号记录{{
              accountDict.mobile | isNull
            }}。卡号的交易总流水为{{
              (summary.inmoney + summary.outmoney) | isNull
            }}元，其中进金总流水为{{
              summary.inmoney | isNull
            }}元，出金总流水为{{ summary.outmoney | isNull }}元。
          </span>
        </div>
      </div>
    </div>
    <!--    电梯导航栏-->
    <el-card class="box-card">
      <div class="ele">
        <ul>
          <li
            :class="[active == index ? 'active' : '']"
            @click="eleClick(info.id, index)"
            v-for="(info, index) in eleContent"
            :key="info.id"
          >
            {{ info.title }}
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import goAnchor from "@/utils/anchor.js";

export default {
  name: "baogao",
  components: {},

  data() {
    return {
      dbName: "", //案件名字段
      kzId: "", //快照ID
      fundcard: this.$route.query.fundcard, //交易卡号
      // 基础描述信息数据对象
      accountDict: [], //基本信息
      summary: [],
      colors: ["#00bcd4", "#febf63", "#cf1b1b"],
      active: 0,
      //已调单卡号
      yicardData: [],
      //未调单卡号
      weicardData: [],
      eleContent: [
        {
          id: "base_info",
          title: "卡号信息",
        },
        {
          id: "cont_info",
          title: "交易对手",
        },
        {
          id: "text_info",
          title: "交易金额区间",
        },
        {
          id: "yq_info",
          title: "特殊交易金额",
        },
        {
          id: "time_info",
          title: "交易时间规律",
        },
        {
          id: "yc_info",
          title: "时间切片",
        },
        {
          id: "icp_info",
          title: "交易类型",
        },
        {
          id: "other_info",
          title: "总结",
        },
      ],
      scroll: "",
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
    // this.getPlatDetails();
  },
  mounted() {
    // 监听滚动事件
    window.addEventListener("scroll", this.dataScroll);
    this.$once("hook:destroy", () => {
      window.removeEventListener("scroll", this.dataScroll);
    });
    this.getList();
  },
  computed: {
    htmlTitle() {
      return `卡号${this.fundcard}分析报告`;
    },
  },
  methods: {
    dataScroll() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop;
    },
    //获取当前元素的offsetTop
    getOffsetTop(obj) {
      let offsetTop = 0;
      while (obj !== window.document.body && obj !== null) {
        offsetTop += obj.offsetTop;
        obj = obj.offsetParent;
      }
      return offsetTop;
    },
    // 滚动事件
    handleScroll() {
      for (let i = 0; i < this.eleContent.length; i++) {
        let obj = document.getElementById(this.eleContent[i].id);
        if (this.scroll <= this.getOffsetTop(obj)) {
          this.active = i;
          break;
        }
      }
    },
    // 电梯点击事件
    eleClick(ele, index) {
      this.active = index;
      goAnchor("#" + ele, index);
    },
    async getList() {
      //获取表格数据
      let { data: res } = await this.$http.post(
        `/index/getReport`,
        {},
        {
          params: {
            fundcard: this.fundcard,
            kzname: this.kzId,
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.accountDict = res.data.account_dict;
        this.summary = res.data.account_summary;
        this.yicardData = res.data.yi_fund_detailcs;
        this.weicardData = res.data.wei_fund_detailcs;
      }
    },
  },
  watch: {
    scroll: function () {
      this.handleScroll();
    },
  },
  filters: {
    isNull(value) {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "null" ||
        value === "\t" ||
        value === "None"
      ) {
        return "暂无";
      } else {
        return value;
      }
    },
    rate(value) {
      return value / 200;
    },
  },
};
</script>

<style lang="less" scoped>
#baogao {
  width: 100%;
  height: 100vh;
  .pdfBtn {
    position: absolute;
    top: 10px;
    right: 20px;
  }
  .header {
    width: 100%;
    height: 110px;
    background: linear-gradient(#1f469a, #1d4589);
    text-align: center;

    .top {
      width: 100%;

      i {
        display: inline-block;
        // background: url("../../assets/img/police-gov.png") no-repeat;
        background-size: contain;
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }

      h1 {
        color: #fafafa;
        height: 110px;
        line-height: 110px;
        margin: 0;
      }
    }
  }

  .main {
    width: 100%;
    padding: 50px 200px;
    box-sizing: border-box;

    .base_info,
    .gs_info,
    .cont_info,
    .yq_info,
    .yc_info,
    .icp_info,
    .other_info {
      width: 100%;

      .risk_level {
        width: 100%;
        height: 150px;
        border: 1px solid #ebeef5;
        margin-top: 30px;

        .title {
          width: 100%;
          height: 30%;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          line-height: 45px;
        }

        .level {
          width: 100%;
          height: 70%;
          color: #fe346e;
          border-top: 1px solid #ebeef5;
          background-color: #fafafa;
          font-size: 30px;
          text-align: center;
          font-weight: 700;
          box-sizing: border-box;
          line-height: 105px;

          .el-rate {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            /deep/ .el-rate__item {
              i {
                font-size: 30px;
              }
            }
          }
        }
      }

      .info {
        margin-top: 30px;

        h4 {
          margin: 10px 0;
        }

        .item {
          border: 1px solid #ebeef5;
          border-bottom: 0;
          display: flex;
          justify-content: flex-start;

          .title {
            display: inline-block;
            line-height: 42px;
            padding-left: 5px;
            box-sizing: border-box;
            width: 20%;
            color: #606266;
          }

          .title::before {
            display: inline-block;
            content: "";
            height: 100%;
            vertical-align: middle;
          }

          .content {
            padding-left: 20px;
            box-sizing: border-box;
            width: 80%;
            color: #606266;
            line-height: 42px;
            border-left: 1px solid #ebeef5;
          }
        }

        .item:nth-last-child(1) {
          border-bottom: 1px solid #ebeef5;
        }

        .item:nth-of-type(odd) {
          background-color: #fafafa;
        }
      }
    }

    .analyse_info {
      margin-top: 30px;
    }

    .string_info {
      width: 100%;
      border: 1px solid #ebeef5;
      margin-top: 30px;

      .title {
        width: 100%;
        height: 30%;
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        line-height: 45px;
      }

      .level {
        width: 100%;
        height: 70%;
        border-top: 1px solid #ebeef5;
        background-color: #fafafa;
        font-size: 16px;
        text-align: center;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  /deep/ .el-divider--horizontal {
    margin: 10px 0;
  }

  /deep/ .el-card__body {
    position: fixed;
    width: 100px;
    left: 0;
    top: 30%;
    padding: 0 !important;

    ul {
      background-color: #fff;
      padding: 0;
      li {
        background-color: #fff;
        border-bottom: 2px solid #ebeef5;
        border-right: 2px solid #ebeef5;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        text-align: center;
        list-style-type: none;
      }

      li:hover {
        background-color: #1e4691;
        color: #fafafa;
      }
    }
  }

  li.active {
    background-color: #1e4691 !important;
    color: #fafafa;
  }
  .ready {
    color: #606266;
  }
}
</style>
