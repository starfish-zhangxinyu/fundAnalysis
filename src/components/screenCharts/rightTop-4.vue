<template>
  <div id="rightTop4">
    <div id="item4"></div>
  </div>
</template>
<script>
export default {
  name: "rightTop4",
  props: { data4: Object },
  data() {
    return {
      dataS4: this.data4.series,
      x: this.data4.xAxis,
      i: 0,
      iList: [],
      jList: [],
    };
  },
  created() {
    this.$nextTick(() => {
      this.edit();
      this.drawLine();
    });
  },
  watch: {
    data4: function (val) {
      this.dataS4 = val.series;
      this.x = val.xAxis;
      this.drawLine();
    },
  },
  methods: {
    edit() {
      for (let item in this.dataS4) {
        if (this.dataS4[item] > this.i) {
          this.i = this.dataS4[item];
        }
      }
      for (let j = 0; j < this.dataS4.length; j++) {
        this.iList.push(this.i);
        this.jList.push(1);
      }
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("item4"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "账户进账前十",
          x: "center",
          textStyle: {
            color: "#fff",
            fontSize: "14",
            fontWeight: "600",
          },
        },
        textStyle: {
          color: "#c0c3cd",
          fontSize: 14,
        },
        toolbox: {
          show: false,
          feature: {
            saveAsImage: {
              backgroundColor: "#031245",
            },
            restore: {},
          },
          iconStyle: {
            borderColor: "#c0c3cd",
          },
        },
        legend: {
          top: 10,
          itemWidth: 8,
          itemHeight: 8,
          icon: "circle",
          left: "center",
          padding: 0,
          textStyle: {
            color: "#c0c3cd",
            fontSize: 14,
            padding: [2, 0, 0, 0],
          },
        },
        color: [
          "#63caff",
          "#49beff",
          "#03387a",
          "#03387a",
          "#03387a",
          "#6c93ee",
          "#a9abff",
          "#f7a23f",
          "#27bae7",
          "#ff6d9d",
          "#cb79ff",
          "#f95b5a",
          "#ccaf27",
          "#38b99c",
          "#93d0ff",
          "#bd74e0",
          "#fd77da",
          "#dea700",
        ],
        grid: {
          containLabel: true,
          left: 20,
          right: 20,
          bottom: 10,
          top: 40,
        },
        xAxis: {
          nameTextStyle: {
            color: "#c0c3cd",
            padding: [0, 0, -10, 0],
            fontSize: 14,
          },
          axisLabel: {
            color: "#c0c3cd",
            fontSize: 14,
            interval: 0,
            show: false,
          },
          axisTick: {
            lineStyle: {
              color: "#384267",
              width: 1,
            },
            show: true,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#384267",
              width: 1,
              type: "dashed",
            },
            show: true,
          },
          data: this.x,
          type: "category",
        },
        yAxis: {
          nameTextStyle: {
            color: "#c0c3cd",
            padding: [0, 0, -10, 0],
            fontSize: 14,
          },
          axisLabel: {
            color: "#c0c3cd",
            fontSize: 14,
          },
          axisTick: {
            lineStyle: {
              color: "#384267",
              width: 1,
            },
            show: true,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#384267",
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#384267",
              width: 1,
              type: "dashed",
            },
            show: true,
          },
          name: "单位：万元",
        },
        series: [
          {
            data: this.dataS4,
            type: "bar",
            barMaxWidth: "auto",
            barWidth: 30,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: "#0b9eff",
                  },
                  {
                    offset: 1,
                    color: "#63caff",
                  },
                ],
              },
            },
            /* label: {
              show: true,
              position: "top",
              distance: 10,
              color: "#fff",
            }, */
          },
          {
            data: this.jList,
            type: "pictorialBar",
            barMaxWidth: "20",
            symbol: "diamond",
            symbolOffset: [0, "50%"],
            symbolSize: [30, 15],
          },
          {
            data: this.dataS4,
            type: "pictorialBar",
            barMaxWidth: "20",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [30, 12],
            zlevel: 2,
          },
          {
            data: this.iList,
            type: "bar",
            barMaxWidth: "auto",
            barWidth: 30,
            barGap: "-100%",
            zlevel: -1,
          },
          {
            data: this.jList,
            type: "pictorialBar",
            barMaxWidth: "20",
            symbol: "diamond",
            symbolOffset: [0, "50%"],
            symbolSize: [30, 15],
            zlevel: -2,
          },
          {
            data: this.iList,
            type: "pictorialBar",
            barMaxWidth: "20",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [30, 12],
            zlevel: -1,
          },
        ],
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            return (
              "<div>账户：" +
              params[0].name +
              "</div>" +
              "<div>进账：" +
              params[0].value +
              "</div>"
            );
          },
          show: true,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
@media screen and (min-width: 1681px) and (max-width: 1920px) {
  #item4 {
    width: 100%;
    height: 345px;
  }
}
@media screen and (min-width: 1601px) and (max-width: 1680px) {
  #item4 {
    width: 100%;
    height: 330px;
  }
}
@media screen and (min-width: 1441px) and (max-width: 1600px) {
  #item4 {
    width: 100%;
    height: 260px;
  }
}
@media screen and (min-width: 1401px) and (max-width: 1440px) {
  #item4 {
    width: 100%;
    height: 250px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1400px) {
  #item4 {
    width: 100%;
    height: 325px;
  }
}
@media screen and (max-width: 1366px) {
  #item4 {
    width: 100%;
    height: 190px;
  }
}
</style>
