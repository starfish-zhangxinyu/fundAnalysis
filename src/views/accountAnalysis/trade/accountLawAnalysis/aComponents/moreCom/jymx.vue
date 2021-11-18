<!--交易明细分析-->
<template>
  <div id="jymx">
    <div class="main">
      <div class="search">
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
    </div>
  </div>
</template>

<script>
import reTable from "@/components/table";
import rePage from "@/components/page";

export default {
  name: "jymx",
  components: { reTable, rePage },
  props: {
    fCard: String,
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      currentKzId: "", //当前快照的ID
      type: "",
      heightItem: "",
      loading: false,
      currentPage: 1,
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      inputName: "", //户名
      inputCard: "", //卡号
      min_jiaoyimoney: "",
      max_jiaoyimoney: "",
      othercard: "",
      typefenlei: "",
      zhaiyaobeizhufenlei: "",
      order_field: "",
      order_type: "",
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
  watch: {
    fCard: function (val) {
      this.inputCard = val;
      this.getList();
    },
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.currentKzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    this.getHead();
    this.getList();
    this.tableHeightCalc();
  },
  methods: {
    search() {
      this.currentPage = 1;
      this.getList();
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 630;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 550;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 400;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 280;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 200;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 730;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 860;
      }
      this.heightItem = this.heightItem.toString();
    },
    change(val) {
      if (val == "") {
        this.currentPage = 1;
        this.getList();
      }
    },
    //清空输入
    clearInput() {
      this.min_jiaoyimoney = "";
      this.max_jiaoyimoney = "";
      this.othercard = "";
      this.typefenlei = "";
      this.zhaiyaobeizhufenlei = "";
      this.currentPage = 1;
      this.getList();
    },
    toJyds(row) {
      this.$router.push({
        path: "/jydsHome",
        query: {
          name: row.name,
          fundcard: row.fundcard,
          othercard: row.othercard,
        },
      });
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
      // console.log("this.inputCard",this.inputCard)
      this.getLoading = true;
      if (this.inputCard != "") {
        let { data: res } = await this.$http.post(
          `/accountmoneyclean/getPersonalTransactionDetails`,
          {
            order_field: this.orderField,
            order_type: this.orderType,
            min_jiaoyimoney: this.min_jiaoyimoney,
            max_jiaoyimoney: this.max_jiaoyimoney,
            othercard: this.othercard,
            typefenlei: this.typefenlei,
            zhaiyaobeizhufenlei: this.zhaiyaobeizhufenlei,
          },
          {
            params: {
              kzname: this.currentKzId,
              pagenum: this.currentPage,
              pagesize: "20",
              db_name: this.dbName,
              fundcard: this.inputCard,
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
      }
    },
  },
};
</script>

<style lang="less" scoped>
#jymx {
  width: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 200px);
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
    .page {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 1% 0;
    }
    .chart {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>