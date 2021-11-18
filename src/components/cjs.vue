<style lang="less" scoped>
#cytoscape_id :nth-child(3) {
  position: relative !important;
  left: 0 !important;
}
</style>

<template>
  <div style="position: relative; height: 100%; width: 100%; z-index: 0">
    <div id="cytoscape_id" style="height: 100%; width: 100%; z-index: 1"></div>
  </div>
</template>

<script>
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import cola from "cytoscape-cola";
// import avsdf from "cytoscape-avsdf";
import coseBilkent from "cytoscape-cose-bilkent";
import klay from "cytoscape-klay";

export default {
  name: "CJS",
  props: {
    inputValue: Array,
  },
  data() {
    return {
      linkId: "",
      inputN: this.inputValue,
      type: "",
      dbName: "",
      kzId: "",
    };
  },
  watch: {
    inputValue: function (val) {
      this.inputN = val;
    },
  },
  beforeCreate() {
    this.$cy && this.$cy.destroyed() && this.$cy.destroy();
    delete this.$cy;
  },
  beforeDestroy() {
    this.$cy && this.$cy.destroyed() && this.$cy.destroy();
    delete this.$cy;
  },
  props: {},
  created() {
    this.linkId = window.sessionStorage.getItem("linkId");
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    // Cxtmenu圆形菜单主要依赖组件
    if (!cytoscape().cxtmenu) {
      cytoscape.use(cxtmenu);
      cytoscape.use(cola);
      // cytoscape.use(avsdf);
      cytoscape.use(coseBilkent);
    }
    cytoscape.use(klay);

    this.$cy = cytoscape({
      // initial viewport state:
      zoom: 1, // 图表的初始缩放级别.可以设置options.minZoom和options.maxZoom设置缩放级别的限制.
      pan: { x: 0, y: 0 }, // 图表的初始平移位置.
      // interaction options:
      minZoom: 0.3, // 图表缩放级别的最小界限.视口的缩放比例不能小于此缩放级别.
      maxZoom: 4, // 图表缩放级别的最大界限.视口的缩放比例不能大于此缩放级别.
      zoomingEnabled: true, // 是否通过用户事件和编程方式启用缩放图形.
      userZoomingEnabled: true, // 是否允许用户事件(例如鼠标滚轮,捏合缩放)缩放图形.对此缩放的编程更改不受此选项的影响.
      panningEnabled: true, // 是否通过用户事件和编程方式启用平移图形.
      userPanningEnabled: true, // 是否允许用户事件(例如拖动图形背景)平移图形.平移的程序化更改不受此选项的影响.
      boxSelectionEnabled: true, // 是否启用了框选择(即拖动框叠加,并将其释放为选择).如果启用,则用户必须点击以平移图表.
      selectionType: "single",
      touchTapThreshold: 8, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
      desktopTapThreshold: 4, // 非负整数,分别表示用户在轻击手势期间可以在触摸设备和桌面设备上移动的最大允许距离.这使得用户更容易点击.
      autolock: false, // 默认情况下是否应锁定节点(根本不可拖动,如果true覆盖单个节点状态).
      autoungrabify: false, // 默认情况下节点是否不允许被拾取(用户不可抓取,如果true覆盖单个节点状态).
      autounselectify: false, // 默认情况下节点是否允许被选择(不可变选择状态,如果true覆盖单个元素状态).
      // rendering options:
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      hideLabelsOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 1,
      pixelRatio: "auto",
      container: document.getElementById("cytoscape_id"),
      // 一个指定布局选项的普通对象.
    });
    // Cxtmenu圆形菜单--开始
    this.$cy.cxtmenu({
      menuRadius: 80,
      selector: "node",
      commands: (element) => {
        return [
          {
            fillColor: "rgba(200, 200, 200, 0.75)",
            content: "<span>查找上游</span>",
            contentStyle: { "font-size": "12px" },
            select: (ele) => this.lightOnLast([ele.id()]),
            enabled: true,
          },
          {
            fillColor: "rgba(200, 200, 200, 0.75)",
            content: "",
            contentStyle: { display: "hidden" },
            select: function (ele) {
              // alert(ele.id());
            },
            enabled: true,
          },
          {
            fillColor: "rgba(200, 200, 200, 0.75)",
            content: "<span>高亮邻居</span>",
            contentStyle: { "font-size": "12px" },
            select: (ele) => this.lightOn([ele.id()]),
            enabled: true,
          },
          {
            fillColor: "rgba(200, 200, 200, 0.75)",
            content: "<span>查找下游</span>",
            contentStyle: { "font-size": "12px" },
            select: (ele) => this.lightOnNext([ele.id()]),
            enabled: true,
          },
        ];
      },
      fillColor: "rgba(0, 0, 0, 0.75)", // 指令默认颜色(the background colour of the menu)
      activeFillColor: "rgba(64,158,255,0.75)", // 所选指令的颜色(the colour used to indicate the selected command)
      activePadding: 2, // additional size in pixels for the active command
      indicatorSize: 14, // the size in pixels of the pointer to the active command
      separatorWidth: 4, //连续命令之间的空白间隔(以像素为单位)
      spotlightPadding: 2, //元素和聚光灯之间的额外间距(以像素为单位)
      minSpotlightRadius: 10, // the minimum radius in pixels of the spotlight
      maxSpotlightRadius: 14, // the maximum radius in pixels of the spotlight
      openMenuEvents: "cxttapstart taphold", // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
      itemColor: "#fff", // 各指令元素内字体颜色
      itemTextShadowColor: "#F56C6C", // 各指令元素内字体阴影颜色
      zIndex: 9999, // the z-index of the ui div
      atMouse: true, // draw menu at mouse position
    });
    //Cxtmenu圆形菜单--结束
    // 不同节点的样式
    this.$cy
      .style()
      .selector(".classes-A")
      .style({
        "background-color": "#E6A23C",
        "border-color": "#E6A23C",
        "border-width": "1px",
      })
      .selector(".classes-B")
      .style({
        "background-color": "#67C23A",
        "border-color": "#67C23A",
        "border-width": "1px",
      })
      .selector(".classes-C")
      .style({
        "background-color": "#409EFF",
        "border-color": "#409EFF",
        "border-width": "1px",
      })
      .selector(".classes-D")
      .style({
        "background-color": "#E0E0E0",
        "border-color": "#E0E0E0",
        "border-width": "1px",
      });
    // 通用的样式
    this.$cy
      .style()
      /*未选择节点样式*/
      .selector("node")
      .style({
        label: "data(name)",
        "font-size": "10px",
        width: "8pt",
        height: "8pt",
      })
      /*已选择节点样式*/
      .selector("node:selected")
      .style({ "border-color": "#c84e40", "border-width": "1px" })
      /*未选择节点样式*/
      .selector("edge")
      .style({
        label: "data(name)",
        "target-arrow-shape": "triangle-backcurve" /*箭头样式*/,
        "target-arrow-size": "1px" /*箭头大小*/,
        "target-arrow-color": "#999999" /*箭头颜色*/,
        "curve-style": "bezier" /*线条样式曲线*/,
        "line-color": "#999999" /*线条颜色*/,
        width: "1px" /*线条宽度*/,
        "font-size": "10px" /*标签字体大小*/,
        color: "#000000" /*标签字体颜色*/,
        "text-outline-color": "white" /*文本轮廓颜色*/,
        "text-outline-width": "1px" /*文本轮廓宽度*/,
        "text-rotation": "autorotate" /*标签方向*/,
      })
      /*已选择节点样式*/
      .selector("edge:selected")
      .style({
        color: "#3165fc" /*标签字体颜色*/,
        "target-arrow-color": "#61bffc" /*箭头颜色*/,
        "line-color": "#61bffc" /*线条颜色*/,
      })
      /*高亮样式*/
      .selector(".light-off")
      .style({ opacity: "0.1" });
  },
  data() {
    return {};
  },
  methods: {
    lightOn(ele) {
      this.$cy.startBatch();
      this.$cy.batch(() => {
        this.$cy.elements().addClass("light-off"); //*添加样式*/
        let elements = (
          Array.isArray
            ? Array.isArray(ele)
            : null != ele && ele instanceof Array
        )
          ? ele
          : [ele];
        elements.forEach((__) => {
          this.$cy.getElementById(__).removeClass("light-off");
          this.$cy.getElementById(__).neighborhood().removeClass("light-off");
        });
      });
      this.$cy.once("click", () => this.lightOff());
      this.$cy.endBatch();
    },
    lightOnNext(ele) {
      this.type = 1;
      this.getLast(ele);
      this.$cy.startBatch();
      this.$cy.batch(() => {
        this.$cy.elements().addClass("light-off"); //*添加样式*/
        let elements = (
          Array.isArray
            ? Array.isArray(ele)
            : null != ele && ele instanceof Array
        )
          ? ele
          : [ele];
        elements.forEach((__) => {
          this.$cy.getElementById(__).removeClass("light-off");
          this.$cy.getElementById(__).outgoers().removeClass("light-off");
        });
      });
      this.$cy.once("click", () => this.lightOff());
      this.$cy.endBatch();
    },
    /* 请求节点数据 */
    async getLast(ele) {
      this.inputN = JSON.parse(window.sessionStorage.getItem("inputV"));
      let { data: res } = await this.$http.post(
        `/accountmoneyclean/fenxiChuantou`,
        {
          multipaccount: this.multipleSelectionId,
          grouptb: this.groupTb,
        },
        {
          params: {
            db_name: this.dbName,
            kzname: this.kzId,
            type: this.type,
            id: this.linkId,
            fundcard: ele[0] || "",
            hours: this.inputN.hours,
            money: this.inputN.money,
            count: this.inputN.count,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.addEles(res.data);
      }
    },
    lightOnLast(ele) {
      this.type = 0;
      this.getLast(ele);
      this.$cy.startBatch();
      this.$cy.batch(() => {
        this.$cy.elements().addClass("light-off"); //*添加样式*/
        let elements = (
          Array.isArray
            ? Array.isArray(ele)
            : null != ele && ele instanceof Array
        )
          ? ele
          : [ele];
        elements.forEach((__) => {
          this.$cy.getElementById(__).removeClass("light-off");
          this.$cy.getElementById(__).incomers().removeClass("light-off");
        });
      });
      this.$cy.once("click", () => this.lightOff());
      this.$cy.endBatch();
    },
    lightOff() {
      this.$cy.startBatch();
      this.$cy.batch(
        () => this.$cy.elements().removeClass("light-off") /*移除样式*/
      );
      this.$cy.endBatch();
    },
    addEles(eles) {
      if (eles) {
        this.$cy.startBatch();
        // let all = this.$cy.getElementById("cytoscape_id");
        this.$cy.batch(() => {
          let elements = (
            Array.isArray
              ? Array.isArray(eles)
              : null != eles && eles instanceof Array
          )
            ? eles
            : [eles];
          let filterElements = elements.filter(
            (__) => !this.$cy.getElementById(__.data.id).length
          );
          this.$cy.add(filterElements);
        });
        this.$cy
          .layout({
            name: "klay",
            nodeDimensionsIncludeLabels: false,
            fit: true, 
            padding: 20,
            animate: false,
            animateFilter: function (node, i) {
              return true;
            },
            animationDuration: 500,
            animationEasing: undefined,
            transform: function (node, pos) {
              return pos;
            },
            ready: undefined,
            stop: undefined,
            klay: {
              addUnnecessaryBendpoints: false,
              aspectRatio: 1.6,
              borderSpacing: 20, 
              compactComponents: false,
              crossingMinimization: "LAYER_SWEEP", 
              cycleBreaking: "GREEDY",
              direction: "UNDEFINED", 
              edgeRouting: "ORTHOGONAL", 
              edgeSpacingFactor: 0.5, 
              feedbackEdges: false, 
              fixedAlignment: "NONE", 
              inLayerSpacingFactor: 1.0, 
              layoutHierarchy: false, 
              linearSegmentsDeflectionDampening: 0.3, 
              mergeEdges: false,
              mergeHierarchyCrossingEdges: true,
              nodeLayering: "NETWORK_SIMPLEX", 
              nodePlacement: "BRANDES_KOEPF", 
              randomizationSeed: 1,
              routeSelfLoopInside: false,
              separateConnectedComponents: true, 
              spacing: 40,
              thoroughness: 7, 
            },
            priority: function (edge) {  
              return null;
            },
          })
          .run();
        this.$cy.endBatch();
      }
    },
    /**
     * 删除选择的内容(可能是顶点, 也可能是关系)
     */
    delEles() {
      this.$cy.startBatch();
      this.$cy.batch(() => {
        let selectedEles = this.$cy.elements(":selected");
        // 未选择不进行操作
        if (!selectedEles || 1 > selectedEles.length) {
          return false;
        }
        selectedEles.remove();
      });
      this.$cy.endBatch();
    }
  },
};
</script>
