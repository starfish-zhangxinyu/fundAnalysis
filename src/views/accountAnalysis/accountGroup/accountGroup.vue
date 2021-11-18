<!--账户分组-->
<template>
  <div id="accountGroup">
    <div class="main">
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
        <span class="searchItem changeStyle" style="width: 452px">
          <el-input
            placeholder="请输入进账金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_inmoney"
            @input="change"
            style="width: 216px"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入进账金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_inmoney"
            @input="change"
            style="width: 216px"
            clearable
          >
          </el-input>
        </span>
        <span class="searchItem changeStyle" style="width: 452px">
          <el-input
            placeholder="请输入出账金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_outmoney"
            style="width: 216px"
            @input="change"
            clearable
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入出账金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_outmoney"
            style="width: 216px"
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
        <span class="searchItem changeStyle" style="width: 452px">
          <el-input
            placeholder="请输入交易金额下限(元)"
            prefix-icon="el-icon-sort-down"
            v-model="min_submoney"
            style="width: 216px"
            clearable
            @input="change"
          >
          </el-input>
          <span>-</span>
          <el-input
            placeholder="请输入交易金额上限(元)"
            prefix-icon="el-icon-sort-up"
            v-model="max_submoney"
            style="width: 216px"
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
        <el-button
          type="success"
          style="margin: 0 0 6px 1%"
          @click="addNewGroup"
          >添加到新增分组</el-button
        >
        <el-button
          type="warning"
          style="margin: 0 0 6px 1%"
          @click="addReadyGroup"
          >添加到现有分组</el-button
        >
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width: 60%; margin-right: 20px"
          :height="heightItem"
          v-if="heightItem"
          v-loading="loading"
          element-loading-text="数据加载中"
          class="table-fixed"
          :show-overflow-tooltip="true"
          @sort-change="topTableSort"
          @selection-change="handleSelectionChange"
          ref="multipleTable"
          :header-cell-style="{ 'text-align': 'left' }"
          border
        >
          <el-table-column type="selection" width="55"></el-table-column>
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
        <el-tooltip
          class="item"
          effect="dark"
          content="显隐分组列表"
          placement="bottom"
        >
          <el-button
            type="primary"
            icon="el-icon-arrow-right"
            class="data"
            circle
            @click="changeDis"
            style="padding: 0"
            v-if="changeGroDis"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            class="data"
            circle
            @click="changeDis"
            style="padding: 0"
            v-else
          ></el-button>
        </el-tooltip>
        <div
          class="groupList"
          ref="groupDis"
          v-loading="loadingGroup"
          element-loading-text="数据加载中"
        >
          <div class="title">
            <span>分组列表</span>
            <span style="font-size: 18px">
              <i
                class="el-icon-edit"
                style="width: 40%"
                @click="changeGroups"
              ></i>
            </span>
          </div>
          <el-collapse v-model="activeNames" v-if="!groupStatus">
            <el-collapse-item
              :title="item.groupname"
              :name="item.id"
              v-for="item in groupList"
              :key="item.id"
            >
              <div
                class="groupListItem"
                v-for="item in item.users"
                :key="item.id"
              >
                {{ item.name + item.fundcard }}
                <i
                  class="el-icon-circle-close"
                  @click="delCurrentUser(item)"
                ></i>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-model="activeNames" v-else>
            <div
              class="changeStatus"
              :name="item.id"
              v-for="item in groupList"
              :key="item.id"
              @dblclick="editGroupName(item)"
            >
              <span v-if="!item.editGroup">{{ item.groupname }}</span>
              <el-input
                placeholder="请输入分组名称"
                v-model="editTitle"
                clearable
                style="width: 60%"
                ref="groupName"
                v-else
                @blur="changeData(item)"
              >
              </el-input>
              <i
                class="el-icon-circle-close"
                style="color: red; width: 10%"
                @click="delCurrentGroup(item)"
              ></i>
            </div>
          </el-collapse>
        </div>
      </div>
      <div class="page">
        <rePage
          :currentPg="currentPage"
          :totalPage="total"
          @pageChange="pageChange"
        >
        </rePage>
      </div>

      <!--新增分组-->
      <el-dialog title="新增分组" :visible.sync="addNewDialog" width="500px">
        <el-form
          :model="groupForm"
          :rules="groupFormRules"
          ref="groupFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分组名称" prop="groupName">
            <el-input
              v-model="groupForm.groupName"
              clearable
              style="width: 85%"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addNewDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitNewGroup">确 定</el-button>
        </span>
      </el-dialog>

      <!--现有分组-->
      <el-dialog title="现有分组" :visible.sync="addReadyDialog" width="500px">
        <div>
          <el-radio
            v-model="radio"
            :label="item.groupname"
            border
            v-for="item in groupList"
            :key="item.id"
            style="margin: 1%; width: 162px"
            >{{ item.groupname }}</el-radio
          >
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addReadyDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitReadyGroup">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import rePage from "@/components/page";

