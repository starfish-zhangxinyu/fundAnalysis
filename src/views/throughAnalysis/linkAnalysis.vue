<!--链路分析-->
<template>
  <div id="linkAnalysis">
    <div class="main">
      <div class="search">
        <el-input
          class="searchItem"
          placeholder="请输入交易户名"
          prefix-icon="el-icon-user-solid"
          v-model="inputName"
          style="width: 160px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入交易卡号"
          prefix-icon="el-icon-bank-card"
          v-model="inputCard"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <span class="searchItem" style="width: 400px">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            :editable="false"
            @change="updateTime"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </span>
        <el-input
          class="searchItem"
          placeholder="请输入交易网点名称"
          prefix-icon="el-icon-s-home"
          v-model="wangdianming"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入IP地址"
          prefix-icon="el-icon-monitor"
          v-model="ip"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入MAC地址"
          prefix-icon="el-icon-set-up"
          v-model="mac"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <span class="searchItem changeStyle" style="width: 440px">
          <el-input
            placeholder="请输入交易金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_jiaoyimoney"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入交易金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_jiaoyimoney"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <span class="searchItem changeStyle" style="width: 440px">
          <el-input
            placeholder="请输入交易余额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_jiaoyibalance"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入交易余额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_jiaoyibalance"
            style="width: 210px"
            @input="change"
            clearable
          >
          </el-input>
        </span>
        <el-input
          class="searchItem"
          placeholder="请输入对手卡号"
          prefix-icon="el-icon-postcard"
          v-model="othercard"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入对手户名"
          prefix-icon="el-icon-user"
          v-model="othername"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>

        <el-input
          class="searchItem"
          placeholder="请输入备注"
          prefix-icon="el-icon-edit"
          v-model="beizhu"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-input
          class="searchItem"
          placeholder="请输入交易类型"
          prefix-icon="el-icon-tickets"
          v-model="jiaoyitype"
          style="width: 220px"
          @input="change"
          clearable
        >
        </el-input>
        <el-select
          class="searchItem"
          v-model="typefenlei"
          @input="change"
          clearable
          placeholder="请选择交易类型分类"
        >
          <el-option
            v-for="item in typefenleiOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          class="searchItem"
          v-model="zhaiyaobeizhufenlei"
          @input="change"
          clearable
          placeholder="请选择摘要备注分类"
        >
          <el-option
            v-for="item in zhaiyaobeizhufenleiOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" style="margin: 0 0 6px 1%" @click="search"
          >搜索</el-button
        >
        <el-button type="danger" style="margin: 0 0 6px 1%" @click="clearInput"
          >一键清空</el-button
        >
      </div>
      <div class="content">
        <reTable
          class="contentItem"
          :tableData="tableData"
          :type="type"
          :header="headerData"
          :heightItem="heightItem"
          v-if="heightItem"
          @orderChange="orderCh"
          @sort-change="topTableSort"
          :getLoading="getLoading"
        >
          <div slot="operate">
            <el-table-column label="操作" fixed="right" min-width="100">
              <template slot-scope="scope">
                <el-button type="primary" plain @click="fxLink(scope.row)"
                  >分析</el-button
                >
              </template>
            </el-table-column>
          </div>
        </reTable>
      </div>
      <div class="page">
        <rePage
          :currentPg="currentPage"
          :totalPage="total"
          @pageChange="pageChange"
        >
        </rePage>
      </div>
      <el-dialog
        title="链路分析图"
        :visible.sync="flowDialog"
        width="1620px"
        style="padding: 10px 20px"
        top="1vh"
        :before-close="close"
      >
        <div v-if="flowDialog">
          <span>时间范围(小时)：</span>
          <el-input
            placeholder="请输入时间范围"
            prefix-icon="el-icon-search"
            v-model="inputValue.hours"
            style="width: 160px"
            clearable
            @input="changeTb(0)"
          >
          </el-input>
          <span style="margin-left: 1%">交易金额下限(元)：</span>
          <el-input
            placeholder="请输入交易金额下限"
            prefix-icon="el-icon-search"
            v-model="inputValue.money"
            @input="changeTb(1)"
            style="width: 220px"
            clearable
          >
          </el-input>
          <span style="margin-left: 1%">获取记录条数（条）：</span>
          <el-input
            placeholder="请输入获取记录条数"
            prefix-icon="el-icon-search"
            @input="changeTb(2)"
            v-model="inputValue.count"
            style="width: 220px"
            clearable
          >
          </el-input>
          <el-button type="success" @click="get" :disabled="disStatus"
            >确定</el-button
          >
          <span style="margin-left: 1%">节点操作：</span>
          <!-- <el-button size="small" type="success" @click="addEles">添加</el-button> -->
          <el-button type="danger" @click="delEles">删除</el-button>
          <!-- <el-button type="primary" style="margin-left:2%" @click="exportTb">导出图表</el-button> -->
        </div>
        <div slot="footer">
          <cjs
            ref="ref_CJS"
            style="height: 690px"
            :inputValue="inputValue"
            v-if="flowDialog"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <span class="bottomText">注：条件设置是针对查找上下游。</span>
          <span width="60%">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="close">确 定</el-button>
          </span>
        </span>
      </el-dialog>
    </div>
  </div>
