<!--账户规律分析-->
<template>
  <div id="accountLawAnalysis">
    <div class="main">
      <div class="search">
        <search @search="search" />
      </div>
      <div class="content">
        <reTable
          class="contentItem"
          :tableData="tableData"
          :type="type"
          @orderChange="orderCh"
          :heightItem="heightItem"
          :header="headerData"
          v-if="heightItem"
          @sort-change="topTableSort"
          :getLoading="getLoading"
        >
          <div slot="operate">
            <el-table-column label="操作" fixed="right" min-width="420">
              <template class="operation" slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="special(scope.row)"
                  >账号特征汇总</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="editBz(scope.row)"
                  >修改备注</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="editSkr(scope.row)"
                  >修改实控人</el-button
                >
                <el-button
                  type="success"
                  size="mini"
                  plain
                  style="margin-left: 10px"
                  @click="toMore(scope.row)"
                >
                  分析
                </el-button>
              </template>
            </el-table-column>
          </div>
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
      <!--修改备注对话框-->
      <el-dialog title="修改备注" :visible.sync="editBzDialog" width="500px">
        <el-form
          :model="editBzForm"
          :rules="editBzFormRules"
          ref="editBzFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="备注" prop="beizhu">
            <el-input
              v-model="editBzForm.beizhu"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editBzDialog = false">取 消</el-button>
          <el-button type="primary" @click="submiteditBz">确 定</el-button>
        </span>
      </el-dialog>

      <!--修改实控人对话框-->
      <el-dialog title="修改实控人" :visible.sync="editSkrDialog" width="500px">
        <el-form
          :model="editSkrForm"
          :rules="editSkrFormRules"
          ref="editSkrFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="实控人" prop="skr">
            <el-input
              v-model="editSkrForm.skr"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editSkrDialog = false">取 消</el-button>
          <el-button type="primary" @click="submiteditSkr">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import reTable from "@/components/table";
import rePage from "@/components/page";
import search from "@/components/search";

export default {
  name: "accountLawAnalysis",
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
      editBzDialog: false,
      editSkrDialog: false,
      editCard: "", //当前行卡号
      //备注
      editBzForm: {
        casename: "",
        beizhu: "",
      },
      //备注验证规则
      editBzFormRules: {
        beizhu: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
      //实控人
      editSkrForm: {
        skr: "",
      },
      //实控人验证规则
      editSkrFormRules: {
        skr: [{ required: true, message: "请输入实控人", trigger: "blur" }],
      },
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
      this.tableHeightCalc();
    }
  },
  methods: {
    /* 账号特征汇总 */
    special(row) {
      console.log(row)
      let routeUrl = this.$router.resolve({
        path: `/baogao?fundcard=${row.fundcard}&account=${row.name}`,
      });
      window.open(routeUrl.href, "_blank");
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
    /* 修改备注 */
    editBz(row) {
      this.editCard = row.fundcard;
      this.editBzForm.beizhu = row.beizhu;
      this.editBzDialog = true;
    },
    /* 修改实控人 */
    editSkr(row) {
      this.editCard = row.fundcard;
      this.editSkrForm.skr = row.skr;
      this.editSkrDialog = true;
    },
    toMore(row) {
      this.$router.push({
        path: "/accountLawMore",
        query: { name: row.name, fundcard: row.fundcard },
      });
    },
    // 提交修改备注
    submiteditBz() {
      this.$refs.editBzFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请确认输入是否规范");
        let { data: res } = await this.$http.post(
          "/accountdict/editBeizhu",
          {},
          {
            params: {
              db_name: this.dbName,
              fundcard: this.editCard,
              beizhu: this.editBzForm.beizhu,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.$message.success(`修改备注成功`);
        }
        this.editBzDialog = false;
        this.getList();
      });
    },
    // 提交修改实控人
    submiteditSkr() {
      this.$refs.editSkrFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请确认输入是否规范");
        let { data: res } = await this.$http.post(
          "/accountdict/editRealcontrolman",
          {},
          {
            params: {
              db_name: this.dbName,
              fundcard: this.editCard,
              realcontrolman: this.editSkrForm.skr,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.$message.success(`修改实控人成功`);
        }
        this.editSkrDialog = false;
        this.getList();
      });
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
    search(
      inputN,
      inputC,
      status,
      min_allmoney,
      max_allmoney,
      min_inmoney,
      max_inmoney,
      min_outmoney,
      max_outmoney,
      min_submoney,
      max_submoney
    ) {
      this.inputName = inputN;
      this.inputCard = inputC;
      this.status = status;
      this.max_allmoney = max_allmoney;
      this.min_allmoney = min_allmoney;
      this.min_inmoney = min_inmoney;
      this.max_inmoney = max_inmoney;
      this.min_outmoney = min_outmoney;
      this.max_outmoney = max_outmoney;
      this.min_submoney = min_submoney;
      this.currentPage = 1;
      this.max_submoney = max_submoney;
      this.getList();
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
#accountLawAnalysis {
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
      position: relative;
    }
    .content {
      width: 100%;
      margin: 10px 0;
    }
    .page {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>