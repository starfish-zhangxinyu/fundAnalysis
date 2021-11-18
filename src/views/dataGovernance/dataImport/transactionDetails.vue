<!--数据导入-->
<template>
  <div id="transactionDetails">
    <div class="buttonGrp">
      <el-button type="primary" @click="upDialogVisible = true"
        >点击上传</el-button
      >
      <el-button type="success" @click="sumbitysData">开始导入</el-button>
      <el-button type="danger" @click="deleteNum">批量删除</el-button>
      <span style="color: #e6a23c; margin: 0 2%; font-size: 14px"
        >操作流程提示：点击上传->映射完成->开始导入</span
      >
    </div>
    <div class="main">
      <el-card shadow="hover" class="file" style="width: 100%">
        <div class="title">文件列表</div>
        <el-table
          :data="tableData"
          style="width: 100%; cursor: default"
          :height="heightFile"
          v-if="heightFile"
          highlight-current-row
          v-loading="loading"
          @selection-change="handleSelectionChange"
          element-loading-text="正在进行智能映射"
          border
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="old_name"
            label="文件名称"
            width="400"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column prop="createtime" label="上传时间" width="220">
          </el-table-column>
          <el-table-column
            prop="type"
            label="文件类型"
            width="120"
            :filters="[
              { text: '交易明细', value: '交易明细' },
              { text: '开户信息', value: '开户信息' },
            ]"
            :filter-method="filterHandler"
          >
          </el-table-column>
          <el-table-column
            prop="isupload"
            label="上传状态"
            align="center"
            width="140"
            :show-overflow-tooltip="true"
            :filters="[
              { text: '上传成功', value: 2 },
              { text: '正在上传', value: 1 },
            ]"
            :filter-method="filterHandler"
          >
            <template slot-scope="scope">
              <!-- 上传成功 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="上传成功"
                placement="top"
                v-if="scope.row.isupload == 2"
                ><i
                  class="el-icon-circle-check"
                  style="color: #67c23a; font-size: 20px"
                ></i>
              </el-tooltip>

              <!-- 正在上传 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="正在上传"
                placement="top"
                v-if="scope.row.isupload == 1"
              >
                <i
                  class="el-icon-loading"
                  style="color: #409eff; font-size: 20px"
                ></i>
              </el-tooltip>
              <!-- 上传失败 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="上传失败"
                placement="top"
                v-if="scope.row.isupload == 0"
              >
                <i
                  class="el-icon-circle-close"
                  style="color: #f56c6c; font-size: 20px"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="isyingshe"
            label="映射状态"
            align="center"
            width="140"
            :filters="[
              { text: '映射成功', value: 2 },
              { text: '部分字段未映射', value: 1 },
              { text: '映射失败', value: 0 },
            ]"
            :filter-method="filterHandler"
          >
            <template slot-scope="scope">
              <!-- 完全映射 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="映射成功"
                v-if="scope.row.isyingshe == 2"
                placement="top"
                ><i
                  class="el-icon-circle-check"
                  style="color: #67c23a; font-size: 20px"
                ></i>
              </el-tooltip>

              <!-- 部分字段未映射 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="必选字段映射完成，部分字段未映射"
                v-if="scope.row.isyingshe == 1"
                placement="top"
              >
                <i
                  class="el-icon-warning-outline"
                  style="color: #409eff; font-size: 20px"
                ></i>
              </el-tooltip>

              <!-- 映射失败 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="映射失败"
                v-if="scope.row.isyingshe == 0"
                placement="top"
                ><i
                  class="el-icon-circle-close"
                  style="color: #f56c6c; font-size: 20px"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="isinsert"
            label="导入状态"
            align="center"
            width="140"
            :filters="[
              { text: '未导入', value: 0 },
              { text: '正在检测', value: 1 },
              { text: '正在导入', value: 2 },
              { text: '导入成功', value: 3 },
            ]"
            :filter-method="filterHandler"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="导入成功"
                v-if="scope.row.isinsert == 3"
                placement="top"
              >
                <i
                  class="el-icon-circle-check"
                  style="color: #67c23a; font-size: 20px"
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="正在检测"
                placement="top"
                v-if="scope.row.isinsert == 1"
              >
                <i
                  class="el-icon-warning-outline"
                  style="color: #e6a23c; font-size: 20px"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="正在导入"
                placement="top"
                v-if="scope.row.isinsert == 2"
              >
                <i
                  class="el-icon-loading"
                  style="color: #409eff; font-size: 20px"
                ></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="未导入"
                v-if="scope.row.isinsert == 0"
                placement="top"
                ><i
                  class="el-icon-circle-close"
                  style="color: #f56c6c; font-size: 20px"
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="info"
            label="错误信息"
            width="360"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                :disabled="scope.row.isinsert != 0 || scope.row.isupload == 0"
                @click="handleCurrentChange(scope.row)"
                >映射</el-button
              >
              <el-button
                type="danger"
                plain
                @click="del(scope.row)"
                :disabled="
                  scope.row.isupload == 1 &&
                  (scope.row.isinsert != 0 || scope.row.isinsert != 3)
                "
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card shadow="hover" class="map" v-if="true">
        <div class="title">
          <div>
            <span>映射关系调整和数据预览</span>
            <span style="font-weight: 400; font-size: 12px; color: #e6a23c"
              >(交易明细必选字段包括：交易卡号/交易账号、交易时间、交易金额/(收入与支出)、交易对手账卡号；开户信息必选字段包括：交易卡号/交易账号)</span
            >
          </div>
          <div>
            <el-button type="primary" @click="openTs" v-if="teshuBu"
              >特殊处理</el-button
            >
            <el-button type="warning" @click="overCurrentYs"
              >映射完成</el-button
            >
          </div>
        </div>

        <!-- 映射表格 -->
        <el-table
          :data="ysData"
          style="width: 100%; cursor: default"
          :height="heightItem"
          v-loading="ysloading"
          element-loading-text="数据加载中"
          @cell-click="ysClick"
          ref="multipleTable"
          v-if="heightItem"
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
        <div style="margin-bottom: 4%">只能上传xlsx/xls/csv/zip/rar/7z文件</div>
        <el-upload
          class="upload"
          action="string"
          accept=".xlsx,.xls,.csv,.zip,.rar,.7z"
          ref="upload"
          :on-remove="thandleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          multiple
          :limit="100"
          :on-exceed="thandleExceed"
          :auto-upload="false"
          :file-list="turnover_files"
          :on-change="tonchange"
        >
          <el-button type="primary">选择交易明细文件</el-button>
        </el-upload>
        <el-upload
          class="upload"
          action="string"
          accept=".xlsx,.xls,.csv,.zip,.rar,.7z"
          ref="upload"
          :on-remove="ahandleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          multiple
          :limit="100"
          :on-exceed="ahandleExceed"
          :auto-upload="false"
          :file-list="account_files"
          :on-change="aonchange"
        >
          <div style="margin: 16% 0">
            <el-button type="primary">选择开户信息文件</el-button>
          </div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeUp">取 消</el-button>
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
        @close="clear"
        @opened="changeRadioStyle"
      >
        <div style="margin: 1%">
          <el-input
            placeholder="请输入查找的关键字"
            prefix-icon="el-icon-search"
            v-model="ysKey"
            style="width: 220px"
            clearable
            @input="inChange"
          >
          </el-input>
          <el-button type="primary" style="margin: 0% 1%" @click="search"
            >搜索</el-button
          >
          <span style="color: #e6a23c"
            >红色字段为必选字段，蓝色字段为二选一字段，具体选择需求请看表格标题右侧黄色提示。</span
          >
        </div>

        <el-radio
          v-model="radio"
          :label="item"
          border
          v-for="item in ysDiaData"
          :key="item.id"
          style="margin: 1%; width: 162px"
          ref="radioStyle"
          >{{ item }}
        </el-radio>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ysDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ysDiaChange">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 特殊处理弹框 -->
      <el-dialog
        title="特殊处理"
        :visible.sync="teshudialogVisible"
        width="40%"
      >
        <el-button type="primary" plain @click="openJy" v-if="teshucard"
          >补充交易卡号</el-button
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="teshudialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="teshudialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <!-- 补充交易卡号弹框 -->
      <el-dialog
        title="交易卡号补充"
        :visible.sync="jydialogVisible"
        width="30%"
      >
        <el-input placeholder="请输入交易卡号" v-model="jycard" clearable>
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="jydialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCard">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "transactionDetails",
  components: {},
  data() {
    return {
      ysKey: "", //映射框里关键字选择
      dbName: "", //案件名字段
      token: "",
      teshuBu: false, //是否显示特殊处理按钮
      teshucard: false, //是否显示卡号按钮
      teshudialogVisible: false, //特殊处理弹框
      jydialogVisible: false, //补充交易卡号
      jycard: "", //补充的交易卡号
      currentRow: [],
      currentRowID: "",
      heightItem: "",
      heightFile: "",
      loading: false,
      ysloading: false,
      uploadFlag: false,
      uploadBtnText: "上传",
      upDialogVisible: false, //上传菜单弹框
      ysDialogVisible: false, //映射菜单弹框
      tableData: [], // 表格数据
      headerData: [], // 映射表头数据
      turnover_files: [], //交易明细列表
      account_files: [], //开户信息列表
      ysData: [], //映射数据
      radio: "", //映射单选
      mapping_result: [], //
      ysDiaData: [], //映射单选数据
      ysDiaDataTitle: "", //映射单选数据标题
      ysTitle: "",
      optionData: [], //所有选项
      fileYsList: [], //映射完成后的导入文件列表
      currentType: "", //文件类型
      ids: [],
      multipleSelection: [],
      multipleSelectionId: [], //账号id
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
      that.getWebSocket();
      that.tableHeightCalc();
    }
  },
  beforeDestroy() {
    window.sessionStorage.removeItem("option");
  },
  methods: {
    openTs() {
      this.teshudialogVisible = true;
    },
    openJy() {
      this.jydialogVisible = true;
      this.jycard = "";
    },
    async submitCard() {
      let { data: res } = await this.$http.post(
        "/initialization/addFundcard",
        {},
        {
          params: {
            db_name: this.dbName,
            fundcard: this.jycard,
            file_id: this.currentRowID,
          },
        }
      );
      if (res.code === 1) {
        return this.$message.error(res.msg);
      }
      if (res.code === 0) {
        this.ysList();
        this.teshudialogVisible = false;
        this.jydialogVisible = false;
        return this.$message.success(res.msg);
      }
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightFile = 330;
        this.heightItem = 304;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightFile = 290;
        this.heightItem = 270;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightFile = 236;
        this.heightItem = 220;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightFile = 176;
        this.heightItem = 160;
      } else if (window.innerHeight <= 535) {
        this.heightFile = 136;
        this.heightItem = 110;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightFile = 400;
        this.heightItem = 340;
      } else if (window.innerHeight >= 1171) {
        this.heightFile = 490;
        this.heightItem = 380;
      }
      //文件列表
      this.heightFile = this.heightFile.toString();
      //映射列表
      this.heightItem = this.heightItem.toString();
    },
    //批量删除
    async deleteNum() {
      if (this.ids.length == 0) {
        return this.$message.error("请选择文件");
      }
      let confirmRes = await this.$confirm("是否批量删除选中文件？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除文件操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          "/initialization/deleteManyFile",
          this.ids,
          {
            params: { db_name: this.dbName },
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
    //改变option样式
    changeRadioStyle() {
      let radioText = this.$refs.radioStyle;
      for (let i = 0; i < radioText.length; i++) {
        if (
          radioText[i].label == "交易卡号" ||
          radioText[i].label == "交易账号" ||
          radioText[i].label == "交易金额" ||
          radioText[i].label == "收入" ||
          radioText[i].label == "支出"
        ) {
          radioText[i].$el.style.color = "#409EFF";
        } else if (
          radioText[i].label == "交易时间" ||
          radioText[i].label == "交易对手账卡号"
        ) {
          radioText[i].$el.style.color = "#F56C6C";
        } else {
          radioText[i].$el.style.color = "#303133";
        }
      }
    },
    //消息推送
    getWebSocket() {
      let that = this;
      let wsToken = window.sessionStorage.getItem("wsToken");
      let wsip = window.sessionStorage.getItem("wsip");
      var ws = new WebSocket(`${wsip}${wsToken}`);
      ws.onmessage = function (event) {
        let obj = JSON.parse(event.data);
        // console.log("objdr",obj)
        if (obj.type == 1) {
          that.$notify({
            message: obj.msg,
            position: "bottom-right",
            duration: obj.time,
            type: obj.status,
          });
        }
        that.getList();
      };
      ws.onclose = function (e) {
        console.log(
          "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
        );
        console.log(e);
      };
    },
    //关闭上传弹框并清空内容
    closeUp() {
      this.upDialogVisible = false;
      this.turnover_files = [];
      this.account_files = [];
      this.loading = false;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    //映射框搜索
    search() {
      if (this.ysKey == "") {
        this.ysDiaData = this.optionData;
      }
      let arr = [];
      for (let i = 0; i < this.ysDiaData.length; i++) {
        if (this.ysDiaData[i].indexOf(this.ysKey) >= 0) {
          arr.push(this.ysDiaData[i]);
        }
      }
      this.ysDiaData = arr;
    },
    inChange() {
      if (this.ysKey == "") {
        this.ysDiaData = this.optionData;
        this.ysKey = "";
      }
    },
    //清空option设置
    clear() {
      this.ysDiaData = this.optionData;
      this.ysKey = "";
    },
    //多选
    handleSelectionChange(val) {
      this.ids = [];
      this.multipleSelection = val;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.ids.push(this.multipleSelection[i].id); //已选的id
      }
      // console.log("this.ids",this.ids)
    },
    //判断后缀是否为限制后缀
    beforeUpload(file) {
      // console.log(file);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const extension3 = testmsg === "csv";
      const extension4 = testmsg === "zip";
      const extension5 = testmsg === "rar";
      const extension6 = testmsg === "7z";
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6
      ) {
        this.$message({
          message: "上传文件只能是 xls、xlsx、csv、zip、rar、7z格式!",
          type: "warning",
        });
      } else {
        this.upFile();
      }
    },
    //push导入文件列表
    overCurrentYs() {
      if (this.currentRowID != "" && this.ysData[0] != undefined) {
        if (this.fileYsList.length == 0) {
          this.fileYsList.push(this.currentRowID);
          this.ysExport();
        } else {
          for (let i = 0; i < this.fileYsList.length; i++) {
            if (this.fileYsList.indexOf(this.currentRowID) == -1) {
              this.fileYsList.push(this.currentRowID);
            }
          }
          this.ysExport(); //此处数据未修改，仍会映射
        }
        // console.log("this.fileYsList", this.fileYsList);
      }
    },
    //映射完成上传
    async ysExport() {
      let { data: res } = await this.$http.post(
        "/initialization/excelMappingComplete",
        {},
        {
          params: {
            db_name: this.dbName,
            file_id: this.currentRowID,
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
    //映射数据改变
    async ysDiaChange() {
      if (this.radio != "") {
        this.ysData[0][this.ysTitle] = this.radio;
        let { data: res } = await this.$http.post(
          "/initialization/chooseExcelMapping",
          {},
          {
            params: {
              db_name: this.dbName,
              file_id: this.currentRowID,
              excel_field: this.ysTitle,
              mapping_field: this.radio,
            },
          }
        );
        if (res.code === 1) {
          return this.$message.error(res.msg);
        }
        if (res.code === 0) {
          this.delysAlready();
          this.ysDialogVisible = false;
          return this.$message.success(res.msg);
        }
      }
      this.delysAlready();
    },
    //导入数据提交
    async sumbitysData() {
      if (this.ids.length == 0) {
        return this.$message.error("请选择文件");
      }
      let { data: res } = await this.$http.post(
        "/initialization/importExcelData",
        this.ids,
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
        this.$message({
          showClose: true,
          message: res.msg,
          type: "success",
          duration: 6000,
        });
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
    //改变”请选择“的样式
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] == "请选择") {
          console.log(i);
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
    handleCurrentChange(val) {
      this.currentType = val.type;
      this.currentRow = val;
      this.currentRowID = val.id;
      this.teshuBu = val.data_error_type == 0 ? false : true;
      this.teshucard = val.data_error_data.type1 == 0 ? false : true;
      this.ysloading = true;
      this.ysList();
    },
    async ysList() {
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
        this.ysDiaData = res.data.options;
        this.ysDiaData[this.ysDiaData.length] = "请选择";

        window.sessionStorage.setItem(
          "option",
          JSON.stringify(res.data.options)
        );
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
          if (this.ysData[0][key] != "请选择") {
            if (this.ysDiaData[i] == this.ysData[0][key]) {
              this.ysDiaData.splice(i, 1);
            }
          }
        }
      }
      this.optionData = this.ysDiaData;
    },
    thandleRemove(file, fileList) {
      // 移除文件时，要重新给fileList赋值
      const arr = [];
      for (let i = 0; i < this.turnover_files.length; i++) {
        if (this.turnover_files[i].uid !== file.uid) {
          arr.push(this.turnover_files[i]);
        }
      }
      this.turnover_files = arr;
    },
    ahandleRemove(file, fileList) {
      // 移除文件时，要重新给fileList赋值
      const arr = [];
      for (let i = 0; i < this.account_files.length; i++) {
        if (this.account_files[i].uid !== file.uid) {
          arr.push(this.account_files[i]);
        }
      }
      this.account_files = arr;
    },
    thandleExceed(turnover_files, fileList) {
      this.$message.warning(
        `当前限制选择 100 个文件，本次选择了 ${
          turnover_files.length
        } 个文件，共选择了 ${turnover_files.length + fileList.length} 个文件`
      );
    },
    ahandleExceed(account_files, fileList) {
      this.$message.warning(
        `当前限制选择 100 个文件，本次选择了 ${
          account_files.length
        } 个文件，共选择了 ${account_files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    tonchange(file, fileList) {
      //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
        this.$message.error("当前文件已经存在!");
        fileList.pop();
      } else {
        this.turnover_files.push(file);
      }
    },
    aonchange(file, fileList) {
      //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
      let existFile = fileList
        .slice(0, fileList.length - 1)
        .find((f) => f.name === file.name);
      if (existFile) {
        this.$message.error("当前文件已经存在!");
        fileList.pop();
      } else {
        this.account_files.push(file);
      }
    },
    //上传文件
    async upFile() {
      if (this.turnover_files.length == 0 && this.account_files.length == 0) {
        return;
      }
      this.uploadBtnText = "上传中";
      this.uploadFlag = true;
      const formData = new FormData();
      this.turnover_files.map((tfile) => {
        formData.append("turnover_files", tfile.raw);
      });
      this.account_files.map((afile) => {
        formData.append("account_files", afile.raw);
      });
      let { data: res } = await this.$http.post(
        "/initialization/importAccountTurnover",
        formData,
        {
          params: {
            db_name: this.dbName,
          },
        }
      );
      if (res.code === 0) {
        this.uploadBtnText = "上传";
        this.uploadFlag = false;
        this.upDialogVisible = false;
        this.turnover_files = [];
        this.account_files = [];
        this.$message.success(res.msg);
        this.getList();
      }
      if (res.code === 1) {
        this.uploadBtnText = "上传";
        this.uploadFlag = false;
        this.upDialogVisible = false;
        this.getList();
        return this.$message.error(res.msg);
      }
    },
    //请求上传/导入文件
    async getList() {
      this.loading = true;
      let { data: res } = await this.$http.post(
        "/initialization/getUploadFiles",
        {},
        {
          params: { db_name: this.dbName, type: 0 },
        }
      );
      if (res.code === 0) {
        this.tableData = res.data;
        // console.log("this.tableData", this.tableData);
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
#transactionDetails {
  width: 100%;
  .buttonGrp {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 6px;
  }
  .main {
    width: 100%;
    height: calc(100vh - 140px);
    overflow: auto;

    .title {
      color: #909399;
      font-size: 14px;
      font-weight: 600;
      cursor: default;
      display: flex;
      justify-content: space-between;
    }
    .map {
      width: 100%;
      background-color: #fff;
      margin: 6px 0;
      /deep/ .el-table tbody tr:first-child {
        color: #e6a23c;
      }
    }
  }
}
</style>