</template> 

<script>
import cjs from "../../components/cjs";
import reTable from "@/components/table";
import rePage from "@/components/page";

export default {
  name: "linkAnalysis",
  components: { cjs, reTable, rePage },
  data() {
    return {
      disStatus: true, //图表的确定按钮是否可点击
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value2: "",
      type: "",
      heightItem: "",
      seIn: "请输入交易卡号",
      inputName: "", //户名
      inputCard: "", //卡号
      dbName: "", //案件名字段
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      kzId: "", //快照ID
      flowDialog: false,
      currentPage: 1,
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      inputValue: {
        hours: 100,
        money: 0,
        count: 100,
      },
      resData: [],
      min_jiaoyimoney: "",
      max_jiaoyimoney: "",
      min_jiaoyibalance: "",
      max_jiaoyibalance: "",
      min_fundtime: "",
      max_fundtime: "",
      othercard: "",
      othername: "",
      wangdianming: "",
      ip: "",
      mac: "",
      beizhu: "",
      jiaoyitype: "",
      typefenlei: "",
      zhaiyaobeizhufenlei: "",
      lastInput1: "100",
      lastInput2: "0",
      lastInput3: "100",
      getLoading: true, //传给table，停止加载
      typefenleiOptions: [
        {
          value: "现存",
          label: "现存",
        },
        {
          value: "现取",
          label: "现取",
        },
        {
          value: "转存",
          label: "转存",
        },
        {
          value: "转取",
          label: "转取",
        },
        {
          value: "未知",
          label: "未知",
        },
      ],
      zhaiyaobeizhufenleiOptions: [
        {
          value: "未分类现金",
          label: "未分类现金",
        },
        {
          value: "RMB转账",
          label: "RMB转账",
        },
        {
          value: "税务社保",
          label: "税务社保",
        },
        {
          value: "物业费用",
          label: "物业费用",
        },
        {
          value: "报销",
          label: "报销",
        },
        {
          value: "工程设计业务",
          label: "工程设计业务",
        },
        {
          value: "补贴",
          label: "补贴",
        },
        {
          value: "手续费利息",
          label: "手续费利息",
        },
        {
          value: "固定收入",
          label: "固定收入",
        },
        {
          value: "借还款",
          label: "借还款",
        },
        {
          value: "投资理财",
          label: "投资理财",
        },
        {
          value: "个人消费",
          label: "个人消费",
        },
      ],
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
    window.sessionStorage.setItem("inputV", JSON.stringify(this.inputValue));
  },
  mounted() {
    let that = this;
    if (that.kzId == null) {
      setTimeout(function () {
        alert("请先选择快照");
        that.$router.push("/dataClean");
      }, 500);
    } else {
      // that.addEles();
      that.getHead();
      that.getList();
      that.tableHeightCalc();
    }
  },
  methods: {
    changeTb(val) {
      if (val == 0) {
        if (
          this.inputValue.hours == "" ||
          this.inputValue.hours == this.lastInput1
        ) {
          this.disStatus = true;
        } else {
          this.disStatus = false;
        }
      }
      if (val == 1) {
        if (
          this.inputValue.money == "" ||
          this.inputValue.money == this.lastInput2
        ) {
          this.disStatus = true;
        } else {
          this.disStatus = false;
        }
      }
      if (val == 2) {
        if (
          this.inputValue.count == "" ||
          this.inputValue.count == this.lastInput3
        ) {
          this.disStatus = true;
        } else {
          this.disStatus = false;
        }
      }
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 640;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 560;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 400;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 240;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 200;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 750;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 920;
      }
      this.heightItem = this.heightItem.toString();
    },
    search() {
      this.currentPage = 1;
      this.getList();
    },
    change(val) {
      // if (val == "") {
      this.currentPage = 1;
      this.getList();
      // }
    },
    //清空输入
    clearInput() {
      this.inputName = "";
      this.inputCard = "";
      this.min_jiaoyimoney = "";
      this.max_jiaoyimoney = "";
      this.min_jiaoyibalance = "";
      this.max_jiaoyibalance = "";
      this.min_fundtime = "";
      this.max_fundtime = "";
      this.othercard = "";
      this.othername = "";
      this.wangdianming = "";
      this.ip = "";
      this.mac = "";
      this.beizhu = "";
      this.jiaoyitype = "";
      this.typefenlei = "";
      this.zhaiyaobeizhufenlei = "";
      this.currentPage = 1;
      this.value2 = "";
      this.getList();
    },
    updateTime() {
      if (this.value2 == "" || this.value2 == null) {
        this.min_fundtime = "";
        this.max_fundtime = "";
        this.getList();
      } else {
        this.min_fundtime = this.value2[0];
        this.max_fundtime = this.value2[1];
      }
    },
    close() {
      this.inputValue = {
        hours: 100,
        money: 0,
        count: 100,
      };
      this.lastInput1 = "100";
      this.lastInput2 = "0";
      this.lastInput3 = "100";
      window.sessionStorage.setItem("inputV", JSON.stringify(this.inputValue));
      this.flowDialog = false;
    },
    get() {
      this.lastInput1 = this.inputValue.hours;
      this.lastInput2 = this.inputValue.money;
      this.lastInput3 = this.inputValue.count;
      window.sessionStorage.setItem("inputV", JSON.stringify(this.inputValue));
    },
    exportTb() {
      let mycanvas = document.getElementsByTagName("canvas")[0];
      let image = mycanvas.toDataURL("image/jpg");
      let $a = document.createElement("a");
      $a.setAttribute("href", image);
      $a.setAttribute("download", "链路分析图下载.jpg");
      $a.click();
    },
    //分析
    fxLink(row) {
      this.getLink(row.id);
      window.sessionStorage.setItem("linkId", row.id);
    },
    //排序
    orderCh(label, orderType) {
      this.orderField = label;
      this.orderType = orderType;
      this.getList();
    },
    //排序规则
    topTableSort({ column, prop, order }) {
      if (order == "ascending") {
        this.orderType = "asc";
      } else if (order == "descending") {
        this.orderType = "desc";
      }
      this.$emit("orderChange", column.property, this.orderType);
    },
    //页码改变
    pageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    async getHead() {
      //获取表头数据
      let { data: res } = await this.$http.post(
        `/index/getTableColumnList`,
        {},
        {
          params: {
            title: "穿透分析-链路分析",
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.headerData = res.data;
      }
    },
    async getList() {
      //获取表格数据
      this.getLoading = true;
      let { data: res } = await this.$http.post(
        `/accountmoneyclean/getAccountMoneyCleanList`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          order_field: this.orderField,
          order_type: this.orderType,
          min_jiaoyimoney: this.min_jiaoyimoney,
          max_jiaoyimoney: this.max_jiaoyimoney,
          min_jiaoyibalance: this.min_jiaoyibalance,
          max_jiaoyibalance: this.max_jiaoyibalance,
          min_fundtime: this.min_fundtime,
          max_fundtime: this.max_fundtime,
          othercard: this.othercard,
          othername: this.othername,
          wangdianming: this.wangdianming,
          ip: this.ip,
          mac: this.mac,
          beizhu: this.beizhu,
          jiaoyitype: this.jiaoyitype,
          typefenlei: this.typefenlei,
          zhaiyaobeizhufenlei: this.zhaiyaobeizhufenlei,
        },
        {
          params: {
            kzname: this.kzId,
            pagenum: this.currentPage,
            pagesize: "20",
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log(res)
        this.tableData = res.data.data;
        this.total = res.data.count;
        this.getLoading = false;
      }
    },
    //请求图表数据
    async getLink(id) {
      let { data: res } = await this.$http.post(
        `/accountmoneyclean/chushiChuantou`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: this.kzId,
            id: id,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.flowDialog = true;
        // console.log(res);
        this.resData = res.data;
        this.addEles(res.data);
      }
    },
    //增加元素
    addEles(data) {
      // console.log("data", data);
      this.$nextTick(() => {
        this.$refs["ref_CJS"].addEles(data);
      });
    },
    //删除元素
    delEles() {
      this.$refs["ref_CJS"].delEles();
    },
  },
};
</script>

<style lang="less" scoped>
#linkAnalysis {
  width: 100%;
  height: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;

    .search {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
      .searchItem {
        margin: 0 0 6px 6px;
      }
      .changeStyle {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        height: 38px;
        overflow: hidden;
        /deep/.el-input__inner {
          border: none;
        }
      }
    }
    .content {
      width: 100%;
      margin: 10px 0;
    }
    .page {
      width: 100%;
      text-align: right;
    }
    .link {
      width: 1200px;
      height: 700px;
    }
    .bottomText {
      width: 40%;
      color: #e6a23c;
    }
  }
}
/deep/.el-dialog__body {
  padding: 10px 20px !important;
}
/* 修改底部确定、取消和注释的位置 */
.dialog-footer{
  display: flex;
  justify-content: space-between;
}
</style>