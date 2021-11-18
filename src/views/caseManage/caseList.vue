<!--案件列表-->
<template>
  <div id="caseList">
    <div class="main">
      <div class="search">
        <el-input
          placeholder="请输入案件名称"
          prefix-icon="el-icon-search"
          v-model="input1"
          style="width: 20%"
          @input="inputValue"
          clearable
        >
        </el-input>
        <el-button type="primary" style="margin: 0 1%" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" @click="addCase">新增案件</el-button>
      </div>
      <div class="content">
        <reTable
          class="contentItem"
          :tableData="tableData"
          :type="type"
          :header="headerData"
          :heightItem="heightItem"
          v-if="heightItem"
          @orderChange="orderCh"
          :getLoading="getLoading"
        >
          <div slot="operate">
            <el-table-column label="操作" fixed="right" width="310">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  plain
                  @click="toCase(scope.row)"
                  v-if="scope.row.db_name != dbName"
                  >进入该案件
                </el-button>
                <el-button type="primary" plain v-else disabled
                  >当前案件
                </el-button>
                <el-button type="warning" plain @click="edit(scope.row)"
                  >编辑
                </el-button>
                <el-button
                  type="danger"
                  plain
                  @click="del(scope.row.id)"
                  v-if="scope.row.db_name != dbName"
                  >删除</el-button
                >
                <el-button
                  type="danger"
                  plain
                  @click="outCase(scope.row)"
                  v-if="scope.row.db_name == dbName"
                  >退出</el-button
                >
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
      <!--新增or编辑案件对话框-->
      <el-dialog :title="title" :visible.sync="addCaseDialog" width="500px">
        <el-form
          :model="addCaseForm"
          :rules="addCaseFormRules"
          ref="addCaseFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="案件名称" prop="casename">
            <el-input
              v-model="addCaseForm.casename"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="beizhu">
            <el-input
              v-model="addCaseForm.beizhu"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCaseDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="submitCase"
            :loading="newCaseLoading"
            >{{ newCaseBtnText }}</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import reTable from "@/components/table";
import rePage from "@/components/page";
// import bus from "@/components/bus";
export default {
  name: "caseList",
  inject: ["reload"],
  components: { reTable, rePage },
  data() {
    return {
      newCaseLoading: false,
      newCaseBtnText: "确定",
      input1: "",
      heightItem: "",
      type: "",
      name: "",
      dbName: "",
      title: "", //对话框标题
      editId: "", //编辑案件Id
      addCaseDialog: false,
      currentPage: 1,
      total: 100,
      orderField: "", //排序字段
      orderType: "", //排序规则
      tableData: [], // 表格数据
      headerData: [], // 表头数据
      getLoading: true, //传给table，停止加载
      //管理员表单对象
      addCaseForm: {
        casename: "",
        beizhu: "",
      },
      // 管理员表单验证规则
      addCaseFormRules: {
        casename: [
          { required: true, message: "请输入案件名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.name = window.sessionStorage.getItem("caseItem") || "";
  },
  mounted() {
    this.getHead();
    this.getList();
    this.tableHeightCalc();
  },
  methods: {
    inputValue(val) {
      // if (val == "") {
      this.getList();
      // }
    },
    //退出当前案件
    outCase() {
      window.sessionStorage.removeItem("caseItem");
      window.sessionStorage.removeItem("db_name");
      window.sessionStorage.removeItem("kzItem");
      window.sessionStorage.removeItem("currentKzId");
      this.reload();
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 740;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 660;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 560;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 420;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 330;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 840;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 970;
      }
      this.heightItem = this.heightItem.toString();
    },
    //排序
    orderCh(label, orderType) {
      this.orderField = label;
      this.orderType = orderType;
      this.getList();
    },
    //搜索
    search() {
      this.getList();
    },
    //页码改变
    pageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    toCase(val) {
      // console.log("val",val)
      window.sessionStorage.setItem("caseItem", val.name);
      window.sessionStorage.setItem("db_name", val.db_name);
      // bus.$emit('dbname',  val.db_name);
      window.sessionStorage.removeItem("kzItem");
      window.sessionStorage.removeItem("currentKzId");
      this.reload();
      if (val.count_data) {
        //判断当前案件是否有数据，跳转到相应页面
        this.$router.push(`/dataClean`);
      } else {
        this.$router.push(`/transactionDetails`);
      }
    },
    //新增点击
    addCase() {
      this.title = "新增案件";
      this.addCaseForm.casename = "";
      this.addCaseForm.beizhu = "";
      this.addCaseDialog = true;
    },
    //编辑点击
    edit(row) {
      this.editId = row.id;
      this.addCaseForm.casename = row.name;
      this.addCaseForm.beizhu = row.beizhu;
      this.title = "编辑案件";
      this.addCaseDialog = true;
    },
    //获取表头数据
    async getHead() {
      let { data: res } = await this.$http.post(
        `/index/getTableColumnList`,
        {},
        {
          params: {
            title: "案件管理-案件列表",
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
        `/criminal/getCriminalList`,
        {
          name: this.input1,
          order_field: this.orderField,
          order_type: this.orderType,
        },
        {
          params: {
            pagenum: this.currentPage,
            pagesize: "20",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.tableData = res.data.data;
        // console.log("this.tableData ", this.tableData);
        this.total = res.data.count;
        this.getLoading = false;
      }
    },
    //删除案件
    async del(id) {
      let confirmRes = await this.$confirm("是否删除当前案件？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除案件操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          "/criminal/delCriminal",
          {},
          { params: { id: id } }
        );
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.getList();
        }
      }
    },
    // 提交案件表单
    submitCase() {
      this.$refs.addCaseFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请确认输入是否规范");
        if (this.title == "新增案件") {
          this.newCaseBtnText = "新增中";
          this.newCaseLoading = true;
          let { data: res } = await this.$http.post(
            "/criminal/addCriminal",
            {},
            {
              params: {
                name: this.addCaseForm.casename,
                beizhu: this.addCaseForm.beizhu,
              },
            }
          );
          if (res.code === 1) return this.$message.error(res.msg);
          if (res.code === 0) {
            this.$message.success(`新增案件${this.addCaseForm.casename}成功`);
          }
        } else if (this.title == "编辑案件") {
          this.newCaseBtnText = "编辑中";
          this.newCaseLoading = true;
          let { data: res } = await this.$http.post(
            "/criminal/editCriminal",
            {},
            {
              params: {
                id: this.editId,
                name: this.addCaseForm.casename,
                beizhu: this.addCaseForm.beizhu,
              },
            }
          );
          if (res.code === 1) return this.$message.error(res.msg);
          if (res.code === 0) {
            this.$message.success(`编辑案件${this.addCaseForm.casename}成功`);
          }
        }
        this.addCaseDialog = false;
        this.newCaseBtnText = "确定";
        this.newCaseLoading = false;
        this.getList();
      });
    },
  },
};
</script>

<style lang="less" scoped>
#caseList {
  width: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;
    .search {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .content {
      width: 100%;
      margin: 10px 0;
    }
    .page {
      width: 100%;
      text-align: right;
    }
  }
}
</style>