<!--时间切片分析-->
<template>
  <div id="timeSliceAnalysis">
    <div class="main">
      <div class="search">
        <el-input
          class="searchItem"
          placeholder="请输入交易户名"
          prefix-icon="el-icon-user-solid"
          v-model="inputName"
          @input="change"
          style="width: 160px"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入交易卡号"
          prefix-icon="el-icon-bank-card"
          v-model="inputCard"
          @input="change"
          style="width: 220px"
          clearable
        >
        </el-input>
        <el-select
          v-model="status"
          placeholder="请选择是否调单"
          class="searchItem"
          @input="change"
          clearable
        >
          <el-option
            v-for="item in isdiaodan"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span class="searchItem changeStyle" style="width: 452px">
          <el-input
            placeholder="请输入进账金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_inmoney"
            @input="change"
            style="width: 216px"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入进账金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_inmoney"
            @input="change"
            style="width: 216px"
            clearable
          >
          </el-input>
        </span>
        <span class="searchItem changeStyle" style="width: 452px">
          <el-input
            placeholder="请输入出账金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_outmoney"
            style="width: 216px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入出账金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_outmoney"
            style="width: 216px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <span class="searchItem changeStyle" style="width: 420px">
          <el-input
            placeholder="请输入总流水下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_allmoney"
            style="width: 200px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入总流水上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_allmoney"
            style="width: 200px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <span class="searchItem changeStyle" style="width: 452px">
          <el-input
            placeholder="请输入交易金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_submoney"
            style="width: 216px"
            clearable
            @input="change"
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入交易金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_submoney"
            style="width: 216px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <el-button type="primary" style="margin: 0 0 6px 1%" @click="search"
          >搜索</el-button
        >
        <el-button type="danger" style="margin: 0 0 6px 1%" @click="clearInput"
          >一键清空</el-button
        ><el-button type="success" style="margin: 0 0 6px 1%" @click="flow"
          >生成图表</el-button
        >
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          :height="heightItem"
          v-if="heightItem"
          class="table-fixed"
          :show-overflow-tooltip="true"
          @sort-change="topTableSort"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          v-loading="loadingTable"
          element-loading-text="数据加载中"
          :header-cell-style="{ 'text-align': 'left' }"
          border
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="item in headerData"
            :key="item.id"
            :prop="item.propName"
            :label="item.labelName"
            :sortable="item.order"
            :width="item.width"
            :align="item.align"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <slot name="operate"></slot>
        </el-table>
      </div>
      <div class="page">
        <rePage
          :currentPg="currentPage"
          :totalPage="total"
          @pageChange="pageChange"
        >
        </rePage>
      </div>
      <!-- 图表 -->
      <el-dialog
        title="时间切片分析图"
        :visible.sync="flowDialog"
        width="1600px"
        top="1vh"
        style="padding: 10px 20px"
        :close-on-click-modal="false"
        @close="closeTb"
      >
        <el-input
          class="searchItem"
          placeholder="请输入统计周期(天)"
          prefix-icon="el-icon-bank-card"
          v-model="maxNum"
          style="width: 220px"
          @input="changeTbButtonStatus"
          clearable
        >
        </el-input>

        <el-button
          type="primary"
          :disabled="tbstatus"
          style="margin: 0 0 6px 1%"
          @click="searchTb"
          >生成图表</el-button
        >
        <el-button type="success" :disabled="exportTbStatus" @click="exportTb"
          >导出图表</el-button
        >
        <el-button
          type="warning"
          v-if="importStatus && exportDia"
          style="margin: 0 0 6px 12px"
          @click="exportExcel"
          >导出数据</el-button
        >
        <el-button
          type="warning"
          v-if="!exportDia"
          disabled
          style="margin: 0 0 6px 12px"
          >导出数据</el-button
        >
        <el-button
          type="warning"
          style="margin: 0 0 6px 12px"
          v-if="!importStatus"
          :loading="true"
          >导出数据中</el-button
        >
        <div
          style="height: 690px"
          v-loading="loading"
          element-loading-text="加载图表中"
        >
          <timeSliceEchart :timeList="timeList" v-if="getData" />
          <div
            v-else
            style="
              width: 100%;
              padding-top: 200px;
              text-align: center;
              color: #e6a23c;
            "
          >
            输入筛选条件后，生成图表
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="flowDialog = false">取 消</el-button>
          <el-button type="primary" @click="flowDialog = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import rePage from "@/components/page";
import search from "@/components/search";
import cjs from "@/components/cjs";
import timeSliceEchart from "@/components/tradeCharts/timeSliceEchart";

