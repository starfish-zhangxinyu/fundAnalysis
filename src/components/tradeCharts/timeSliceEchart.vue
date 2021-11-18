<template>
  <div id="timeSlice">
    <div id="item" style="width: 1400px; height: 560px"></div>
  </div>
</template>
<script>
export default {
  name: "timeSlice",
  props: {
    timeList: Object,
  },
  data() {
    return {
      tSliceList: this.timeList,
    };
  },
  watch: {
    timeList: function (val) {
      this.tSliceList = val;
      this.drawLine();
    },
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // console.log("tSliceList",this.tSliceList)
      var timeData = this.tSliceList.timeData;
      var times = this.tSliceList.times;
      var listSe = this.tSliceList.series;
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("item"));
      // 绘制图表
      myChart.setOption({
        backgroundColor:"#fff",
        title: {
          text: "时间切片分析图",
          x: "center",
          textStyle: {
            color: "#000",
            fontSize: "14",
            fontWeight: "600",
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: function (a) {
            //a[0].seriesName 进一
            let time = "";
            let list = [];
            let listItem = "";
            for (var i = 0; i < a.length; i++) {
              let k = listSe[a[i].seriesIndex].data.indexOf(a[i].value);
              time = times[a[i].seriesIndex].time[k];
              list.push(
                '<div style="width:70px;">' +
                  a[i].seriesName +
                  "</div>&nbsp&nbsp时间：" +
                  a[i].name +
                  "&nbsp&nbsp金额(万元)：" +
                  a[i].value +
                  "&nbsp&nbsp次数：" + 
                  time
              );
            }
            listItem = list.join("<br>");
            return '<div class="showBox">' + listItem + "</div>";
          },
          axisPointer: {
            animation: false,
          },
        },
        legend: {
          data: this.tSliceList.legend.data,
          left: 10,
        },
        
        axisPointer: {
          link: { xAxisIndex: "all" },
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [1, 1, 1],
          },
          {
            type: "inside",
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0, 1],
          },
        ],
        grid: [
          {
            left: 50,
            right: 50,
            height: "35%",
          },
          {
            left: 50,
            right: 50,
            top: "55%",
            height: "35%",
          },
        ],
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: { onZero: true },
            data: timeData,
          },
          {
            gridIndex: 1,
            type: "category",
            boundaryGap: false,
            axisLine: { onZero: true },
            data: timeData,
            position: "top",
          },
        ],
        yAxis: [
          {
            name: "进帐(万元)",
            type: "value",
          },
          {
            gridIndex: 1,
            name: "出帐(万元)",
            type: "value",
            inverse: true,
          },
        ],
        series: this.tSliceList.series,
      });
    },
  },
};
</script>
<style lang="less" scoped>
</style>
