<template>
  <div class="search">
    <el-input
      class="searchItem"
      placeholder="请输入交易户名"
      prefix-icon="el-icon-user-solid"
      v-model="inputName"
      @input="change"
      style="width: 160px"
      clearable
    >
    </el-input>
    <el-input
      class="searchItem"
      placeholder="请输入交易卡号"
      prefix-icon="el-icon-bank-card"
      v-model="inputCard"
      @input="change"
      style="width: 220px"
      clearable
    >
    </el-input>
    <el-select
      v-model="status"
      placeholder="请选择是否调单"
      class="searchItem"
      @input="change"
      clearable
    >
      <el-option
        v-for="item in isdiaodan"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <span class="searchItem changeStyle" style="width: 440px">
      <el-input
        placeholder="请输入进账金额下限(元)"
        prefix-icon="el-icon-sort-down"
        v-model="min_inmoney"
        @input="change"
        style="width: 210px"
        clearable
      >
      </el-input>
      <span>-</span>
      <el-input
        placeholder="请输入进账金额上限(元)"
        prefix-icon="el-icon-sort-up"
        v-model="max_inmoney"
        @input="change"
        style="width: 210px"
        clearable
      >
      </el-input>
    </span>
    <span class="searchItem changeStyle" style="width: 440px">
      <el-input
        placeholder="请输入出账金额下限(元)"
        prefix-icon="el-icon-sort-down"
        v-model="min_outmoney"
        style="width: 210px"
        @input="change"
        clearable
      >
      </el-input>
      <span>-</span>
      <el-input
        placeholder="请输入出账金额上限(元)"
        prefix-icon="el-icon-sort-up"
        v-model="max_outmoney"
        style="width: 210px"
        @input="change"
        clearable
      >
      </el-input>
    </span>
    <span class="searchItem changeStyle" style="width: 420px">
      <el-input
        placeholder="请输入总流水下限(元)"
        prefix-icon="el-icon-sort-down"
        v-model="min_allmoney"
        style="width: 200px"
        @input="change"
        clearable
      >
      </el-input>
      <span>-</span>
      <el-input
        placeholder="请输入总流水上限(元)"
        prefix-icon="el-icon-sort-up"
        v-model="max_allmoney"
        style="width: 200px"
        @input="change"
        clearable
      >
      </el-input>
    </span>
    <span class="searchItem changeStyle" style="width: 440px">
      <el-input
        placeholder="请输入交易金额下限(元)"
        prefix-icon="el-icon-sort-down"
        v-model="min_submoney"
        style="width: 210px"
        clearable
        @input="change"
      >
      </el-input>
      <span>-</span>
      <el-input
        placeholder="请输入交易金额上限(元)"
        prefix-icon="el-icon-sort-up"
        v-model="max_submoney"
        style="width: 210px"
        @input="change"
        clearable
      >
      </el-input>
    </span>
    <el-button type="primary" style="margin: 0 0 6px 1%" @click="search"
      >搜索</el-button
    >
    <el-button type="danger" style="margin: 0 0 6px 1%" @click="clearInput"
      >一键清空</el-button
    >
  </div>
</template>
<script>
export default {
  name: "search",
  data() {
    return {
      inputName: "", //户名
      inputCard: "", //卡号or对手户名
      isdiaodan: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
      status: "",
      min_allmoney: "",
      max_allmoney: "",
      min_inmoney: "",
      max_inmoney: "",
      min_outmoney: "",
      max_outmoney: "",
      min_submoney: "",
      max_submoney: "",
    };
  },
  methods: {
    change(val) {
      // if (val == "") {
        this.$emit(
          "search",
          this.inputName,
          this.inputCard,
          this.status,
          this.min_allmoney,
          this.max_allmoney,
          this.min_inmoney,
          this.max_inmoney,
          this.min_outmoney,
          this.max_outmoney,
          this.min_submoney,
          this.max_submoney,
        );
      // }
    },
    //清空输入
    clearInput() {
      this.inputName = "";
      this.inputCard = "";
      this.status = "";
      this.min_allmoney = "";
      this.max_allmoney = "";
      this.min_inmoney = "";
      this.max_inmoney = "";
      this.min_outmoney = "";
      this.max_outmoney = "";
      this.min_submoney = "";
      this.max_submoney = "";
      this.$emit(
        "search",
        this.inputName,
        this.inputCard,
        this.status,
        this.min_allmoney,
        this.max_allmoney,
        this.min_inmoney,
        this.max_inmoney,
        this.min_outmoney,
        this.max_outmoney,
        this.min_submoney,
        this.max_submoney,
      );
    },
    //搜索
    search() {
      this.$emit(
        "search",
        this.inputName,
        this.inputCard,
        this.status,
        this.min_allmoney,
        this.max_allmoney,
        this.min_inmoney,
        this.max_inmoney,
        this.min_outmoney,
        this.max_outmoney,
        this.min_submoney,
        this.max_submoney,
      );
    },
  },
};
</script>
<style lang="less" scoped>
#search {
  width: 100%;
}
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
</style>
