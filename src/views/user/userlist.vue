<!--用户列表-->
  <template>
  <div id="userlist">
    <div class="main">
      <div class="search">
        <el-input
          placeholder="请输入用户名"
          prefix-icon="el-icon-search"
          v-model="name"
          @input="change"
          style="width: 12%"
          clearable
        >
        </el-input>
        <el-button type="primary" style="margin: 0% 1%" @click="search"
          >搜索</el-button
        >
        <el-button type="primary" @click="addUserDialogVisible = true"
          >新增管理员</el-button
        >
      </div>
      <div class="content">
        <reTable
          :tableData="tableData"
          :heightItem="heightItem"
          v-if="heightItem"
          :type="type"
          :header="headerData"
          @orderChange="orderCh"
          class="contentItem"
          :getLoading="getLoading"
        >
          <div slot="operate">
            <el-table-column label="操作" fixed="right" min-width="240">
              <template class="operation" slot-scope="scope">
                <el-button
                  v-if="scope.row.status != '超管'"
                  type="primary"
                  plain
                  @click="statusC(scope.row)"
                  >修改状态</el-button
                >
                <el-button v-else type="primary" plain disabled
                  >修改状态</el-button
                >
                <el-button type="warning" plain @click="resetPwd(scope.row.id)"
                  >重置密码</el-button
                >
              </template>
            </el-table-column>
          </div>
        </reTable>
      </div>
      <div class="page">
        <rePage :currentPg="currentPage" :totalPage="total"> </rePage>
      </div>

      <!--新增用户对话框-->
      <el-dialog
        title="新增管理员"
        :visible.sync="addUserDialogVisible"
        width="500px"
        @close="addUserClose"
      >
        <el-form
          :model="addUserForm"
          :rules="addUserFormRules"
          ref="addUserFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="addUserForm.username"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="addUserForm.password"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--改变状态对话框-->
      <el-dialog
        title="状态更改"
        :visible.sync="statusDialogVisible"
        width="30%"
      >
        <el-radio-group v-model="radio">
          <el-radio :label="1">管理员</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="statusChange">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import reTable from "@/components/table";
import rePage from "@/components/page";

export default {
  name: "userlist",
  components: { reTable, rePage },
  data() {
    return {
      name: "",
      type: "",
      total: 0,
      heightItem: "",
      curretId: 0,
      currentPage: 1, // 当前的页数
      pageSize: 10, // 当前每页显示多少条数据
      orderField: "", //排序字段
      orderType: "", //排序规则
      radio: 1,
      /* //操作数据
      operation: [
        { index: 1, name: "修改状态" },
        { index: 2, name: "重置密码" },
      ], */
      tableData: [], // 表格数据
      headerData: [], // 表头数据
      addUserDialogVisible: false, // 新增管理员对话框开关
      statusDialogVisible: false, // 改变状态对话框开关
      getLoading: true, //传给table，停止加载
      //新增管理员表单对象
      addUserForm: {
        username: "",
        password: "",
      },
      // 新增管理员表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.getAdminList();
    this.getAdminHead();
    this.tableHeightCalc();
  },
  methods: {
    change() {
      this.currentPage = 1;
      this.getAdminList();
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
      this.getAdminList();
    },
    //搜索
    search() {
      this.currentPage = 1;
      this.getAdminList();
    },
    // 监听页码改变
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getAdminList();
    },
    async getAdminHead() {
      //获取表头数据
      let { data: res } = await this.$http.post(
        `/index/getTableColumnList`,
        {},
        {
          params: {
            title: "用户管理-用户列表",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.headerData = res.data;
      }
    },
    async getAdminList() {
      //获取表格数据
      this.getLoading = true;
      let { data: res } = await this.$http.post(
        `/admin/getUserList`,
        {
          username: this.name,
          order_field: this.orderField,
          order_type: this.orderType,
        },
        {
          params: {
            pagenum: this.currentPage,
            pagesize: this.pageSize,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        let resData = res.data.data;
        for (let i = 0; i < resData.length; i++) {
          if (resData[i].status == 1) {
            resData[i].status = "管理员";
          } else if (resData[i].status == 2) {
            resData[i].status = "超管";
            // this.operation.splice(1, 1);
          } else if (resData[i].status == 0) {
            resData[i].status = "禁用";
          }
        }
        this.tableData = resData;
        this.total = res.data.count;
        this.getLoading = false;
      }
    },
    // 提交新增管理员表单
    submitAddUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请确认输入是否规范");
        let { data: res } = await this.$http.post(
          "/admin/addUser",
          {},
          { params: this.addUserForm }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.$message.success(`新增用户${this.addUserForm.username}成功`);
          this.addUserDialogVisible = false;
          this.getAdminList();
        }
      });
    },
    // 新增表单关闭
    addUserClose() {
      this.$refs.addUserFormRef.resetFields();
    },
    statusC(row) {
      this.statusDialogVisible = true;
      this.curretId = row.id;
      if (row.status == "管理员") {
        this.radio = 1;
      } else if (row.status == "禁用") {
        this.radio = 0;
      }
      // console.log("row",row)
    },
    //状态改变
    async statusChange() {
      let { data: res } = await this.$http.post(
        "/admin/editUserStatus",
        {},
        {
          params: {
            id: this.curretId,
            status: Number(this.radio),
          },
        }
      );
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.statusDialogVisible = false;
        this.getAdminList();
      }
    },
    // 重置密码
    async resetPwd(id) {
      let confirmRes = await this.$confirm("是否重置密码？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消重置密码操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          "/admin/resetUserPassword",
          {},
          { params: { id } }
        );
        if (res.code === 0) {
          this.$message.success(res.msg);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
#userlist {
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