<!--开户信息-->
<template>
  <div id="accountInfor">
    <div class="buttonGrp">
      <el-button type="primary" @click="upDialogVisible = true"
        >点击上传</el-button
      >
      <el-button type="warning" @click="overCurrentYs">映射完成</el-button>
      <el-button type="success" @click="sumbitysData">开始导入</el-button>
    </div>
    <el-card shadow="hover" class="file" style="width: 100%">
      <div class="title">待导入文件</div>
      <el-table
        :data="tableData"
        style="width: 100%; cursor: default"
        height="280"
        highlight-current-row
        v-loading="loading"
        element-loading-text="正在进行智能映射"
      >
        <el-table-column
          prop="old_name"
          label="文件名称"
          width="800"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="createtime" label="上传时间" width="300">
        </el-table-column>
        <el-table-column
          prop="status"
          label="映射状态"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-circle-check"
              v-if="scope.row.status"
              style="color: #67c23a; font-size: 20px"
            ></i>
            <i
              class="el-icon-circle-close"
              v-else
              style="color: #f56c6c; font-size: 20px"
            ></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" min-width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              @click="handleCurrentChange(scope.row)"
              >映射</el-button
            >
            <el-button type="danger" plain @click="del(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="hover" class="map" v-if="true">
      <div class="title">
        映射关系调整和数据预览<span
          style="font-weight: 400; font-size: 12px; color: #e6a23c"
          >(必选字段包括：交易卡号/交易账号)</span
        >
      </div>
      <!-- 映射表格 -->
      <el-table
        :data="ysData"
        style="width: 100%; cursor: default"
        height="360"
        v-loading="ysloading"
        element-loading-text="拼命加载中"
        @cell-click="ysClick"
        ref="multipleTable"
        :cell-style="setCellStyle"
      >
        <el-table-column
          width="160"
          v-for="item in headerData"
          :key="item.id"
          :prop="item"
          :label="item"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 上传文件弹框 -->
    <el-dialog title="上传文件" :visible.sync="upDialogVisible" width="30%">
      <el-upload
        class="upload"
        action="string"
        accept=".xlsx,.xls"
        ref="upload"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="100"
        :on-exceed="handleExceed"
        :auto-upload="false"
        :file-list="files"
        :on-change="onchange"
      >
        <el-button type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upFile" :loading="uploadFlag">{{
          uploadBtnText
        }}</el-button>
      </span>
    </el-dialog>
    <!-- 映射弹框 -->
    <el-dialog
      :title="ysDiaDataTitle"
      :visible.sync="ysDialogVisible"
      width="50%"
    >
      <el-radio
        v-model="radio"
        :label="item"
        border
        v-for="item in ysDiaData"
        :key="item.id"
        style="margin: 1%; width: 162px"
        >{{ item }}</el-radio
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="ysDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ysDiaChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "accountInfor",
  components: {},
  data() {
    return {
      dbName: "", //案件名字段
      token: "",
      currentRow: [],
      currentRowID: "",
      loading: false,
      ysloading: false,
      uploadFlag: false,
      uploadBtnText: "导入",
      upDialogVisible: false, //上传菜单弹框
      ysDialogVisible: false, //映射菜单弹框
      tableData: [], // 表格数据
      headerData: [], // 映射表头数据
      files: [], //文件列表
      ysData: [], //映射数据
      radio: "", //映射单选
      mapping_result: [], //
      ysDiaData: [], //映射单选数据
      ysDiaDataTitle: "", //映射单选数据标题
      ysTitle: "",
      optionData: [], //所有选项
      fileYsList: [], //映射完成后的导入文件列表
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.token = window.sessionStorage.getItem("token");
  },
  mounted() {
    let that = this;
    if (that.dbName == null) {
      setTimeout(function () {
        alert("请先选择案件");
        that.$router.push("/caseList");
      }, 500);
    } else {
      that.getList();
    }
  },
  beforeDestroy() {
    window.sessionStorage.removeItem("option");
  },
  methods: {
    //push导入文件列表
    overCurrentYs() {
      let i = 0;
      for (let j = 0; j < this.ysDiaData.length; j++) {
        if (this.ysDiaData[j] == "交易卡号") {
          for (let k = 0; k < this.ysDiaData.length; k++) {
            if (this.ysDiaData[k] == "交易账号") {
              i++;
              this.$message.error(
                "请确认必选字段-" + this.ysDiaData[k] + "-已被选择"
              );
            }
          }
        } else if (this.ysDiaData[j] == "交易账号") {
          for (let k = 0; k < this.ysDiaData.length; k++) {
            if (this.ysDiaData[k] == "交易卡号") {
              i++;
              this.$message.error(
                "请确认必选字段-" + this.ysDiaData[k] + "-已被选择"
              );
            }
          }
          i++;
        }
      }
      if (i == 0) {
        if (this.currentRowID != "" && this.ysData[0] != undefined) {
          if (this.fileYsList.length == 0) {
            this.fileYsList.push({
              id: this.currentRowID,
              fileList: this.ysData[0],
            });
          }
          for (let i = 0; i < this.fileYsList.length; i++) {
            if (this.fileYsList[i].id == this.currentRowID) {
              this.fileYsList[i].fileList = this.ysData[0];
            } else {
              this.fileYsList.push({
                id: this.currentRowID,
                fileList: this.ysData[0],
              });
            }
          }
          for (let m = 0; m < this.tableData.length; m++) {
            if (this.tableData[m].id == this.currentRowID) {
              this.tableData[m].status = true;
            }
          }
        }
      } else {
        for (let m = 0; m < this.tableData.length; m++) {
          if (this.tableData[m].id == this.currentRowID) {
            this.tableData[m].status = false;
          }
        }
      }
    },
    //映射数据改变
    ysDiaChange() {
      this.ysDialogVisible = false;
      if (this.radio != "") {
        this.ysData[0][this.ysTitle] = this.radio;
      }
      this.delysAlready();
    },
    //导入数据提交
    async sumbitysData() {
      let { data: res } = await this.$http.post(
        "/initialization/importExcelData",
        this.fileYsList,
        {
          params: {
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 1) {
        return this.$message.error(res.msg);
      }
      if (res.code === 0) {
        this.getList();
        return this.$message.success(res.msg);
      }
    },
    //映射弹框
    ysClick(row, column, cell, event) {
      if (row.id == 0) {
        this.ysDialogVisible = true;
        this.ysTitle = column.label;
        this.ysDiaDataTitle = column.label + "-映射数据修改";
        this.radio = this.mapping_result[column.label];
      }
    },
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] == "请选择") {
          // console.log(i);
        }
      }
      if (rowIndex == 0) {
        for (let key in row) {
          if (row[key] == "请选择") {
            if (column.label == key) {
              return "color:#409EFF";
            }
          }
        }
      }
    },
    //映射关系改变
    async handleCurrentChange(val) {
      this.currentRow = val;
      this.currentRowID = val.id;
      this.ysloading = true;
      let { data: res } = await this.$http.post(
        "/initialization/getExcelData",
        {},
        {
          params: {
            db_name: this.dbName,
            id: this.currentRowID,
          },
        }
      );
      if (res.code === 1) {
        return this.$message.error(res.msg);
      }
      if (res.code === 0) {
        // console.log("res", res.data);
        this.ysloading = false;
        this.headerData = res.data.header;
        this.mapping_result = res.data.mapping_result;
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout();
        });

        //对选择字段排序
        let len = res.data.options.length;
        for (let i = 0; i < len - 1; i++) {
          for (let j = 0; j < len - 1 - i; j++) {
            if (res.data.options[j] > res.data.options[j + 1]) {
              let temp = res.data.options[j];
              res.data.options[j] = res.data.options[j + 1];
              res.data.options[j + 1] = temp;
            }
          }
        }
        window.sessionStorage.setItem(
          "option",
          JSON.stringify(res.data.options)
        );
        this.ysDiaData = res.data.options;
        //替换空格为”请选择“
        for (let key in res.data.content[0]) {
          if (key != "id") {
            if (res.data.content[0][key] == "") {
              res.data.content[0][key] = "请选择";
            }
          }
        }
        this.ysData = res.data.content;
        this.delysAlready();
      }
    },
    //把已经映射好的选项删除
    delysAlready() {
      this.ysDiaData = JSON.parse(window.sessionStorage.getItem("option"));
      for (let key in this.ysData[0]) {
        for (let i = 0; i < this.ysDiaData.length; i++) {
          if (this.ysDiaData[i] == this.ysData[0][key]) {
            this.ysDiaData.splice(i, 1);
          }
        }
      }
    },
    handleRemove(file, fileList) {
      // 移除文件时，要重新给fileList赋值
      const arr = [];
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].uid !== file.uid) {
          arr.push(this.files[i]);
        }
      }
      this.files = arr;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 100 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onchange(file, fileList) {
      //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
        this.$message.error("当前文件已经存在!");
        fileList.pop();
      } else {
        this.files.push(file);
      }
    },
    //上传文件
    async upFile() {
      this.uploadBtnText = "导入中";
      this.uploadFlag = true;
      const formData = new FormData();
      this.files.map((file) => {
        formData.append("files", file.raw);
      });
      let { data: res } = await this.$http.post(
        "/initialization/importAccount",
        formData,
        {
          params: {
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 0) {
        this.uploadBtnText = "导入";
        this.uploadFlag = false;
        this.upDialogVisible = false;
        this.$message.success(res.msg);
        this.getList();
      }
      if (res.code === 1) {
        this.uploadBtnText = "导入";
        this.uploadFlag = false;
        this.upDialogVisible = false;
        this.getList();
        return this.$message.error(res.msg);
      }
    },
    //请求已上传未导入文件
    async getList() {
      this.loading = true;
      let { data: res } = await this.$http.post(
        "/initialization/getUploadFiles",
        {},
        {
          params: { db_name: this.dbName, type: 1 },
        }
      );
      if (res.code === 0) {
        this.tableData = res.data;
        this.loading = false;
      }
      if (res.code === 1) {
        return this.$message.error(res.msg);
      }
    },
    //删除当前文件
    async del(row) {
      let confirmRes = await this.$confirm("是否删除当前文件？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除文件操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          "/initialization/deleteFile",
          {},
          {
            params: { db_name: this.dbName, file_id: row.id },
          }
        );
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.getList();
        }
        if (res.code === 1) {
          return this.$message.error(res.msg);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
#accountInfor {
  width: 100%;
  .buttonGrp {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;
  }
  .title {
    color: #909399;
    font-size: 14px;
    font-weight: 600;
    cursor: default;
  }
  .map {
    width: 100%;
    height: 420px;
    background-color: #fff;
    margin: 1% 0;

    /deep/ .el-table tbody tr:first-child {
      color: #e6a23c;
    }
  }
}
</style>