<!--数据快照-->
<template>
  <div id="dataClean">
    <div class="buttonGrp">
      <el-button type="primary" @click="dClean" v-if="newStatus"
        >新建快照</el-button
      >
      <el-tooltip
        class="item"
        effect="dark"
        content="数据正在清洗中，清洗完成后可进行该操作"
        placement="top"
        v-else
      >
        <el-button
          type="primary"
          style="background-color: #a0cfff; border: none"
          >新建快照</el-button
        >
      </el-tooltip>
      <span style="color: #e6a23c; margin: 0 2%; font-size: 14px"
        >提示：1.新数据导入后，需重新建立快照或模型计算；2.模型计算时间较长，请耐心等待；3.模型计算结束后，方可进入当前快照；4.所有分析基于当前选择的快照数据</span
      >
    </div>
    <div class="main">
      <el-card shadow="hover" class="file">
        <div class="title">快照列表</div>
        <el-table
          id="exportTab"
          :data="tableData"
          style="width: 100%; cursor: default"
          highlight-current-row
          v-loading="loading"
          :height="heightItem"
          v-if="heightItem"
          element-loading-text="拼命加载中"
          @cell-dblclick="editT"
          border
        >
          <el-table-column
            prop="title"
            label="快照名称"
            width="300"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-input
                placeholder="请输入快照名称"
                v-model="editTitle"
                clearable
                style="width: 70%"
                ref="title"
                v-if="scope.row.edit"
                @blur="changeData(scope.row)"
              >
              </el-input>
              <span v-else>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gmt_create" label="生成时间" width="280">
          </el-table-column>
          <el-table-column prop="desc" label="快照描述" width="400">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                plain
                disabled
                v-if="scope.row.id != currentKzId && scope.row.status == 0"
                >进入该快照</el-button
              ><el-button
                type="primary"
                plain
                @click="toKZ(scope.row)"
                v-if="scope.row.id != currentKzId && scope.row.status == 1"
                >进入该快照</el-button
              >
              <el-tooltip
                effect="dark"
                content="当前快照，无需重复进入"
                placement="top"
              >
                <el-button
                  type="primary"
                  plain
                  v-if="scope.row.id == currentKzId"
                  style="
                    background-color: #ecf5ff;
                    border-color: #d9ecff;
                    color: #8cc5ff;
                  "
                  >当前快照
                </el-button>
              </el-tooltip>

              <el-button
                type="warning"
                plain
                @click="computerModel(scope.row)"
                v-if="scope.row.status == 0"
                >模型计算</el-button
              >
              <el-button
                type="warning"
                plain
                v-if="scope.row.status == 1"
                disabled
                >已完成模型计算</el-button
              >
              <el-button
                type="success"
                @click="exportExcel(scope.row)"
                plain
                v-if="!scope.row.isImport"
                >导出数据</el-button
              >
              <el-button type="success" plain v-else :loading="true"
                >导出数据中</el-button
              >
              <el-button
                type="danger"
                plain
                v-if="scope.row.id != currentKzId"
                @click="del(scope.row)"
                >删除</el-button
              >
              <el-button
                type="danger"
                plain
                v-if="scope.row.id == currentKzId"
                @click="outKz(scope.row)"
                >退出</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="page">
        <rePage :currentPg="currentPage" :totalPage="total"> </rePage>
      </div>
    </div>
    <!-- 数据清洗弹框 -->
    <el-dialog
      title="条件设置"
      :visible.sync="cleanDialogVisible"
      @close="closeNew"
      width="30%"
    >
      <el-form
        class="diaContent"
        :model="fundsForm"
        :rules="rules"
        ref="fundsForm"
      >
        <div class="diaKzTitle">
          <span style="width: 16%">快照名称：</span>
          <el-form-item prop="kzname" style="width: 100%">
            <el-input
              placeholder="请输入快照名称"
              v-model="fundsForm.kzname"
              clearable
              style="width: 70%"
            ></el-input>
          </el-form-item>
        </div>
        <div style="width: 100%; margin: 1% 0">清洗条件：</div>
        <div style="display: flex; margin-bottom: 4%; margin-left: 76px">
          <el-checkbox
            v-model="pettyFunds"
            label="小额资金清洗"
            border
            style="width: 200px"
          ></el-checkbox>

          <el-form-item
            class="diaContentItem"
            prop="input"
            v-if="pettyFunds"
            style="width: 200px"
          >
            <el-input
              placeholder="请输入最小金额"
              v-model="fundsForm.input"
              :validate-event="false"
              clearable
            ></el-input>
          </el-form-item>
        </div>
        <el-checkbox
          v-model="removeDuplicates"
          label="双向数据去重"
          border
          style="margin-left: 76px; width: 200px"
        ></el-checkbox>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDia">取 消</el-button>
        <el-button type="primary" @click="kzCreate">确定</el-button>
      </span>
    </el-dialog>
    <!-- 模型计算弹框 -->
    <el-dialog
      title="模型计算"
      :visible.sync="modelDialogVisible"
      @close="closeComputer"
      width="66%"
      class="model"
    >
      <div class="step">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-card shadow="always">
              统计卡号
              <i
                v-if="rowData.step_er == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_er == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              统计户名
              <i
                v-if="rowData.step_san == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_san == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              统计账户
              <i
                v-if="rowData.step_si == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_si == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card> </el-col
          ><el-col :span="6">
            <el-card shadow="always">
              归属地统计接口
              <i
                v-if="rowData.step_wu == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_wu == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-card shadow="always">
              交易网点分布
              <i
                v-if="rowData.step_liu == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_liu == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              ip分析统计
              <i
                v-if="rowData.step_qi == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_qi == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              mac分析统计
              <i
                v-if="rowData.step_ba == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_ba == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card> </el-col
          ><el-col :span="6">
            <el-card shadow="always">
              归集账户发现
              <i
                v-if="rowData.step_jiu == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_jiu == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-card shadow="always">
              大额交易账户
              <i
                v-if="rowData.step_shi == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_shi == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              高频交易账户
              <i
                v-if="rowData.step_shiyi == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_shiyi == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              大额取现账户
              <i
                v-if="rowData.step_shier == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_shier == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card> </el-col
          ><el-col :span="6">
            <el-card shadow="always">
              活跃账户
              <i
                v-if="rowData.step_shisan == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_shisan == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i
            ></el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-card shadow="always">
              建议冻结账户
              <i
                v-if="rowData.step_shisi == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_shisi == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              大额获利对手未调单对手账户
              <i
                v-if="rowData.step_shiwu == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
              <i
                v-if="rowData.step_shiwu == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="always">
              现金匹配分析
              <i
                v-if="rowData.step_shiliu == 2"
                class="el-icon-check"
                style="color: #67c23a"
              ></i>
              <i
                v-if="rowData.step_shiliu == 1"
                class="el-icon-loading"
                style="color: #409eff"
              ></i>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div style="color: #e6a23c">
        模型计算时间较长，您可关闭弹框，后台将为您持续计算
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="modelDialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="modelDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import rePage from "@/components/page";

