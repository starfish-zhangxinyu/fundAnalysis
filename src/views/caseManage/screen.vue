<!--数据大屏-->
<template>
  <div id="screen">
    <div class="button">
      <el-tooltip effect="dark" content="导出数据" placement="bottom">
        <el-button
          type="info"
          icon="el-icon-download"
          class="data first"
          circle
          @click="importData"
        ></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="返回上页" placement="bottom">
        <el-button
          type="info"
          icon="el-icon-s-home"
          class="data"
          circle
          @click="$router.go(-1)"
        ></el-button>
      </el-tooltip>
    </div>
    <dv-border-box-11 title="星聚资金分析工具"></dv-border-box-11>
    <div class="top">
      <div class="topItem" style="width: 24%">
        <dv-border-box-8>
          <div class="topLeftO">
            <div class="topLeftO-left">
              <i class="el-icon-s-grid" style="font-size: 20px"></i>
            </div>
            <div class="topLeftO-right">
              <div style="font-size: 30px">{{ allNum }}</div>
              <div>涉案卡号数量</div>
            </div>
          </div>
        </dv-border-box-8>

        <div class="topLeftT">
          <div
            class="topLeftT-item"
            v-for="item in dataList"
            :key="item.id"
            style="width: 33%"
          >
            <dv-border-box-12 style="padding: 10px 0"
              ><div style="font-size: 18px">{{ item.number }}</div>
              <div style="font-size: 16px">
                {{ item.name }}
              </div></dv-border-box-12
            >
          </div>
        </div>
      </div>
      <div class="topItem" style="width: 72%; margin-left: 10px">
        <dv-border-box-8
          ><div class="topLeftO">
            <div class="topLeftO-left">
              <i class="el-icon-s-order" style="font-size: 20px"></i>
            </div>
            <div class="topLeftO-right">
              <div style="font-size: 30px">{{ caseNum }}</div>
              <div>涉案总金额</div>
            </div>
          </div></dv-border-box-8
        >
        <div class="topLeftT">
          <div
            class="topLeftT-item"
            v-for="item in ddList"
            :key="item.id"
            style="width: 20%"
          >
            <dv-border-box-12 style="padding: 10px 0"
              ><div style="font-size: 18px">{{ item.number }}</div>
              <div style="font-size: 15px">
                {{ item.name }}
              </div></dv-border-box-12
            >
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content-left">
        <china :leftdata="leftdata" v-if="leftdata.length" />
      </div>
      <div class="content-right">
        <!-- 交易对手 -->
        <dv-border-box-13 style="margin: 0 6px 6px 6px">
          <rightTop1 :data1="data1" v-if="data1.series.length" />
        </dv-border-box-13>

        <!-- 银行卡账户分类 -->
        <dv-border-box-13 style="margin: 0 0 6px 0">
          <rightTop2 :data2="data2" v-if="data2.series.length" />
        </dv-border-box-13>

        <!-- 账户余额 -->
        <dv-border-box-13 style="margin: 0 6px">
          <rightTop3 :data3="data3" v-if="data3.series.length" />
        </dv-border-box-13>

        <!-- 账户进账 -->
        <dv-border-box-13 style="margin: 0">
          <rightTop4 :data4="data4" v-if="data4.series.length" />
        </dv-border-box-13>
      </div>
    </div>
  </div>
</template>

<script>
import rightTop1 from "@/components/screenCharts/rightTop-1";
import rightTop2 from "@/components/screenCharts/rightTop-2";
import rightTop3 from "@/components/screenCharts/rightTop-3";
import rightTop4 from "@/components/screenCharts/rightTop-4";
import china from "@/components/screenCharts/china";