export default {
  name: "accountGroup",
  components: { rePage },
  data() {
    return {
      inputName: "", //户名
      inputCard: "", //卡号
      seIn: "请输入交易卡号",
      dbName: "", //案件名字段
      currentPage: 1,
      radio: "", //映射单选
      heightItem: "",
      loading: true,
      loadingGroup: true,
      total: 0,
      orderField: "", //排序字段
      orderType: "", //排序规则
      // 表格数据
      tableData: [],
      // 表头数据
      headerData: [],
      kzId: "", //快照ID
      activeNames: [0],
      groupList: [], //分组列表
      addNewDialog: false, //新增分组对话框
      addReadyDialog: false, //现有分组对话框
      groupForm: {
        groupName: "",
      },
      groupFormRules: {
        groupName: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
        ],
      },
      multipleSelection: [],
      ids: [],
      groupStatus: false,
      groupStatusIndex: 0,
      editTitle: "", //修改后的分组名称
      changeGroDis: true, //控制分组列表显隐
      status: "",
      min_allmoney: "",
      max_allmoney: "",
      min_inmoney: "",
      max_inmoney: "",
      min_outmoney: "",
      max_outmoney: "",
      min_submoney: "",
      max_submoney: "",
      isdiaodan: [
        { value: "1", label: "是" },
        { value: "0", label: "否" },
      ],
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.kzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    let that = this;
    if (that.kzId == null) {
      setTimeout(function () {
        alert("请先选择快照");
        that.$router.push("/dataClean");
      }, 500);
    } else {
      that.getHead();
      that.getList();
      that.getGroupList();
      that.tableHeightCalc();
    }
  },
  methods: {
    search() {
      this.currentPage = 1;
      this.getList();
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 680;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 560;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 460;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 290;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 200;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 780;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 920;
      }
      this.heightItem = this.heightItem.toString();
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
      this.status = "";
      this.max_allmoney = "";
      this.min_allmoney = "";
      this.min_inmoney = "";
      this.max_inmoney = "";
      this.min_outmoney = "";
      this.max_outmoney = "";
      this.min_submoney = "";
      this.max_submoney = "";
      this.currentPage = 1;
      this.getList();
    },
    //控制右侧分组列表显隐
    changeDis() {
      if (this.changeGroDis) {
        this.$refs.groupDis.style.display = "none";
        this.changeGroDis = false;
      } else {
        this.$refs.groupDis.style.display = "block";
        this.changeGroDis = true;
      }
    },
    editGroupName(row) {
      this.editTitle = row.groupname;
      row.editGroup = true;
    },
    //分组名称修改
    async changeData(row) {
      if (this.editTitle == "") {
        row.editGroup = false;
        return this.$message.error("输入为空，修改失败");
      } else if (this.editTitle == row.groupname) {
        row.editGroup = false;
        return this.$message.error("与原标题一致，修改失败");
      } else {
        let { data: res } = await this.$http.post(
          `/group/editGroupName`,
          {},
          {
            params: {
              db_name: this.dbName,
              id: row.id,
              title: this.editTitle,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.getGroupList();
          row.editGroup = false;
          return this.$message.success(res.msg);
        }
      }
    },
    //改变分组名称状态切换
    changeGroups() {
      if (this.groupStatusIndex % 2 == 0) {
        this.groupStatus = true;
      } else {
        this.groupStatus = false;
      }
      this.groupStatusIndex++;
    },
    addNewGroup() {
      if (this.multipleSelection.length != 0) {
        this.addNewDialog = true;
      } else {
        this.$message.error("请选择账号");
      }
    },
    addReadyGroup() {
      if (this.multipleSelection.length != 0) {
        this.addReadyDialog = true;
      } else {
        this.$message.error("请选择账号");
      }
    },
    //添加到新增分组
    submitNewGroup() {
      this.$refs.groupFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请确认输入是否规范");
        let { data: res } = await this.$http.post(
          `/group/addPeopleToNewGroup`,
          this.ids,
          {
            params: {
              db_name: this.dbName,
              group_name: this.groupForm.groupName,
              kzname: this.kzId,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.groupStatus = false;
          this.groupStatusIndex++;
          this.addNewDialog = false;
          this.getGroupList();
          return this.$message.success(res.msg);
        }
      });
    },
    //添加到现有分组
    submitReadyGroup() {
      let id = "";
      for (let j = 0; j < this.groupList.length; j++) {
        if (this.groupList[j].groupname == this.radio) {
          id = this.groupList[j].id;
        }
      }
      if (this.radio) {
        this.readyGroup(id);
      } else {
        this.$message.error("请选择分组");
      }
    },
    //添加到现有分组
    async readyGroup(id) {
      let { data: res } = await this.$http.post(
        `/group/addPeopleToGroup`,
        this.ids,
        {
          params: {
            db_name: this.dbName,
            group_id: id,
            kzname: this.kzId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.groupStatus = false;
        this.groupStatusIndex++;
        this.addReadyDialog = false;
        this.getGroupList();
        return this.$message.success(res.msg);
      }
    },
    //删除分组
    async delCurrentGroup(val) {
      let confirmRes = await this.$confirm("是否删除当前分组？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除分组操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          `/group/delGroup`,
          {},
          {
            params: {
              db_name: this.dbName,
              id: val.id,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.getGroupList();
          return this.$message.success(res.msg);
        }
      }
    },
    //删除分组里某一行数据
    async delCurrentUser(val) {
      let confirmRes = await this.$confirm("是否删除当前账户？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除账户操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          `/group/delPeopleFromGroup`,
          {},
          {
            params: {
              db_name: this.dbName,
              id: val.id,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.getGroupList();
          return this.$message.success(res.msg);
        }
      }
    },
    //排序
    topTableSort({ column, prop, order }) {
      if (order == "ascending") {
        this.orderType = "asc";
      } else if (order == "descending") {
        this.orderType = "desc";
      }
      this.orderField = prop;
      this.getList();
    },
    //多选
    handleSelectionChange(val) {
      this.ids = [];
      this.multipleSelection = val;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.ids.push(this.multipleSelection[i].id);
      }
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
            title: "账号分析-账户统计-账户统计表",
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
      this.loading = true;
      let { data: res } = await this.$http.post(
        `/accountsummary/getAccountSummaryList`,
        {
          name: this.inputName,
          fundcard: this.inputCard,
          status: this.status,
          min_allmoney: this.min_allmoney,
          max_allmoney: this.max_allmoney,
          min_inmoney: this.min_inmoney,
          max_inmoney: this.max_inmoney,
          min_outmoney: this.min_outmoney,
          max_outmoney: this.max_outmoney,
          min_submoney: this.min_submoney,
          max_submoney: this.max_submoney,
          kzname: this.kzId,
          order_field: this.orderField,
          order_type: this.orderType,
        },
        {
          params: {
            pagenum: this.currentPage,
            pagesize: "20",
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.tableData = res.data.data;
        this.total = res.data.count;
        this.loading = false;
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });
      }
    },
    async getGroupList() {
      //获取分组数据
      let { data: res } = await this.$http.post(
        `/group/getGroupList`,
        {
          kzname: this.kzId,
        },
        {
          params: {
            db_name: this.dbName,
            type: 1,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res.data", res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].editGroup = false;
        }
        this.groupList = res.data;
        this.loadingGroup = false;
      }
    },
    del() {},
  },
};
</script>

<style lang="less" scoped>
#accountGroup {
  width: 100%;
  .main {
    width: 100%;
    height: calc(100vh - 100px);
    overflow: auto;

    .search {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .searchItem {
        margin: 0 0 6px 6px;
      }
    }
    .content {
      width: 100%;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      .groupList {
        width: 20%;
        background-color: #fff;
        padding: 0 1%;
        overflow-y: auto;
        .title {
          color: #909399;
          font-size: 14px;
          font-weight: 600;
          cursor: default;
          padding: 20px 0 19px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          i:hover {
            color: #409eff;
          }
        }

        .groupListItem {
          padding: 2%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .groupListItem:hover {
          background-color: #f5f7fa;
          color: #409eff;
        }
        .groupListItem:hover i {
          color: #f56c6c;
        }
        .changeStatus {
          height: 48px;
          line-height: 48px;
          background-color: #fff;
          color: #303133;
          cursor: pointer;
          border-bottom: 1px solid #ebeef5;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .page {
      width: 100%;
      text-align: right;
    }
    .data {
      width: 35px;
      height: 35px;
      position: absolute;
      top: 12%;
      right: 3%;
    }
  }
}
</style>