export default {
  name: "timeSliceAnalysis",
  components: { cjs, rePage, search, timeSliceEchart },
  data() {
    return {
      checked: false,
      inputName: "", //户名
      inputCard: "", //卡号
      seIn: "请输入交易卡号",
      dbName: "", //案件名字段
      currentPage: 1,
      exportTbStatus: true, //导出图表按钮
      radio: "", //映射单选
      heightItem: "",
      loadingTable: true,
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      kzId: "", //快照ID
      activeNames: [0],
      maxNumDialog: false, //数据量选择框
      flowDialog: false,
      maxNum: "",
      multipleSelection: [],
      ids: [],
      checkList: [],
      lastInput: "",
      groupTb: [], //分组列表选中的id
      multipleSelectionId: [], //账号id
      timeList: [], //传给charts的数据
      loading: false,
      getData: false,
      status: "",
      tbstatus: true,
      min_allmoney: "",
      max_allmoney: "",
      min_inmoney: "",
      max_inmoney: "",
      min_outmoney: "",
      max_outmoney: "",
      min_submoney: "",
      max_submoney: "",
      importStatus: true, //导出状态
      currentCsId: "",
      exportDia: false, //导出数据按钮
      isdiaodan: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    let that = this;
    if (that.kzId == null) {
      setTimeout(function () {
        alert("请先选择快照");
        that.$router.push("/dataClean");
      }, 500);
    } else {
      that.getHead();
      that.getList();
      that.tableHeightCalc();
    }
  },
  methods: {
    //关闭图表弹框清空状态
    closeTb(){
      this.lastInput = ""
    },
    changeTbButtonStatus(val) {
      if (val != "" && val != this.lastInput) {
        this.tbstatus = false;
      } else {
        this.tbstatus = true;
      }
    },
    search() {
      this.currentPage = 1;
      this.getList();
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 680;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 560;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 460;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 290;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 200;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 780;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 920;
      }
      this.heightItem = this.heightItem.toString();
    },
    change(val) {
      // if (val == "") {
      this.currentPage = 1;
      this.getList();
      // }
    },
    //清空输入
    clearInput() {
      this.inputName = "";
      this.inputCard = "";
      this.status = "";
      this.max_allmoney = "";
      this.min_allmoney = "";
      this.min_inmoney = "";
      this.max_inmoney = "";
      this.min_outmoney = "";
      this.max_outmoney = "";
      this.min_submoney = "";
      this.max_submoney = "";
      this.currentPage = 1;
      this.getList();
    },
    //导出表格数据
    async exportExcel() {
      this.importStatus = false;
      this.$message.info("数据导出中，请耐心等待");
      let { data: res } = await this.$http.post(
        `/accountsummary/importTimeSlice`,
        {},
        {
          params: {
            db_name: this.dbName,
            csid: this.currentCsId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res", res.data);
        this.importStatus = true;
        this.$message.success(res.msg);
        /* 生成导出文件 */
        window.location = res.data;
      }
    },
    searchTb() {
      this.tbstatus = true;
      if (this.maxNum != "") {
        this.loading = true;
        this.lastInput = this.maxNum;
        this.getTb();
      } else {
        this.getData = false;
      }
    },
    flow() {
      this.maxNum = "";
      if (
        this.multipleSelection.length != 0 &&
        this.multipleSelection.length <= 4
      ) {
        this.flowDialog = true;
        this.getData = false;
      } else if (this.multipleSelection.length == 0) {
        this.$message.error("请选择账号");
      } else if (this.multipleSelection.length > 4) {
        this.$message.error("一次最多选择四个账户进行分析");
      }
    },
    //上传数据生成图表
    async getTb() {
      this.flowDialog = true;
      let { data: res } = await this.$http.post(
        `/accountsummary/getTimeSlice`,
        {
          multipaccount: this.ids,
          g: [0],
        },
        {
          params: {
            db_name: this.dbName,
            kzname: this.kzId,
            max_num: this.maxNum,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.currentCsId = res.data.cs_id;
        /* 有数据时才可导出数据 */
        if (this.currentCsId != undefined) {
          this.exportDia = true;
        }

        this.timeList = res.data;
        this.getData = true;
        this.loading = false;
        this.exportTbStatus = false;
      }
    },
    exportTb() {
      let mycanvas = document.getElementsByTagName("canvas")[0];
      let image = mycanvas.toDataURL("image/jpg");
      let $a = document.createElement("a");
      $a.setAttribute("href", image);
      $a.setAttribute("download", "时间切片图下载.jpg");
      $a.click();
    },
    //排序
    topTableSort({ column, prop, order }) {
      if (order == "ascending") {
        this.orderType = "asc";
      } else if (order == "descending") {
        this.orderType = "desc";
      }
      this.orderField = prop;
      this.getList();
    },
    //多选
    handleSelectionChange(val) {
      this.ids = [];
      this.multipleSelection = val;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.ids.push(this.multipleSelection[i].id); //已选的id
      }
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
            title: "账号分析-账户统计-账户统计表",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.headerData = res.data;
      }
    },
    async getList() {
      //获取表格数据
      this.loadingTable = true;
      let { data: res } = await this.$http.post(
        `/accountsummary/getAccountSummaryList`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          status: this.status,
          min_allmoney: this.min_allmoney,
          max_allmoney: this.max_allmoney,
          min_inmoney: this.min_inmoney,
          max_inmoney: this.max_inmoney,
          min_outmoney: this.min_outmoney,
          max_outmoney: this.max_outmoney,
          min_submoney: this.min_submoney,
          max_submoney: this.max_submoney,
          kzname: this.kzId,
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
        this.tableData = res.data.data;
        this.total = res.data.count;
        this.loadingTable = false;
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
#timeSliceAnalysis {
  width: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;

    .search {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .searchItem {
        margin: 0 0 6px 6px;
      }
    }
    .content {
      width: 100%;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
    .page {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>