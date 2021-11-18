<!--头部导航-->
<template>
  <div id="hNav" style="height: 40px; border-bottom: 1px solid #cccccc">
    <div class="left">
      <!-- 折叠按钮 -->
      <div class="collapse-btn">
        <i v-if="!collapse" @click="collapseChange" class="el-icon-s-fold"></i>
        <i v-else @click="collapseChange" class="el-icon-s-unfold"></i>
      </div>
      <!-- 大屏按钮 -->
      <el-tooltip
        class="item"
        effect="dark"
        content="数据展示"
        placement="bottom"
        v-if="kzItem.length"
      >
        <el-button
          type="primary"
          icon="el-icon-s-data"
          class="data"
          circle
          @click="goToScreen"
        ></el-button>
      </el-tooltip>
    </div>
    <div class="right">
      <span class="case" v-if="caseItem.length" @click="toCase">
        当前案件为：
        <span style="font-size: 16px; color: #409eff">{{ caseItem }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="msgTooltip"
          placement="bottom"
          v-if="msgTooltip != ''"
        >
          <el-button class="tishi"
            ><i class="el-icon-message-solid"></i
          ></el-button>
        </el-tooltip>
      </span>
      <span class="case" v-if="kzItem.length" @click="toKz">
        当前快照为：
        <span style="font-size: 16px; color: #409eff">{{ kzItem }}</span>
      </span>
      <!-- 下拉菜单 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <img
            src="../assets/img/touxiang.png"
            alt="头像"
            style="width: 26px; height: 26px; padding: 0 6px"
          />
          <span>
            <span style="font-size: 16px">{{ username }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            divided
            @click.native="changePasswordDialogVisible = true"
            >修改密码</el-dropdown-item
          >
          <el-dropdown-item divided @click.native="loginOut"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--    修改密码对话框-->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      width="50%"
      @close="handleClose"
    >
      <el-form
        :model="changePasswordForm"
        :rules="changePasswordFormRules"
        ref="changePasswordFormRef"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item label="请输入旧密码" prop="old_password">
          <el-input
            type="password"
            show-password
            v-model="changePasswordForm.old_password"
          ></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码" prop="password">
          <el-input
            type="password"
            show-password
            v-model="changePasswordForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="请确认密码" prop="re_password">
          <el-input
            type="password"
            show-password
            v-model="changePasswordForm.re_password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordDialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitChangePassword"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from "./bus";

export default {
  name: "hNav",
  data() {
    //此处即表单发送之前验证  验证新密码与原密码
    let validateNewPassword = (rule, value, callback) => {
      if (value === this.changePasswordForm.old_password) {
        callback(new Error("新密码不能与原密码相同!"));
      } else {
        callback();
      }
    };
    //此处即表单发送之前验证  验证新密码与再次确认
    let validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.changePasswordForm.password) {
        callback(new Error("与新密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      collapse: false,
      msgTooltip: "",
      loginIp:"",
      username: "",
      caseItem: "",
      dbName: "",
      changePasswordDialogVisible: false,
      changePasswordForm: {
        old_password: "",
        password: "",
        re_password: "",
      },
      changePasswordFormRules: {
        old_password: [
          {
            required: true,
            message: "请输入旧密码",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 10,
            message: "密码长度在6到10位",
            trigger: "blur",
          },
          {
            validator: validateNewPassword,
            trigger: "blur",
          },
        ],
        re_password: [
          {
            required: true,
            message: "请确认密码",
            trigger: "blur",
          },
          {
            validator: validateNewPassword2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.username = window.sessionStorage.getItem("username");
    this.caseItem = window.sessionStorage.getItem("caseItem") || "";
    this.dbName = window.sessionStorage.getItem("db_name") || "";
    this.kzItem = window.sessionStorage.getItem("kzItem") || "";
    this.loginIp= window.sessionStorage.getItem("loginIp");
  },
  mounted() {
    if (this.dbName != "") {
      this.getTooltip();
    }
    this.checkToken();
  },

  methods: {
    toCase() {
      this.$router.push("/caseList");
    },
    toKz() {
      this.$router.push("/dataClean");
    },
    goToScreen() {
      let token = window.sessionStorage.getItem("token");
      this.$router.push(`/screen?t=${token}`);
    },
    //检查token
    async checkToken() {
      let { data: res } = await this.$http.post(
        `${this.loginIp}login/checkToken`,
        {},
        {
          params: {
            username: this.username,
            type:1,
          },
        }
      );
      if (res.code === 0) {
      }
      if (res.code === 1) {
        this.$message.error(res.msg);
        this.loginOut();
      }
    },
    //获取tooltip
    async getTooltip() {
      let { data: res } = await this.$http.post(
        "/criminal/getCriminalTips",
        {},
        {
          params: {
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 0) {
        return;
      }
      if (res.code === 1) {
        this.msgTooltip = res.msg;
      }
    },
    // 侧边栏折叠
    collapseChange() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    handleClose() {
      this.$refs.changePasswordFormRef.resetFields();
    },
    //修改密码
    async submitChangePassword() {
      let { data: res } = await this.$http.post(
        `${this.loginIp}login/editUserPassword`,
        {},
        {
          params: {
            username: this.username,
            oldPassword: this.changePasswordForm.old_password,
            password: this.changePasswordForm.password,
            rePassword: this.changePasswordForm.re_password,
          },
        }
      );
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.loginOut();
      }
    },
    // 退出登录
    loginOut() {
      // window.sessionStorage.clear();
      this.$router.push("/login");
      //设置监听 禁止返回上一页面
      history.pushState(null, null, document.URL);
      window.addEventListener(
        "popstate",
        function (e) {
          history.pushState(null, null, document.URL);
        },
        false
      );
    },
  },
};
</script>

<style lang="less" scoped>
#hNav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    height: 100%;
    // width: 50px;
    width: 20%;
    font-size: 24px;
    line-height: 40px;
  }

  .right {
    width: 80%;
    height: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    /* .rightStatus {
      font-size: 14px;
      margin-right: 1%;
      color: #606266;
    } */
    .case {
      // width: 40%;
      height: 40px;
      line-height: 40px;
      // margin-right: 1%;
      border-radius: 4px;
      font-size: 14px;
      padding: 0 1%;
    }
    .el-dropdown-link {
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: nowrap;
    }
    .case:hover {
      background-color: #c6e2ff;
    }
  }

  .data {
    width: 35px;
    height: 35px;
    position: absolute;
    top: 3%;
    left: 5%;
  }

  .is-circle {
    padding: 6px;
  }
  /* 取消感叹号按钮样式 */
  .tishi {
    font-size: 18px;
    color: #f56c6c;
    padding: 0;
    background-color: transparent;
    border: none;
  }

  .el-dropdown {
    border-left: 2px solid #c0c4cc;
    padding-left: 1%;
  }
}
</style>
