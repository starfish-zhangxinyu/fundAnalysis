<!--交易对手卡号分析-->
<template>
  <div id="jydskh">
    <div class="main">
      <div class="content">
        <reTable
          class="contentItem"
          :tableData="tableData"
          :type="type"
          :header="headerData"
          :heightItem="heightItem"
          v-if="heightItem"
          @orderChange="orderCh"
          @sort-change="topTableSort"
          :getLoading="getLoading"
        >
        </reTable>
      </div>
      <div class="page">
        <rePage
          :currentPg="currentPage"
          :totalPage="total"
          @pageChange="pageChange"
        >
        </rePage>
      </div>
      <div class="chart" v-if="show">
        <echart1 :echartData="echart1Data" />
        <echart2 :echartData="echart2Data" />
        <echart3 :echartData="echart3Data" />
      </div>
    </div>
  </div>
</template>

<script>
import reTable from "@/components/table";
import rePage from "@/components/page";
import echart1 from "../echart/jydsEchart";
import echart2 from "../echart/jydsEchart";
import echart3 from "../echart/jydsEchart";

export default {
  name: "jydskh",
  components: { reTable, rePage, echart1, echart2, echart3 },
  data() {
    return {
      show: false,
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      fundcard: this.$route.query.fundcard,
      currentKzId: "", //当前快照的ID
      type: "",
      heightItem: "",
      loading: false,
      currentPage: 1,
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      inputName: "", //户名
      inputCard: "", //卡号
      min_jiaoyimoney: "",
      max_jiaoyimoney: "",
      min_jiaoyibalance: "",
      max_jiaoyibalance: "",
      min_fundtime: "",
      max_fundtime: "",
      othercard: "",
      othername: "",
      wangdianming: "",
      ip: "",
      mac: "",
      beizhu: "",
      jiaoyitype: "",
      typefenlei: "",
      zhaiyaobeizhufenlei: "",
      getLoading: true, //传给table，停止加载
      echart1Data: {
        name: "总数据",
        data: [],
      }, //总数据
      echart2Data: {
        name: "流入数据",
        data: [],
      }, //流入数据
      echart3Data: {
        name: "流出数据",
        data: [],
      }, //流出数据
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.currentKzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    this.getHead();
    this.getList();
    this.getTb();
    this.tableHeightCalc();
  },
  methods: {
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 460;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 360;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 260;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 180;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 100;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 560;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 680;
      }
      this.heightItem = this.heightItem.toString();
    },
    //排序
    orderCh(label, orderType) {
      this.orderField = label;
      this.orderType = orderType;
      this.getList();
    },
    //排序规则
    topTableSort({ column, prop, order }) {
      if (order == "ascending") {
        this.orderType = "asc";
      } else if (order == "descending") {
        this.orderType = "desc";
      }
      this.$emit("orderChange", column.property, this.orderType);
    },
    //页码改变
    pageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    async getHead() {
      //获取表头数据
      let { data: res } = await this.$http.post(
        `/index/getTableColumnList`,
        {},
        {
          params: {
            title: "账号分析-账户统计-对手卡号统计表",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.headerData = res.data;
      }
    },
    async getTb() {
      //获取图表数据
      let { data: res } = await this.$http.post(
        `/funddetailc/getPersonalFundDetailcCount`,
        {},
        {
          params: {
            fundcard: this.fundcard,
            kzname: this.currentKzId,
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res", res.data);
        this.echart2Data.data = res.data.inmoney_detailcs;
        this.echart3Data.data = res.data.outmoney_detailcs;
        this.echart1Data.data = res.data.summoney_detailcs;
        this.show = true;
      }
    },
    async getList() {
      //获取表格数据
      let { data: res } = await this.$http.post(
        `/funddetailc/getPersonalFundDetailcDetails`,
        {
          fundcard: this.fundcard,
          kzname: this.currentKzId,
          order_field: this.orderField,
          order_type: this.orderType,
        },
        {
          params: {
            pagenum: this.currentPage,
            pagesize: "20",
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log(res)
        this.tableData = res.data.data;
        this.total = res.data.count;
        this.getLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
#jydskh {
  width: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 200px);
    overflow: auto;

    .page {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .chart {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>