<!--账户字典表-->
<template>
  <div id="accountDictionary">
    <div class="main">
      <div class="search" style="width: 100%">
        <el-input
          class="searchItem"
          placeholder="请输入交易户名"
          prefix-icon="el-icon-user-solid"
          v-model="inputName"
          style="width: 160px"
          clearable
          @input="change"
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
          placeholder="请输入实际控制人"
          prefix-icon="el-icon-s-custom"
          v-model="realcontrolman"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入备注"
          prefix-icon="el-icon-document"
          v-model="beizhu"
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
          :header="headerData"
          :heightItem="heightItem"
          @orderChange="orderCh"
          :getLoading="getLoading"
          @sort-change="topTableSort"
          v-if="heightItem"
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
  name: "accountDictionary",
  components: { reTable, rePage },
  data() {
    return {
      inputName: "", //户名
      inputCard: "", //卡号
      dbName: "", //案件名字段
      type: "",
      heightItem: "",
      currentPage: 1,
      orderField: "", //排序字段
      orderType: "", //排序规则
      total: 0,
      tableData: [], // 表格数据
      headerData: [], // 表头数据
      kzId: "", //快照ID
      kaihuwangdian: "", //开户网点
      realcontrolman: "", //实际控制人
      beizhu: "", //备注
      importStatus: true, //导出状态
      getLoading: true, //传给table，停止加载
      hzInfor: "", //汇总信息
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
      /* if (document.body.clientWidth < 1560) {
        this.heightItem = '540'
      }else {
        this.heightItem='720'
      } */
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 720;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 640;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 540;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 420;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 320;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 820;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 940;
      }
      this.heightItem = this.heightItem.toString();
    },
    change(val) {
      //输入改变时，重发数据请求
      // if (val == "") {
      this.currentPage = 1;
      this.getList();
      // }
    },
    //清空输入
    clearInput() {
      this.inputName = "";
      this.inputCard = "";
      this.kaihuwangdian = "";
      this.realcontrolman = "";
      this.beizhu = "";
      this.hzInfor = "";
      this.currentPage = 1;
      this.getList();
    },
    //导出表格
    async exportExcel() {
      this.importStatus = false;
      this.$message.info("数据导出中，请耐心等待");
      let { data: res } = await this.$http.post(
        `/accountdict/importAccountDictData`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          kzname: this.kzId,
          order_field: this.orderField,
          order_type: this.orderType,
          kaihuwangdian: this.kaihuwangdian,
          realcontrolman: this.realcontrolman,
          beizhu: this.beizhu,
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
    //汇总数据
    async hzInformation() {
      let { data: res } = await this.$http.post(
        `/accountdict/getAccountDictCount`,
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
    //获取表头数据
    async getHead() {
      let { data: res } = await this.$http.post(
        `/index/getTableColumnList`,
        {},
        {
          params: {
            title: "账号分析-账户统计-账户字典表",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.headerData = res.data;
        // console.log("this.headerData",this.headerData)
      }
    },
    //获取表格数据
    async getList() {
      this.getLoading = true;
      let { data: res } = await this.$http.post(
        `/accountdict/getAccountDictList`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          kzname: this.kzId,
          order_field: this.orderField,
          order_type: this.orderType,
          kaihuwangdian: this.kaihuwangdian,
          realcontrolman: this.realcontrolman,
          beizhu: this.beizhu,
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
    del() {},
  },
};
</script>

<style lang="less" scoped>
#accountDictionary {
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
      .searchItem {
        margin: 0 0 6px 6px;
      }
    }

    .content {
      width: 100%;
      margin: 10px 0;
      /deep/.is-scrolling-none {
        height: 660px !important;
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
}
</style>