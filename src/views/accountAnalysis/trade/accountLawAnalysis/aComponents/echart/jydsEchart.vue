<!--
 * @Author: your name
 * @Date: 2021-03-09 14:29:19
 * @LastEditTime: 2021-05-14 09:38:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fundAnalysis\src\views\accountAnalysis\trade\accountLawAnalysis\aComponents\echart\jydsEchart.vue
-->
<template>
  <div id="exter">
    <div ref="item" style="width: 500px; height: 260px"></div>
  </div>
</template>
<script>
export default {
  name: "exter",

  props: {
    echartData: Object,
  },
  data() {
    return {
      echartsData: this.echartData,
    };
  },
  watch: {
    echartData: function (val) {
      this.echartsData = val;
      // console.log("123", val);
      this.drawLine();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  methods: {
    drawLine() {
      // console.log("echartsData", this.echartsData);
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.item);
      // 绘制图表
      myChart.setOption(
        {
          title: {
            text: this.echartsData.name,
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          color: [
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3",
            "#8378ea",
          ],
          /* legend: {
          orient: "vertical",
          left: "left",
        }, */
          series: [
            {
              name: this.echartsData.name,
              type: "pie",
              radius: "50%",
              data: this.echartsData.data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
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
</style>
