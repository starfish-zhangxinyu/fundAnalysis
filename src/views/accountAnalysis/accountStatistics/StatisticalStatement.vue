<!--账户统计表-->
<template>
  <div id="StatisticalStatement">
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
        >
        <el-button
          class="import"
          type="success"
          v-if="importStatus"
          style="margin: 0 0 6px 1%"
          @click="exportExcel"
          >导出数据</el-button
        >
        <el-button
          class="importLoad"
          type="success"
          style="margin: 0 0 6px 1%"
          v-else
          :loading="true"
          >导出数据中</el-button
        >
      </div>
      <div class="content">
        <reTable
          class="contentItem"
          :tableData="tableData"
          :type="type"
          @orderChange="orderCh"
          :heightItem="heightItem"
          :header="headerData"
          @sort-change="topTableSort"
          v-if="heightItem"
          :getLoading="getLoading"
        >
        </reTable>
      </div>
      <div class="page">
        <div class="hzInfor">{{ hzInfor }}</div>
        <rePage
          :currentPg="currentPage"
          :totalPage="total"
          @pageChange="pageChange"
        >
        </rePage>
      </div>
    </div>
  </div>
</template>

<script>
import reTable from "@/components/table";
import rePage from "@/components/page";
import search from "@/components/search";

export default {
  name: "StatisticalStatement",
  components: { reTable, rePage, search },

  data() {
    return {
      inputName: "", //户名
      inputCard: "", //卡号
      orderField: "", //排序字段
      orderType: "", //排序规则
      dbName: "", //案件名字段
      heightItem: "",
      type: "",
      currentPage: 1,
      total: 0,
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      kzId: "", //快照ID
      status: "",
      min_allmoney: "",
      max_allmoney: "",
      min_inmoney: "",
      max_inmoney: "",
      min_outmoney: "",
      max_outmoney: "",
      min_submoney: "",
      max_submoney: "",
      isdiaodan: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      importStatus: true, //导出状态
      hzInfor: "", //汇总信息
      getLoading: true, //传给table，停止加载
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
      this.getHead();
      this.getList();
      this.hzInformation();
      this.tableHeightCalc();
    }
  },
  methods: {
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
    //汇总数据
    async hzInformation() {
      let { data: res } = await this.$http.post(
        `/accountsummary/getAccountSummaryCount`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: this.kzId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.hzInfor = res.data;
      }
    },
    //导出表格
    async exportExcel() {
      this.importStatus = false;
      this.$message.info("数据导出中，请耐心等待");
      let { data: res } = await this.$http.post(
        `/accountsummary/importAccountSummaryData`,
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
            db_name: this.dbName,
            kzname: this.kzId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res", res.data);
        this.importStatus = true;
        this.$message.success(res.msg);
        window.location = res.data;
      }
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
        this.getLoading = true;
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
        this.getLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
#StatisticalStatement {
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
    }
    .page {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .hzInfor {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}
</style>