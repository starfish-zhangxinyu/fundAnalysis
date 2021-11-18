<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style>
#app {
  height: 100vh;
  overflow: auto;
}
body {
  margin: 0;
  min-width: 1230px;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  z-index: 999;
}

::-webkit-scrollbar-thumb {
  background-color: #C0C4CC;
  border-radius: 3px;
  z-index: 999;
}
.el-aside {
  overflow-x: hidden;
}
</style>