export default {
  name: "dataClean",
  inject: ["reload"],
  components: { rePage },
  data() {
    return {
      tableData: [],
      newStatus: false, //新建快照按钮是否可点击
      currentKzId: "", //当前快照的ID
      loading: true,
      cleanDialogVisible: false, //数据清洗弹框
      kzDialogVisible: false, //快照命名弹框
      heightItem: "",
      pettyFunds: false,
      removeDuplicates: false,
      modelDialogVisible: false, //模型计算弹框
      editTitle: "", //修改后的快照名称
      activeFirst: 0,
      activeSecond: -1,
      activeThird: -1,
      total: 0,
      currentPage: 1, // 当前的页数
      pageSize: 10, // 当前每页显示多少条数据
      activeF: -1,
      rowId: "",
      rowData: "",
      apiName: "/insertDict", //模型计算 递归接口
      fundsForm: {
        input: "",
        kzname: "",
      },
      rules: {
        // 表单验证规则
        input: [{ required: true, message: "请输入最小金额", trigger: "blur" }],
        kzname: [
          { required: true, message: "请输入快照名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.dbName = window.sessionStorage.getItem("db_name");
    this.currentKzId = window.sessionStorage.getItem("currentKzId");
  },
  mounted() {
    let that = this;
    if (that.dbName == null) {
      setTimeout(function () {
        alert("请先选择案件");
        that.$router.push("/caseList");
      }, 500);
    } else {
      that.getKzList();
      that.tableHeightCalc();
      that.getStatus();
    }
  },
  methods: {
    //退出当前快照
    outKz() {
      window.sessionStorage.removeItem("currentKzId");
      window.sessionStorage.removeItem("kzItem");
      this.reload()
    },
    //新增状态可否点击状态
    getStatus() {
      let that = this;
      let wsToken = window.sessionStorage.getItem("wsToken");
      let wsip = window.sessionStorage.getItem("wsip");
      var ws = new WebSocket(`${wsip}${wsToken}`);
      ws.onmessage = function (event) {
        let obj = JSON.parse(event.data);
        // console.log("objkz",obj)
        if (obj.type == 1) {
          that.$notify({
            message: obj.msg,
            position: "bottom-right",
            duration: obj.time,
            type: obj.status,
          });
        }
        if (obj.step == 1 && obj.type == 0) {
          that.getStep();
        }
      };
      ws.onclose = function (e) {
        console.log(
          "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
        );
        console.log(e);
      };
    },
    tableHeightCalc() {
      if (window.innerHeight <= 937 && window.innerHeight > 852) {
        this.heightItem = 680;
      } else if (window.innerHeight <= 852 && window.innerHeight > 750) {
        this.heightItem = 640;
      } else if (window.innerHeight <= 750 && window.innerHeight > 625) {
        this.heightItem = 540;
      } else if (window.innerHeight <= 625 && window.innerHeight > 535) {
        this.heightItem = 420;
      } else if (window.innerHeight <= 535) {
        this.heightItem = 320;
      } else if (window.innerHeight <= 1041 && window.innerHeight > 937) {
        this.heightItem = 820;
      } else if (window.innerHeight >= 1171) {
        this.heightItem = 940;
      }
      //映射列表
      this.heightItem = this.heightItem.toString();
    },
    closeDia() {
      this.cleanDialogVisible = false;
    },
    closeNew() {
      this.fundsForm.input = "";
      this.fundsForm.kzname = "";
    },
    //导出表格数据
    async exportExcel(row) {
      row.isImport = true;
      this.$message.info("数据导出中，请耐心等待");
      let { data: res } = await this.$http.post(
        `/accountmoneyclean/importKzData`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: row.id,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        // console.log("res", res.data);
        row.isImport = false;
        this.$message.success(res.msg);
        window.location = res.data;
      }
    },
    //获取模型计算步骤
    async getStep() {
      let { data: res } = await this.$http.post(
        `/initialization/getSnapshotInfo`,
        {},
        {
          params: {
            db_name: this.dbName,
            id: this.rowId,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.rowData = res.data;
      }
    },
    //模型计算
    computerModel(row) {
      this.rowId = row.id;
      this.getStep();
      // this.rowData = row;
      this.modelDialogVisible = true;
      if (row.step_er == 0) {
        this.stepEr(row.id);
      }
      if (row.step_san == 0) {
        this.stepSan(row.id);
      }
      if (row.step_si == 0) {
        this.stepSi(row.id);
      }
      if (row.step_wu == 0) {
        this.stepWu(row.id);
      }
      if (row.step_liu == 0) {
        this.stepLiu(row.id);
      }
      if (row.step_qi == 0) {
        this.stepQi(row.id);
      }
      if (row.step_ba == 0) {
        this.stepBa(row.id);
      }
      if (row.step_jiu == 0) {
        this.stepJiu(row.id);
      }
      if (row.step_shi == 0) {
        this.stepShi(row.id);
      }
      if (row.step_shiyi == 0) {
        this.stepShiyi(row.id);
      }
      if (row.step_shier == 0) {
        this.stepShiEr(row.id);
      }
      if (row.step_shisan == 0) {
        this.stepShiSan(row.id);
      }
      if (row.step_shisi == 0) {
        this.stepShiSi(row.id);
      }
      if (row.step_shiwu == 0) {
        this.stepShiWu(row.id);
      }
      if (row.step_shiliu == 0) {
        this.stepShiLiu(row.id);
      }
    },
    //模型计算步骤
    async stepEr(id) {
      let { data: res } = await this.$http.post(
        `/initialization/insertDetailc`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepSan(id) {
      let { data: res } = await this.$http.post(
        `/initialization/insertDetailh`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepSi(id) {
      let { data: res } = await this.$http.post(
        `/initialization/insertSummary`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepWu(id) {
      let { data: res } = await this.$http.post(
        `/initialization/tjguishuditongji`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepLiu(id) {
      let { data: res } = await this.$http.post(
        `/initialization/tjjiaoyiAreaSta`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepQi(id) {
      let { data: res } = await this.$http.post(
        `/initialization/iptj`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepBa(id) {
      let { data: res } = await this.$http.post(
        `/initialization/mactj`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepJiu(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modelfindguiji`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShi(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modelbigMoney`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShiyi(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modelfastTrade`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShiEr(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modeldaeAccount`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShiSan(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modelhuoyueAccount`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShiSi(id) {
      let { data: res } = await this.$http.post(
        `/initialization/tjdongjieAccount`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShiWu(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modelnochooseBigProfit`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    async stepShiLiu(id) {
      let { data: res } = await this.$http.post(
        `/initialization/modelcashMatchingFlow`,
        {},
        {
          params: {
            db_name: this.dbName,
            kzname: id,
          },
        }
      );
    },
    //关闭模型计算弹框时请求快照数据
    closeComputer() {
      this.getKzList();
    },
    //聚焦修改名称
    editT(row, column) {
      if (column.label == "快照名称") {
        this.editTitle = row.title;
        row.edit = true;
      }
    },
    //快照名称修改
    async changeData(row) {
      if (this.editTitle == "") {
        row.edit = false;
        return this.$message.error("输入为空，修改失败");
      } else if (this.editTitle == row.title) {
        row.edit = false;
        return this.$message.error("与原标题一致，未修改");
      } else {
        window.sessionStorage.setItem("kzItem", this.editTitle);
        let { data: res } = await this.$http.post(
          `/initialization/editSnapshotTitle`,
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
          this.getKzList();
          this.reload();
          row.edit = false;
          return this.$message.success(res.msg);
        }
      }
    },
    //进入快照
    toKZ(row) {
      this.currentKzId = row.id;
      window.sessionStorage.setItem("currentKzId", row.id);
      window.sessionStorage.setItem("kzItem", row.title);
      this.reload()
      // this.$router.push(`/screen`);
    },
    //数据清洗
    dClean() {
      this.cleanDialogVisible = true;
    },
    //快照生成
    kzCreate() {
      if (this.pettyFunds == true) {
        this.$refs.fundsForm.validate(async (valid) => {
          if (!valid) return this.$message.error("请确认输入是否规范");
          this.cleanDialogVisible = false;
          this.upload();
        });
      } else {
        this.cleanDialogVisible = false;
        this.upload();
      }
    },
    //上传数据
    async upload() {
      this.$message.info("数据正在清洗，请稍等");
      if (!this.fundsForm.input) {
        this.fundsForm.input = 0;
      }
      let { data: res } = await this.$http.post(
        `/initialization/addSnapshot`,
        {},
        {
          params: {
            db_name: this.dbName,
            title: this.fundsForm.kzname,
            is_petty_funds: this.pettyFunds,
            petty_funds: this.fundsForm.input,
            is_two_way_deduplication: this.removeDuplicates,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        this.getKzList();
        return this.$message.success(res.msg);
      }
    },
    //获取快照列表
    async getKzList() {
      let { data: res } = await this.$http.post(
        `/initialization/getSnapshotList`,
        {},
        {
          params: {
            db_name: this.dbName,
            pagesize: this.pageSize,
            pagenum: this.currentPage,
          },
        }
      );
      if (res.code === 1) return this.$message.error(res.msg);
      if (res.code === 0) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].edit = false;
        }
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].isImport = false;
        }
        // console.log(res.data);
        this.total = res.data.count;
        this.tableData = res.data.data;
        this.loading = false;
        //新增快照按钮显隐
        if (res.data.status == 1) {
          //status为1可新建快照
          this.newStatus = true;
        } else {
          this.newStatus = false;
        }
      }
    },
    //删除当前快照
    async del(row) {
      let confirmRes = await this.$confirm("是否删除当前快照？").catch(
        (error) => error
      );
      if (confirmRes !== "confirm") {
        return this.$message.info("取消删除快照操作");
      }
      if (confirmRes === "confirm") {
        let { data: res } = await this.$http.post(
          `/initialization/delSnapshot`,
          {},
          {
            params: {
              db_name: this.dbName,
              id: row.id,
            },
          }
        );
        if (res.code === 1) return this.$message.error(res.msg);
        if (res.code === 0) {
          this.getKzList();
          return this.$message.success(res.msg);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
#dataClean {
  width: 100%;
  .buttonGrp {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 12px;
  }
  .main {
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
    .title {
      color: #909399;
      font-size: 14px;
      font-weight: 600;
      cursor: default;
    }
    .page {
      width: 100%;
      text-align: right;
      margin-top: 12px;
    }
  }

  .diaContent {
    .diaContentItem {
      width: 100%;
      margin: 0;
      margin-left: 1%;
    }
    .el-checkbox {
      width: 40%;
    }
    .diaKzTitle {
      display: flex;
      line-height: 38px;
      margin-bottom: 4%;
      width: 100%;
      .el-form-item__content {
        width: 100%;
      }
    }
  }
  .model {
    width: 100%;
    .step {
      width: 100%;
      .el-row {
        margin-bottom: 20px;
      }
      .el-col {
        border-radius: 4px;
      }
    }
  }
}
</style>