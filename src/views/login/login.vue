<!--登录页面-->
<template>
  <div id="login">
    <dv-border-box-1 :reverse="true" class="content">
      <div class="title">星聚资金分析工具</div>
      <div class="tag">欢迎回来，请输入您的用户名和密码进行登录</div>
      <form class="inputItem">
        <el-input placeholder="用户名" v-model="account" clearable> </el-input>
        <el-input
          placeholder="密码"
          v-model="password"
          show-password
          clearable
        ></el-input>
      </form>
      <el-button class="submit" type="primary" @click="login">登录</el-button>
    </dv-border-box-1>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data() {
    return {
      account: "", //账号
      password: "", // 密码
      loginIp: "",
    };
  },
  mounted() {
    this.loginIp = window.sessionStorage.getItem("loginIp");
    window.addEventListener('keydown',this.keyDown);
  },
  destroyed(){
    window.removeEventListener('keydown',this.keyDown,false);
  },
  methods: {
    keyDown(e){
      //如果是回车则执行登录方法
      if(e.keyCode == 13){
        this.login();
      }
    },
    async login() {
      let that = this;
      if (!that.account.trim() || !that.password.trim()) {
        that.$message.error("请输入用户名和密码");
      } else {
        // this.$router.push("/caseList");

        try {
          let { data: res } = await that.$http.post(
            `${that.loginIp}login/login?username=${that.account}&password=${that.password}`
          );
          if (res.code === 1) return that.$message.error(res.msg);
          if (res.code === 0) {
            that.$message.success(res.msg);
            window.sessionStorage.setItem("username", that.account);
            window.sessionStorage.setItem("wsToken", res.data.wsToken);
            window.sessionStorage.setItem("token", res.data.token);
            window.sessionStorage.setItem("baseToken", res.data.baseToken);
            that.$router.push("/caseList");
          }
        } catch (e) {
          that.$message.error({
            message: e || "出现错误，请稍后再试",
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff url("../../assets/img/loginBg.jpg") no-repeat fixed top;
  background-size: cover;

  .content {
    width: 660px;
    height: 500px;
    color: #fff;
    text-align: center;
    background-color: rgba(23, 46, 64, 0.9);

    .title {
      font-size: 30px;
      margin: 10% 0;
    }
    .tag {
      font-size: 14px;
    }
    .inputItem {
      width: 100%;
      margin: 2% 0;
      text-align: center;
      .el-input {
        width: 40%;
        margin: 2% 6% 2% 6%;
      }
    }
    .submit {
      width: 40%;
      background-color: #1e468e;
      border: 1px solid #1e468e;
      font-weight: 600;
    }
  }
}
</style>