<template>
  <div id="exter">
    <div id="item" style="width: 1580px; height: 700px"></div>
  </div>
</template>
<script>
export default {
  name: "exter",

  props: {
    exterList: Array,
    title: String,
  },
  data() {
    return {
      externalList: this.exterList,
      left: 20,
      middle: 40,
      right: 20,
      location: 0,
      ex: this.dis,
      titleN: this.title,
    };
  },
  watch: {
    exterList: function (val) {
      this.externalList = val;
    },
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // console.log("externalList", this.externalList);
      // 节点图标
      let masterSymbol =
        "image://" + require("../../../src/assets/img/name.png"); //蓝
      let rSymbol = "image://" + require("../../../src/assets/img/right.png"); //灰
      let nodeList = this.externalList.data;
      let nodeDataList = [];
      let locate = false;
      for (let i = 0; i < nodeList.length; i++) {
        let temp = {
          name: "",
          value: [0, 0],
          symbol: rSymbol,
          symbolSize: 30,
        };
        nodeDataList.push(temp);
        if (nodeList[i].level == 0) {
          locate = true;
        }
      }
      for (let i = 0; i < nodeList.length; i++) {
        nodeDataList[i].name = nodeList[i].name;
        nodeDataList[i].symbolSize = 30;
        if (nodeList[i].level == 0) {
          nodeDataList[i].value = [0, (this.left += 50)];
          nodeDataList[i].symbol = rSymbol;
        } else if (nodeList[i].level == 1) {
          if (locate) {
            nodeDataList[i].value = [60, (this.middle += 400)];
          } else {
            nodeDataList[i].value = [0, (this.middle += 400)];
          }
          nodeDataList[i].symbol = masterSymbol;
        } else if (nodeList[i].level == 2) {
          if (locate) {
            nodeDataList[i].value = [120, (this.right += 50)];
          } else {
            nodeDataList[i].value = [10, (this.right += 50)];
          }
          nodeDataList[i].symbol = rSymbol;
        }
      }
      // console.log("nodeDataList", nodeDataList);
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("item"));
      // 绘制图表
      myChart.setOption(
        {
          title: {
            text: this.titleN,
            top: "top",
            left: "center",
          },
          itemStyle: {
            normal: {
              color: "#67C23A",
            },
            shadowBlur: 0,
          },
          textStyle: {
            color: "#444",
            fontSize: 16,
            fontWeight: 600,
          },
          backgroundColor: "#fff",
          legend: [
            {
              formatter: function (name) {
                return echarts.format.truncateText(name, 200, "12px", "…");
              },
              tooltip: {
                show: true,
              },
              selectedMode: "false",
              bottom: 10,
            },
          ],
          /* toolbox: {
            feature: {
              saveAsImage: {},
            },
          }, */
          grid: {
            x: 80, //默认是80px
            y: 60, //默认是60px
            x2: 460, //默认80px
            y2: 60, //默认60px
          },
          animationDuration: 500,
          animationEasingUpdate: "quinticInOut",
          xAxis: {
            show: false,
            type: "value",
          },
          yAxis: {
            show: false,
            type: "value",
          },
          series: [
            {
              type: "graph",
              coordinateSystem: "cartesian2d",
              legendHoverLink: false,
              hoverAnimation: true,
              nodeScaleRatio: false,
              //箭头
              edgeSymbol: ["circle", "arrow"],
              edgeSymbolSize: [2, 10],
              edgeLabel: {
                show: false,
                normal: {
                  show: true,
                  position: "middle",
                  textStyle: {
                    fontSize: 12,
                  },
                  formatter: "{c}",
                },
              },
              focusNodeAdjacency: true,
              roam: false,
              //圆形上面的文字
              label: {
                normal: {
                  position: "right",
                  show: true,
                  textStyle: {
                    fontSize: 12,
                  },
                },
              },
              itemStyle: {
                normal: {
                  color: "#409eff",
                },
                shadowBlur: 0,
              },
              lineStyle: {
                normal: {
                  curveness: 0.2,
                  color: "#7D130E",
                  width: 1,
                },
              },
              data: nodeDataList,
              links: this.externalList.links,
            },
          ],
        },
        true
      );
      //点击事件
      let that = this;
      myChart.on("click", function (params) {
        let target = document.createElement("input"); //创建input节点
        target.style.display = "none"; //input不显示
        target.value = params.data.name; // 给input的value赋值
        document.body.appendChild(target); // 向页面插入input节点
        target.select(); // 选中input
        document.execCommand("Copy"); // 执行浏览器复制命令
        that.$message({
          message: "复制成功",
          type: "success",
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>