export default {
  name: "screen",
  components: { rightTop1, rightTop2, rightTop3, rightTop4, china },
  data() {
    return {
      leftdata: [], //传给地图的数据
      allNum: "0",
      caseNum: "0",
      data1: { series: [], xAxis: [] },
      data2: { series: [], xAxis: [] },
      data3: { series: [], xAxis: [] },
      data4: { series: [], xAxis: [] },
      dataList: [
        { id: 1, name: "人员数量", number: "0" },
        { id: 2, name: "已调单卡号数量", number: "0" },
        { id: 3, name: "未调单卡号数量", number: "0" },
      ],
      ddList: [
        { id: 1, name: "已调单进总额", number: "0" },
        { id: 2, name: "已调单出账总量", number: "0" },
        { id: 3, name: "已调单进次数", number: "0" },
        { id: 4, name: "已调单出账次数", number: "0" },

        { id: 5, name: "未调单进账总量", number: "0" },
        { id: 6, name: "未调单出账总量", number: "0" },
        { id: 7, name: "未调单进账次数", number: "0" },
        { id: 8, name: "未调单出账次数", number: "0" },
      ],
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.currentKzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    this.getData();
  },
  methods: {
    async importData() {
      let { data: res } = await this.$http.post(
        `/index/exportBigscreen`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: this.currentKzId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.$message.success(res.msg);
        window.location = res.data;
      }
    },
    async getData() {
      let { data: res } = await this.$http.post(
        `/index/getBigScreenData`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: this.currentKzId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res", res);
        this.allNum = res.data.area1;
        this.caseNum = res.data.area2;
        this.dataList[0].number = res.data.area3;
        this.dataList[1].number = res.data.area4;
        this.dataList[2].number = res.data.area5;

        this.ddList[0].number = res.data.area6;
        this.ddList[1].number = res.data.area8;
        this.ddList[2].number = res.data.area10;
        this.ddList[3].number = res.data.area12;
        this.ddList[4].number = res.data.area7;
        this.ddList[5].number = res.data.area9;
        this.ddList[6].number = res.data.area11;
        this.ddList[7].number = res.data.area13;
        this.leftdata = res.data.area14;
        this.data1.series = res.data.area15.series;
        this.data1.xAxis = res.data.area15.xAxis;
        this.data2.legend = res.data.area16.legend;
        this.data2.series = res.data.area16.series;
        this.data3.series = res.data.area17.series;
        this.data3.xAxis = res.data.area17.xAxis;
        this.data4.series = res.data.area18.series;
        this.data4.xAxis = res.data.area18.xAxis;
      }
    },
  },
};
</script>

<style lang="less" scoped>
#screen {
  width: 100%;
  height: 100vh;
  background: #fff url("../../assets/img/screen.jpg") no-repeat center center;
  background-size: cover;
  .button {
    position: absolute;
    right: 20px;
    top: 40px;
    z-index: 9999;
  }
  .data {
    background-color: #15a3ff !important;
    border-color: #3a8ee6;
    font-size: 26px;
  }
  .first {
    background-color: #67c23a !important;
    border-color: #67c23a;
  }
  .dv-border-box-11 {
    font-size: 30px;
    font-weight: 600;
    position: absolute;
    left: 0;
    right: 0;
    // z-index: 1;
  }
  .top {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-shrink: 0;
    padding-top: 60px;
    .topItem {
      color: #fff;
      .topLeftO {
        // width: 100%;
        // background-color: rgba(10, 46, 93, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 6px;
        padding: 10px 0;
        .topLeftO-left {
          width: 40px;
          height: 40px;
          line-height: 40px;
          border: 1px solid #fff;
          border-radius: 50%;
          text-align: center;
          margin-right: 2%;
        }
      }
      .topLeftT {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;

        .topLeftT-item {
          // background-color: rgba(10, 46, 93, 0.6);
          margin: 6px 6px 6px 0;
          text-align: center;
          border-radius: 6px;
        }
      }
      .topLeftT :last-child {
        margin-right: 0;
      }
    }
  }
  .content {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    .content-left {
      width: 40%;
      margin-left: 6px;
      height: calc(100vh - 240px);
    }
    .content-right {
      width: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    }
    .dv-border-box-13 {
      width: 49%;
      background-color: rgba(10, 46, 93, 0.6);
    }
  }
}
</style>
