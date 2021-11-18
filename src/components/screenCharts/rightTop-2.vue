<template>
  <div id="rightTop2">
    <div id="item2"></div>
  </div>
</template>
<script>
export default {
  name: "rightTop2",
  props: { data2: Object },
  data() {
    return {
      dataLen: this.data2.legend ||["",""],
      dataS2:this.data2.series ||[{value:0},{value:0}]
    };
  },
  created() {
    this.$nextTick(() => {
      this.drawLine();
    });
  },
  watch: {
    data2: function (val) {
      this.dataS2 = val.series;
      this.dataLen = val.legend;
      this.drawLine();
    },
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("item2"));
      // 绘制图表
      myChart.setOption({
        title: [
          {
            text: "银行卡账户分类",
            textAlign: "center",
            x: "34%",
            y: "48%",
            textStyle: {
              color: "#fff",
              fontSize: 18,
              fontWeight: "normal",
            },
          },
        ],
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0, 125, 255, 0.6)",
          formatter: function (params) {
            return (
              params.seriesName +
              "<br/>" +
              params.marker +
              '<span style="color:' +
              params.color +
              '">' +
              params.data["name"] +
              "\n" +
              params.data["value"] +
              "</span>"
            );
          },
        },
        legend: [
          {
            // orient: 'vertical',
            x: "70%",
            y: "35%",
            itemWidth: 40,
            itemHeight: 40,
            align: "left",
            textStyle: {
              fontSize: 14,
              color: "#fff",
            },
            data: this.dataLen,
          },
        ],
        series: [
          {
            name: "",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["47%", "60%"],
            center: ["35%", "50%"],
            color: ["#00cfff", "#ffa800","#FD866A","#9E87FF"],
            label: {
              normal: {
                position: "inner",
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            itemStyle: {
              normal: {
                borderColor: "rgba(0, 125, 255, 0.6)",
              },
            },
            tooltip: {
              show: false,
            },
            data: this.dataS2,
          },
          {
            name: "title",
            type: "pie",
            radius: ["55%", "60%"],
            center: ["35%", "50%"],
            color: ["#00cfff", "#ffa800","#FD866A","#9E87FF"],
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{d}%",
                textStyle: {
                  align: "center",
                  baseline: "middle",
                  fontSize: 16,
                  fontWeight: "100",
                },
              },
            },
            labelLine: {
              normal: {
                smooth: true,
                length: 10,
                lineStyle: {
                  width: 1.5,
                },
              },
            },
            itemStyle: {
              normal: {
                shadowBlur: 15,
                shadowColor: "rgba(0, 125, 255, 0.6)",
                borderColor: "rgba(0, 125, 255, 0.6)",
                // borderWidth:'5',
              },
            },
            data: [
              {
                value: this.dataS2[0],
                name: this.dataLen[0],
              },
              {
                value: this.dataS2[1],
                name: this.dataLen[1],
              },
            ],
          },
        ],
      });
    },
  },
};
</script>
<style lang="less" scoped>
@media screen and (min-width: 1681px) and (max-width: 1920px) {
  #item2 {
    width: 100%;
    height: 345px;
  }
}
@media screen and (min-width: 1601px) and (max-width: 1680px) {
  #item2 {
    width: 100%;
    height: 330px;
  }
}
@media screen and (min-width: 1441px) and (max-width: 1600px) {
  #item2 {
    width: 100%;
    height: 260px;
  }
}
@media screen and (min-width: 1401px) and (max-width: 1440px) {
  #item2 {
    width: 100%;
    height: 250px;
  }
}
@media screen and (min-width: 1367px) and (max-width: 1400px) {
  #item2 {
    width: 100%;
    height: 325px;
  }
}
@media screen and (max-width: 1366px) {
  #item2 {
    width: 100%;
    height: 190px;
  }
}
</style>
