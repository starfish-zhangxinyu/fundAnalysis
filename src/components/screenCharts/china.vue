<template>
  <div id="china"></div>
</template>

<script>
require("../../../static/china");
export default {
  props: { leftdata: Array },
  name: "china",
  data() {
    return {
      leftdataa: this.leftdata,
    };
  },
  created() {
    this.$nextTick(() => {
      this.initC();
    });
  },
  watch: {
    leftdata: function (val) {
      this.leftdataa = val;
      this.initC();
    },
  },
  methods: {
    initC() {
      const chart = this.$echarts.init(document.getElementById("china"));
      chart.setOption(
        {
          title: {
            text: "涉案人员分布图",
            x: "center",
            y: "10%",
            textStyle: {
              color: "#f2f2f7",
              fontSize: 30,
            },
          },
          backgroundColor: "rgba(10, 46, 93, 0.6)",
          tooltip: {
            trigger: "item",
          },
          dataRange: {
            min: 0,
            max: 800,
            x: "left",
            y: 500,
            text: ["高", "低"],
            color: ["#e42515", "#f2f2f7"],
            textStyle: {
              color: "#f2f2f7",
            },
            calculable: true,
          },
          series: [
            {
              name: "涉案人员",
              type: "map",
              mapType: "china",
              roam: false,
              itemStyle: {
                normal: {
                  label: { show: true, textStyle: { color: "#303960" } },
                },
                emphasis: {
                  label: {
                    show: false,
                    textStyle: {
                      color: "#00a4ff",
                    },
                  },
                },
              },
              data: this.leftdataa,
            },
          ],
        },
        true
      );
    },
  },
};
</script>

<style lang="less" scoped>
#china {
  height: 100%;
  width: 100%;
}
</style>
