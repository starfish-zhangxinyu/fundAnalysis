<template>
  <div id="home">
    <el-container>
      <el-aside :class="{ content_collapse: collapse }" width="200px">
        <div class="slideTitle" v-show="!collapse">
          <i></i>
          星聚资金分析工具
        </div>
        <leftside></leftside>
      </el-aside>
      <el-container>
        <el-header>
          <hNav></hNav>
          <div class="tag">
            <tags></tags>
          </div>
        </el-header>
        <el-main>
          <div class="content">
            <transition name="move" mode="out-in">
              <!-- <keep-alive :include="tagsList"> -->
              <router-view></router-view>
              <!-- </keep-alive> -->
            </transition>
            <el-backtop target=".content"></el-backtop>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import hNav from "../components/hNav";
import leftside from "../components/leftside";
import bus from "../components/bus";
import tags from "../components/tags";

export default {
  name: "home",
  components: {
    hNav,
    leftside,
    tags,
  },
  data() {
    return {
      tagsList: [],
      collapse: false,
      content_collapse: ["content_collapse"],
    };
  },
  created() {
    bus.$on("collapse-content", (msg) => {
      this.collapse = msg;
    });
    bus.$on("tags", (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].path && arr.push(msg[i].path);
      }
      this.tagsList = arr
    });
  },
};
</script>

<style lang="less" scoped>
#home {
  width: 100%;
  height: 100vh;

  .el-container {
    height: 100vh;
    overflow: hidden;
    .el-aside {
      width: 200px;
      background: linear-gradient(90deg, #1f469a, #1d4589);
      height: 100vh;

      .slideTitle {
        i {
          display: inline-block;
          background: url("../assets/img/police-gov.png") no-repeat;
          background-size: contain;
          width: 20px;
          height: 21px;
          vertical-align: middle;
        }
        font-weight: 700;
        height: 56px;
        line-height: 56px;
        text-align: center;
        background: linear-gradient(90deg, #1f469a, #1d4589);
        color: #fff;
      }
    }

    .content_collapse {
      width: 64px !important;
    }

    .el-header {
      height: 80px !important;
      background-color: #f2f2f7;
      position: relative;

      /* .tag {
        background: #f2f2f7;
        height: 40px;
        border-top: 1px solid #ccc;
      } */
    }
    .el-main {
      // background-color: #f5f8fd;
      background-color: #F2F2F7;
      height: calc(100vh - 120px);
      overflow: hidden !important;
      padding:10px 20px;
      .content {
        height: 100%;
      }
    }
  }
}
</style>
