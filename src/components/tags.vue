<!--tags-->
<template>
  <div class="tags" v-if="showTags">
    <ul class="ulItem" style="margin: 0; padding: 0">
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
      >
        <span @click="changeActivePath(item.path)">
          <router-link :to="item.path" class="tags-li-title">{{
            item.title
          }}</router-link>
        </span>
        <span
          class="tags-li-icon"
          @click="closeTags(index)"
          v-if="isNotLastTag"
        >
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import bus from "./bus";

export default {
  data() {
    return {
      tagsList: [],
      isNotLastTag: true,
    };
  },
  methods: {
    isActive(path) {
      return path === this.$route.fullPath;
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0];
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      this.changeActivePath(item.path);
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path);
      }
      if (this.tagsList.length == 1) {
        this.isNotLastTag = false;
      }
    },
    changeActivePath(path) {
      window.sessionStorage.setItem("activePath", path);
      bus.$emit("changeActive", path);
    },
    // 关闭全部标签
    closeAll() {
      this.tagsList = [];
      let path = window.location.hash.substring(1);
      window.sessionStorage.setItem("activePath", path);
      bus.$emit("changeActive", path);
      this.isNotLastTag = false;
      this.$router.push("/caseList");
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter((item) => {
        return item.path === this.$route.fullPath; //|| item.path === '/caseList'
      });
      this.isNotLastTag = false;
      this.tagsList = curItem;
    },
    // 设置标签
    setTags(route) {
      if (this.tagsList.length == 1) {
        this.isNotLastTag = false;
      }
      const isExist = this.tagsList.some((item) => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        if (this.tagsList.length >= 10) {
          this.tagsList.shift();
        }
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          // name: route.matched[1].components.default.name
        });
        if (this.tagsList.length > 1) {
          this.isNotLastTag = true;
        }
      }
      bus.$emit("tags", this.tagsList);
      bus.$emit("changeActive", route.fullPath);
    },
    handleTags(command) {
      command === "other" ? this.closeOther() : this.closeAll();
    },
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    },
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    },
  },
  mounted() {
    if (this.tagsList.length == 1) {
      this.isNotLastTag = false;
    }
  },
  created() {
    this.setTags(this.$route);
    // 监听关闭当前页面的标签页
    bus.$on("close_current_tags", () => {
      for (let i = 0, len = this.tagsList.length; i < len; i++) {
        const item = this.tagsList[i];
        if (item.path === this.$route.fullPath) {
          if (i < len - 1) {
            this.$router.push(this.tagsList[i + 1].path);
          } else if (i > 0) {
            this.$router.push(this.tagsList[i - 1].path);
          } else {
            this.$router.push("/caseList");
          }
          this.tagsList.splice(i, 1);
          break;
        }
      }
    });
  },
};
</script>


<style lang="less" scoped>
.tags {
  position: relative;
  height: 40px;
  overflow: hidden;
  background: #f2f2f7;
  border-bottom: 1px solid #fff;
  box-sizing: border-box;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0 !important;
  list-style-type: none;
}

.tags-li {
  float: left;
  font-size: 14px;
  margin: 5px 5px 0 0;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;

  .tags-li-icon {
    .el-icon-close:hover {
      background-color: rgba(168, 230, 207, 0.4);
      color: #fe346e;
      border-radius: 50%;
    }
  }
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li::marker {
  display: none;
}

.tags-li.active {
  color: #fff;
  background-color: #1f469a;
}

.tags-li-title {
  float: left;
  margin-right: 5px;
  text-decoration: none;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 35px;
  z-index: 10;

  .el-button {
    height: 35px;
  }
}
</style>
