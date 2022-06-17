<template>
  <div class="main">
    <el-row>
      <el-upload
        class="upload-demo"
        :action="uploadAction"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="afterSuccess"
        ref="upload"
        :limit="1"
        :on-exceed="handleExceed">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">上传的文件限制为100MB</div>
      </el-upload>
    </el-row>
    <el-button
      class="filter-item"
      style="margin-left: 10px;"
      type="primary"
      icon="el-icon-edit"
      @click="handleCreate"
    >添加</el-button>
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="发送阅后即焚🔥">
      <el-form
        :model="sendFireForm"
        ref="dataForm"
        label-position="left"
        label-width="50%"
        style="width: 100%; text-align: center;"
      >
        <el-form-item label="给你的文件取个名字吧！📤" prop="showName">
          <el-input type="textarea" :rows="1" v-model="sendFireForm.showName"></el-input>
        </el-form-item>
        <el-input type="hidden" v-model="sendFireForm.path"></el-input>
        <el-input type="hidden" v-model="sendFireForm.fileName"></el-input>
        <el-form-item label="请选择过期时间">
<!--          <el-radio-group v-model="sendFireForm.expireLevel">-->
<!--            <el-radio v-for="(radio, index) in subjectList" :key="index" :label="radio">{{radio}}</el-radio>-->
<!--          </el-radio-group>-->
          <el-select v-model="sendFireForm.expireLevel" placeholder="请选择">
            <el-option
              v-for="(data, index) in expireLevelList"
              :key="index"
              :label="data"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="正确答案" prop="correctAnswer">
          <el-input v-model="sendFireForm.correctAnswer" />
        </el-form-item>
        <el-form-item label="其他答案1" prop="otherAnswer1">
          <el-input v-model="sendFireForm.otherAnswer1" />
        </el-form-item>
        <el-form-item label="其他答案2" prop="otherAnswer2">
          <el-input v-model="sendFireForm.otherAnswer2" />
        </el-form-item>
        <el-form-item label="其他答案3" prop="otherAnswer3">
          <el-input v-model="sendFireForm.otherAnswer3" />
        </el-form-item>
        <el-form-item label="所属年级">
          <el-select
            v-model="sendFireForm.userGrades"
            class="filter-item"
            placeholder="选择年级"
            multiple
          >
            <el-option
              v-for="item in tabMapOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click=" createData() ">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {baseURL} from "../utils/config";

export default {
  name: "Main",
  data () {
    return {
      uploadAction: baseURL + '/file/uploadFile',
      expireLevelList: ["黄金", "白银", "钻石"],
      input: "",
      tabMapOptions: [
        { label: "幼儿园", key: "kinderGarten" },
        { label: "一年级", key: "firstGrade" },
        { label: "二年级", key: "secondGrade" },
        { label: "三年级", key: "threeGrade" },
        { label: "四年级", key: "fourthGrade" },
        { label: "五年级", key: "fifthGrade" },
        { label: "六年级", key: "sixGrade" },
        { label: "小学以上", key: "gradeSchool" },
      ],
      sendFireForm: {
        questionContent: "",
        correctAnswer: "",
        otherAnswer1: "",
        otherAnswer2: "",
        otherAnswer3: "",
        userGrades: [],
        expireLevel: "",
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.listExpireLevel()
  },
  methods: {
    async listExpireLevel() {
      const result = await this.$axios({
        url: '/fire/listTimeLevel',
        method: 'GET',
      }).then(res => res);
      this.expireLevelList = result.data;
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed() {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    afterSuccess(response, file) {
      this.$message.success(`上传成功，请填写该分享文件的信息吧`)
      // alert(response.data)
      // alert(file.size)
    },
    handleCreate() {
      this.sendFireForm = {
        questionContent: "",
        correctAnswer: "",
        otherAnswer1: "",
        otherAnswer2: "",
        otherAnswer3: "",
        userGrades: [],
        questionCategory: "",
      };
      this.dialogFormVisible = true;
    },
    //添加增加题目
    async createData() {
      const params = this.sendFireForm;
      alert(JSON.stringify(params))

      //如果需要调用接口，请打开注释
      //   const res = await saveSubject(params);
      //   console.log(res);
      //   if (res.code === "0000") {
      //     this.$message({
      //       type: "info",
      //       message: "保存成功",
      //     });
      //     this.dialogFormVisible = false;
      //     this.getQuerySubjectList();
      //     return;
      //   }
      //   this.$message({
      //     type: "error",
      //     message: "保存失败",
      //   });
    },
  }
}
</script>

<style>
  .main{
    width: 100%;
    margin: 120px auto;
    text-align: center;
  }

  .el-dialog{
    width: 75%;
  }

  .el-form-item__label{
    line-height: 20px;
  }
</style>
