<!--账户信息表-->
<template>
  <div id="accountInforSheet">
    <div class="main">
      <div class="search">
        <el-input
          class="searchItem"
          placeholder="请输入交易户名"
          prefix-icon="el-icon-user-solid"
          v-model="inputName"
          style="width: 160px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入交易卡号"
          prefix-icon="el-icon-bank-card"
          v-model="inputCard"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <span class="searchItem changeStyle" style="width: 440px">
          <el-input
            placeholder="请输入账户余额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_balance"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入账户余额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_balance"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <span class="searchItem changeStyle" style="width: 440px">
          <el-input
            placeholder="请输入可用余额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_keyongbalance"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入可用余额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_keyongbalance"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <el-input
          class="searchItem"
          placeholder="请输入开户网点代码"
          prefix-icon="el-icon-monitor"
          v-model="wangdiandaima"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入开户网点"
          prefix-icon="el-icon-s-home"
          v-model="kaihuwangdian"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入开户省份"
          prefix-icon="el-icon-map-location"
          v-model="kaihuprovinces"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input
        ><el-input
          class="searchItem"
          placeholder="请输入开户城市"
          prefix-icon="el-icon-place"
          v-model="kaihucity"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-button type="primary" style="margin: 0 0 6px 1%" @click="search"
          >搜索</el-button
        >
        <el-button type="danger" style="margin: 0 0 6px 1%" @click="clearInput"
          >一键清空</el-button
        >
        <el-button
          type="success"
          v-if="importStatus"
          style="margin: 0 0 6px 1%"
          @click="exportExcel"
          >导出数据</el-button
        >
        <el-button
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

export default {
  name: "accountInforSheet",
  components: { reTable, rePage },
  data() {
    return {
      inputName: "", //户名
      inputCard: "", //卡号
      orderField: "", //排序字段
      orderType: "", //排序规则
      heightItem: "",
      dbName: "", //案件名字段
      seIn: "请输入交易卡号",
      type: "",
      currentPage: 1,
      total: 0,
      tableData: [], // 表格数据
      headerData: [], // 表头数据
      wangdiandaima: "",
      kaihuwangdian: "",
      kaihuprovinces: "",
      kaihucity: "",
      min_balance: "",
      max_balance: "",
      min_keyongbalance: "",
      max_keyongbalance: "",
      hzInfor: "", //汇总信息
      importStatus: true, //导出状态
      getLoading: true, //传给table，停止加载
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
  },
  mounted() {
    this.getHead();
    this.getList();
    this.hzInformation();
    this.tableHeightCalc();
  },
  methods: {
    //清空输入
    clearInput() {
      this.inputName = "";
      this.inputCard = "";
      this.wangdiandaima = "";
      this.kaihuwangdian = "";
      this.kaihuprovinces = "";
      this.kaihucity = "";
      this.min_balance = "";
      this.max_balance = "";
      this.min_keyongbalance = "";
      this.max_keyongbalance = "";
      this.currentPage = 1;
      this.getList();
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 680;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 600;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 500;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 320;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 240;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 780;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 920;
      }
      //映射列表
      this.heightItem = this.heightItem.toString();
    },
    change(val) {
      // if (val == "") {
      this.currentPage = 1;
      this.getList();
      // }
    },
    //汇总数据
    async hzInformation() {
      let { data: res } = await this.$http.post(
        `/accountnum/getAccountNumCount`,
        {},
        {
          params: {
            db_name: this.dbName,
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
        `/accountnum/importAccountNumData`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          wangdiandaima: this.wangdiandaima,
          kaihuwangdian: this.kaihuwangdian,
          kaihuprovinces: this.kaihuprovinces,
          kaihucity: this.kaihucity,
          min_balance: this.min_balance,
          max_balance: this.max_balance,
          min_keyongbalance: this.min_keyongbalance,
          max_keyongbalance: this.max_keyongbalance,
          order_field: this.orderField,
          order_type: this.orderType,
        },
        {
          params: {
            db_name: this.dbName,
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
    //搜索
    search() {
      this.currentPage = 1;
      this.getList();
    },
    //页码改变
    pageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //获取表头数据
    async getHead() {
      let { data: res } = await this.$http.post(
        `/index/getTableColumnList`,
        {},
        {
          params: {
            title: "账号分析-账户统计-账户信息表",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.headerData = res.data;
      }
    },
    //获取表格数据
    async getList() {
      this.getLoading = true;
      let { data: res } = await this.$http.post(
        `/accountnum/getAccountNumList`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          wangdiandaima: this.wangdiandaima,
          kaihuwangdian: this.kaihuwangdian,
          kaihuprovinces: this.kaihuprovinces,
          kaihucity: this.kaihucity,
          min_balance: this.min_balance,
          max_balance: this.max_balance,
          min_keyongbalance: this.min_keyongbalance,
          max_keyongbalance: this.max_keyongbalance,
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
#accountInforSheet {
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
      .changeStyle {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        height: 38px;
        overflow: hidden;
        /deep/.el-input__inner {
          border: none;
        }
      }
    }

    .content {
      width: 100%;
      margin: 10px 0;
    }
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
</style>