<!--账户关联分析-->
<template>
  <div id="externalCapitalFlow">
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
          style="width: 60%; margin-right: 20px"
          :height="heightItem"
          v-if="heightItem"
          ref="multipleTable"
          v-loading="loadingTable"
          element-loading-text="数据加载中"
          class="table-fixed"
          :show-overflow-tooltip="true"
          @sort-change="topTableSort"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ 'text-align': 'left' }"
          border
        >
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column
            v-for="item in headerData"
            :key="item.id"
            :prop="item.propName"
            :label="item.labelName"
            :sortable="item.order"
            :width="item.width"
            :show-overflow-tooltip="true"
            :align="item.align"
          >
          </el-table-column>
          <slot name="operate"></slot>
        </el-table>
        <el-tooltip
          class="item"
          effect="dark"
          content="显隐分组列表"
          placement="bottom"
        >
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            class="data"
            circle
            @click="changeDis"
            style="padding: 0"
            v-if="changeGroDis"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            class="data"
            circle
            @click="changeDis"
            style="padding: 0"
            v-else
          ></el-button>
        </el-tooltip>
        <div
          class="groupList"
          ref="groupDis"
          v-loading="loadingGroup"
          element-loading-text="数据加载中"
        >
          <div class="title">
            <span>分组列表</span>
          </div>
          <el-collapse v-model="activeNames" style="border-bottom: none">
            <el-checkbox-group v-model="checkList">
              <div
                v-for="item in groupList"
                :key="item.id"
                class="groupListDis"
              >
                <el-checkbox :label="item.groupname"></el-checkbox>
                <el-collapse-item :name="item.id">
                  <div
                    class="groupListItem"
                    v-for="item in item.users"
                    :key="item.id"
                  >
                    {{ item.name + item.fundcard }}
                  </div>
                </el-collapse-item>
              </div>
            </el-checkbox-group>
          </el-collapse>
        </div>
      </div>
      <div class="page">
        <rePage
          :currentPg="currentPage"
          :totalPage="total"
          @pageChange="pageChange"
        >
        </rePage>
      </div>
      <!-- 图表弹框 -->
      <el-dialog
        title="图表"
        :visible.sync="flowDialog"
        width="1620px"
        top="0vh"
        style="padding: 10px 20px"
        :close-on-click-modal="false"
        @close="close"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="外部资金流向图" name="first">
            <el-input
              class="searchItem"
              placeholder="请输入最大数据条数"
              prefix-icon="el-icon-bank-card"
              v-model="maxNum"
              @input="changeTbButtonStatus"
              style="width: 220px"
              clearable
            >
            </el-input>
            <el-button
              type="primary"
              :disabled="wbStatus"
              style="margin: 0 0 6px 1%"
              @click="searchTb(0)"
              >生成图表</el-button
            >
            <el-button type="success" @click="exportTb(0)">导出图表</el-button>

            <div
              style="height: 690px"
              v-loading="loading"
              element-loading-text="加载图表中"
            >
              <externalEchart
                :exterList="exterList"
                title="外部资金流向图"
                v-if="getData == 1"
              />
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
          </el-tab-pane>
          <el-tab-pane label="共同交易对手图" name="second">
            <el-input
              class="searchItem"
              placeholder="请输入最少共同对手个数"
              prefix-icon="el-icon-bank-card"
              v-model="accuracy"
              @input="changegtButtonStatus"
              style="width: 220px"
              clearable
            >
            </el-input>
            <el-button
              type="primary"
              style="margin: 0 0 6px 1%"
              :disabled="gtStatus"
              @click="searchTb(1)"
              >生成图表</el-button
            >
            <el-button type="success" @click="exportTb(1)">导出图表</el-button>

            <div
              style="height: 690px"
              v-loading="loadingEx"
              element-loading-text="加载图表中"
            >
              <externalEchart
                :exterList="exterList"
                title="共同交易对手图"
                v-if="getData == 2"
              />
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
          </el-tab-pane>
        </el-tabs>

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
import cjs from "@/components/cjs";
import externalEchart from "@/components/tradeCharts/externalEchart";

