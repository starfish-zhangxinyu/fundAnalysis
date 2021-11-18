<!--ip分析-->
<template>
  <div id="ip">
    <div class="main">
      <div class="search">
        <el-input
          class="searchItem"
          placeholder="请输入ip网段"
          prefix-icon="el-icon-monitor"
          v-model="ipWangDuan"
          @input="change"
          style="width: 240px"
          clearable
        >
        </el-input>
        <el-button type="primary" style="margin: 0 0 6px 1%" @click="search"
          >搜索
        </el-button>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width: 100%; margin: 10px 0 20px 0"
          :height="heightItem"
          v-if="heightItem"
          v-loading="loading"
          element-loading-text="数据加载中"
          @sort-change="topTableSort"
          ref="multipleTable"
          :header-cell-style="{ 'text-align': 'left' }"
          border
        >
          >
          <el-table-column
            prop="ipwangduan"
            label="ip网段"
            sortable
            width="300"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="ipnum"
            label="ip个数"
            sortable
            align="right"
            width="240"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="cardnum"
            label="卡号个数"
            sortable
            align="right"
            width="240"
            :show-overflow-tooltip="true"
          >
          </el-table-column
          ><el-table-column
            prop="macnum"
            label="mac个数"
            align="right"
            sortable
            width="240"
            :show-overflow-tooltip="true"
          >
          </el-table-column
          ><el-table-column
            prop="jywdnum"
            label="交易网点个数"
            align="right"
            sortable
            width="240"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" plain @click="toMore(scope.row)"
                >查看交易明细</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-drawer
        :title="title"
        :visible.sync="table"
        direction="rtl"
        size="50%"
      >
        <el-table
          :data="gridData"
          height="780"
          v-loading="gridDataLoading"
          element-loading-text="数据加载中"
          border
          :header-cell-style="{ 'text-align': 'left' }"
        >
          >
          <el-table-column
            property="fundcard"
            label="卡号"
            :show-overflow-tooltip="true"
            width="200"
          ></el-table-column>
          <el-table-column
            property="name"
            :show-overflow-tooltip="true"
            label="户名"
            width="180"
          ></el-table-column>
          <el-table-column
            property="jiaoyimoney"
            :show-overflow-tooltip="true"
            label="交易金额"
            width="200"
            align="right"
          ></el-table-column>
          <el-table-column
            property="shoufubiaozhi"
            :show-overflow-tooltip="true"
            label="收付标志"
            width="160"
          ></el-table-column
          ><el-table-column
            property="othercard"
            :show-overflow-tooltip="true"
            label="对手卡号"
            width="200"
          ></el-table-column
          ><el-table-column
            property="othername"
            label="对手户名"
            :show-overflow-tooltip="true"
            width="200"
          ></el-table-column
          ><el-table-column
            property="jiaoyitype"
            label="交易类型"
            :show-overflow-tooltip="true"
            width="160"
          ></el-table-column
          ><el-table-column
            property="beizhu"
            label="摘要备注"
            :show-overflow-tooltip="true"
            width="200"
          ></el-table-column>
        </el-table>
        <div style="width: 100%; text-align: right">
          <el-button
            type="success"
            v-if="importStatus"
            style="margin: 1%"
            @click="exportExcel"
            >导出数据</el-button
          >
          <el-button
            type="success"
            style="margin: 1%"
            v-else
            :loading="true"
            >导出数据中</el-button
          >
        </div>
      </el-drawer>

      <div class="page">
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
import rePage from "@/components/page";

export default {
  name: "ip",
  components: { rePage },
  data() {
    return {
      title: "", //抽屉的标题
      loading: true,
      toExIp:"",
      tableData: [], // 表格数据
      dbName: "", //案件名字段
      currentPage: 1,
      kzId: "", //快照ID
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      ipWangDuan: "", //ip网段
      table: false,
      gridData: [],
      heightItem: "",
      gridDataLoading: true,
      importStatus: true, //导出状态
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
      that.getList();
      that.tableHeightCalc();
    }
  },
  methods: {
    //导出数据
    async exportExcel() {
      this.importStatus = false;
      this.$message.info("数据导出中，请耐心等待");
      let { data: res } = await this.$http.post(
        `/ip/exportIp`,
        {},
        {
          params: {
            db_name: this.dbName,
            ip: this.toExIp,
            kzname: this.kzId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.importStatus = true;
        this.$message.success(res.msg);
        window.location = res.data;
      }
    },
    search() {
      this.currentPage = 1;
      this.getList();
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 660;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 580;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 480;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 360;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 260;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 760;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 900;
      }
      this.heightItem = this.heightItem.toString();
    },
    toMore(row) {
      this.table = true;
      this.gridDataLoading = true;
      this.title = "ip网段：" + row.ipwangduan;
      this.toExIp = row.ipwangduan;
      this.getCtList(row.ipwangduan);
    },
    change(val) {
      // if (val == "") {
      this.currentPage = 1;
      this.getList();
      // }
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
    //页码改变
    pageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //获取表格数据
    async getList() {
      this.loading = true;
      let { data: res } = await this.$http.post(
        `/ip/getIpList`,

        {
          order_field: this.orderField,
          order_type: this.orderType,
          kzname: this.kzId,
          ipwangduan: this.ipWangDuan,
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
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });
      }
    },
    //获取抽屉表格数据
    async getCtList(ip) {
      let { data: res } = await this.$http.post(
        `/ip/getIpAccountCleanList`,
        {},
        {
          params: {
            ip: ip,
            kzname: this.kzId,
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.gridData = res.data;
        this.gridDataLoading = false;
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
#ip {
  width: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 170px);
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
    .page {
      width: 100%;
      text-align: right;
    }
  }
  /* 取消抽屉聚焦出现边框-开始 */
  /deep/.el-drawer:focus {
    outline: none;
  }
  /deep/.el-drawer__header > :first-child {
    outline: none;
  }
  /deep/.el-drawer__close-btn {
    outline: none;
  }
  /* 取消-结束 */
}
</style>