<!--复用表格-->
<template>
  <div id="reTable">
    <el-table
      :data="tableD"
      style="width: 100%"
      :height="heightI"
      class="table-fixed"
      :show-overflow-tooltip="true"
      @sort-change="topTableSort"
      v-loading="loading"
      element-loading-text="数据加载中"
      ref="multipleTable"
      v-if="heightI"
      :header-cell-style="{ 'text-align': 'left' }"
      border
    >
      <el-table-column
        :type="type"
        width="55"
        v-if="type != ''"
        align="center"
      ></el-table-column>
      <el-table-column
        v-for="item in headerData"
        :key="item.id"
        :prop="item.propName"
        :label="item.labelName"
        :sortable="item.order"
        :width="item.width"
        :show-overflow-tooltip="true"
        :align="item.align"
      >
      </el-table-column>
      <slot name="operate"></slot>
    </el-table>
  </div>
</template>

<script>
import Bus from "./bus";

export default {
  name: "reTable",
  components: { Bus },
  props: {
    tableData: Array,
    type: String,
    header: Array,
    operate: Array,
    operWidth: String,
    heightItem: String,
    getLoading: Boolean,
  },
  data() {
    return {
      typeName: this.type, //selection为复选 index为序号  为空为不显示
      heightI: this.heightItem, //表格高度
      headerData: this.header, //表头数据
      tableD: this.tableData, //表格数据
      orderType: "", //排序规则
      loading: this.getLoading,
    };
  },
  watch: {
    header: function (val) {
      this.headerData = val;
    },
    tableData: function (val) {
      this.tableD = val;
      this.$nextTick(() => {
        this.$refs.multipleTable.doLayout();
      });
    },
    heightItem: function (val) {
      this.heightI = val;
    },
    getLoading: function (val) {
      this.loading = val;
    },
  },
  methods: {
    topTableSort({ column, prop, order }) {
      if (order == "ascending") {
        this.orderType = "asc";
      } else if (order == "descending") {
        this.orderType = "desc";
      }
      this.$emit("orderChange", column.property, this.orderType);
    },
  },
};
</script>

<style lang="less" scoped>
#reTable {
  width: 100%;
  .operation {
    width: 30%;
    display: flex;
    justify-content: flex-start;
    .operationItem {
      margin: 0 2%;
    }
  }
}
/* /deep/.el-table__fixed-body-wrapper {
  top: 60px !important;
}
/deep/.el-table__body-wrapper .is-scrolling-left {
  height: 650px !important;
}
.table-fixed {
  /deep/.el-table__body-wrapper {
    height: 650px !important;
  }
  /deep/.el-table__fixed {
    height: 100% !important;
  }
}
/deep/.el-table__header tr,
.el-table__header th {
  height: 60px !important;
}
/deep/.el-table th.gutter {
  display: table-cell !important;
} */
</style>