export default {
  name: "externalCapitalFlow",
  components: { cjs, rePage, externalEchart },
  data() {
    return {
      activeName: "first",
      inputName: "", //户名
      inputCard: "", //卡号
      dbName: "", //案件名字段
      currentPage: 1,
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      loadingTable: true,
      loadingGroup: true,
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      wbStatus: true,
      gtStatus: true,
      kzId: "", //快照ID
      activeNames: [0],
      groupList: [], //分组列表
      flowDialog: false,
      heightItem: "",
      maxNum: "",
      loading: false,
      loadingEx: false,
      getData: -1,
      multipleSelection: [],
      ids: [],
      checkList: [],
      groupTb: [], //分组列表选中的id
      multipleSelectionId: [], //账号id
      accuracy: "", //精细度
      lastWbInput: "", //外部上一次保存的输入条件
      lastGtInput: "", //共同上一次保存的输入条件
      exterList: [
        {
          data: [],
          links: [],
        },
      ], //传给charts的数据
      changeGroDis: true, //控制分组列表显隐
      isdiaodan: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      status: "",
      min_allmoney: "",
      max_allmoney: "",
      min_inmoney: "",
      max_inmoney: "",
      min_outmoney: "",
      max_outmoney: "",
      min_submoney: "",
      max_submoney: "",
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
      that.getGroupList();
      that.tableHeightCalc();
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index == 0 && this.maxNum != "") {
        this.getTb();
      } else if (tab.index == 1 && this.accuracy != "") {
        this.getTbCo();
      }
    },
    //改变外部生成图表按钮状态
    changeTbButtonStatus(val) {
      if (val != "" && val != this.lastWbInput) {
        this.wbStatus = false;
      } else {
        this.wbStatus = true;
      }
    },
    changegtButtonStatus(val) {
      if (val != "" && val != this.lastGtInput) {
        this.gtStatus = false;
      } else {
        this.gtStatus = true;
      }
    },
    close() {
      this.getData = -1;
      this.lastWbInput = "";
      this.lastGtInput = "";
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
    //控制右侧分组列表显隐
    changeDis() {
      if (this.changeGroDis) {
        this.$refs.groupDis.style.display = "none";
        this.changeGroDis = false;
      } else {
        this.$refs.groupDis.style.display = "block";
        this.changeGroDis = true;
      }
    },
    searchTb(val) {
      if (val == 0) {
        this.wbStatus = true;
        if (this.maxNum != "") {
          this.loading = true;
          this.lastWbInput = this.maxNum;
          this.getTb();
        } else {
          this.getData = -1;
        }
      } else if (val == 1) {
        this.gtStatus = true;
        if (this.accuracy != "") {
          this.loadingEx = true;
          this.lastGtInput = this.accuracy;
          this.getTbCo();
        } else {
          this.getData = -1;
        }
      }
    },
    flow(val) {
      this.maxNum = "";
      this.accuracy = "";
      this.groupTb = [];
      this.exterList = [];
      this.multipleSelectionId = [];
      for (let j = 0; j < this.checkList.length; j++) {
        for (let k = 0; k < this.groupList.length; k++) {
          if (this.checkList[j] == this.groupList[k].groupname) {
            this.groupTb.push(this.groupList[k].id);
          }
        }
      }
      for (let a = 0; a < this.multipleSelection.length; a++) {
        this.multipleSelectionId.push(this.multipleSelection[a].id);
      }
      if (this.multipleSelection.length != 0 || this.groupTb.length != 0) {
        this.flowDialog = true;
      } else {
        this.$message.error("请选择账号");
      }
    },
    //上传数据生成外部资金流向图
    async getTb() {
      this.getData = -1;
      let { data: res } = await this.$http.post(
        `/accountsummary/getExternalFlow`,
        {
          multipaccount: this.multipleSelectionId,
          grouptb: this.groupTb,
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
        this.exterList.links = res.data.links;
        this.exterList.data = res.data.nodes;
        this.getData = 1;
        this.loading = false;
        // console.log(res);
      }
    },
    //上传数据生成共同交易对手图
    async getTbCo() {
      this.getData = -1;
      let { data: res } = await this.$http.post(
        `/accountsummary/getCommon`,
        {
          multipaccount: this.multipleSelectionId,
          grouptb: this.groupTb,
        },
        {
          params: {
            db_name: this.dbName,
            kzname: this.kzId,
            max_num: this.accuracy,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.exterList.links = res.data.links;
        this.exterList.data = res.data.nodes;
        this.getData = 2;
        this.loadingEx = false;
      }
    },
    exportTb(val) {
      let mycanvas = document.getElementsByTagName("canvas")[0];
      let image = mycanvas.toDataURL("image/jpg");
      let $a = document.createElement("a");
      $a.setAttribute("href", image);
      if (val == 0) {
        $a.setAttribute("download", "外部资金流向图下载.jpg");
      } else if (val == 1) {
        $a.setAttribute("download", "共同交易对手图下载.jpg");
      }
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
    async getGroupList() {
      //获取分组数据
      let { data: res } = await this.$http.post(
        `/group/getGroupList`,
        {
          kzname: this.kzId,
        },
        {
          params: {
            db_name: this.dbName,
            type: 1,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res.data", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].editGroup = false;
        }
        this.groupList = res.data;
        this.loadingGroup = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
#externalCapitalFlow {
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
      .groupList {
        width: 20%;
        // height: 680px;
        background-color: #fff;
        padding: 0 1%;
        overflow-y: auto;
        .title {
          color: #909399;
          font-size: 14px;
          font-weight: 600;
          cursor: default;
          padding: 20px 0 19px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .groupListDis {
          display: flex;
          justify-content: flex-start;
          // align-items: center;
          border-bottom: 1px solid #ebeef5;
          .el-checkbox {
            width: 6%;
            height: 48px;
            line-height: 48px;
          }
          .el-collapse-item {
            width: 94%;
          }
        }
        /* .el-collapse-item__header {
        border: none !important;
      } */
        .groupListItem {
          padding: 2%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .groupListItem:hover {
          background-color: #f5f7fa;
          color: #409eff;
        }
      }
    }
    .page {
      width: 100%;
      text-align: right;
    }
    .data {
      width: 35px;
      height: 35px;
      position: absolute;
      top: 10%;
      right: 3%;
    }
  }
}
/deep/.el-dialog__body {
  padding: 0 20px;
}
</style>