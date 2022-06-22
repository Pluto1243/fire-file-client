<template>
  <div class="main">
    <el-row>
      <el-upload
        :action="uploadAction"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-success="afterSuccess"
        ref="upload"
        :limit="1"
        :on-exceed="handleExceed">
        <el-button slot="trigger" id="fireButton">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">上传的文件限制为100MB</div>
      </el-upload>
    </el-row>
    <el-row style="margin-top: 50px">
      <el-button
        id="sendButton"
        @click="handleCreate"
      > 🛩️ 发送</el-button>
    </el-row>
    <el-button @click="toIndex" id="returnButtonMain">返回</el-button><br/>
    <el-dialog
      :visible.sync="dialogFormVisible"
      id="sendDialog"
      title="发送阅后即焚🔥">
      <el-form
        :model="sendFireForm"
        :rules="rules"
        ref="sendFireForm"
        label-position="left"
        label-width="50%"
        style="width: 100%; text-align: center; padding-bot: 20px;"
      >
        <el-form-item label="给你的文件取个名字吧！📤" prop="showName">
          <el-input type="textarea" :rows="1" v-model="sendFireForm.showName"></el-input>
        </el-form-item>
        <el-input type="hidden" v-model="sendFireForm.path"></el-input>
        <el-input type="hidden" v-model="sendFireForm.fileName"></el-input>
        <el-form-item label="请选择有效时间 ⏱️" class="expireLabel">
          <el-switch
            v-model="expireValue"
            active-text="过期"
            inactive-text="不过期"
            @change="expireChange"
          >
          </el-switch>
          <el-select v-model="sendFireForm.expireLevel"
                     placeholder="请选择"
                     :disabled="!expireValue">
            <el-option
              v-for="(data, index) in expireLevelList"
              :key="index"
              :label="data"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件大小 💾" prop="fileSize">
          <el-input :disabled="true" v-model="sendFireForm.fileSize">
          </el-input>
        </el-form-item>
        <el-form-item label="你是谁？ 🤷" prop="username">
          <el-input  v-model="sendFireForm.username"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click=" sendFire() ">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {baseURL, clientURL} from "../utils/config";
import {formatBytes} from "../utils/utils";

export default {
  name: "Main",
  data () {
    return {
      uploadAction: baseURL + '/file/uploadFile',
      expireLevelList: [],
      fileSize: null,
      filePath: null,
      fileName: null,
      expireValue: true,
      sendFireForm: {
        showName: null,
        path: null,
        fileName: null,
        fileSize: null,
        username: null,
        expire: true,
        expireLevel: null,
      },
      rules: {
        showName: [{required: true, message: '请输入', trigger: 'blur'}],
        username: [{required: true, message: '请输入', trigger: 'blur'}]
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
      this.filePath = null
      this.fileName = null
      this.fileSize = null
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
      this.filePath = response.data,
      this.fileName = file.name,
      this.fileSize = formatBytes(file.size)
    },
    handleCreate() {
      if (this.filePath == null || this.fileName == null || this.fileSize == null) {
        this.$message({
          type: "warning",
          message: " ops,请先上传文件！😟",
          center: true
        })
        return
      }
      this.sendFireForm = {
        path: this.filePath,
        fileName: this.fileName,
        fileSize: this.fileSize,
        showName: null,
        username: null,
        expire: true,
        expireLevel: null,
      };
      this.dialogFormVisible = true;
    },
    expireChange() {
      this.sendFireForm.expire = this.expireValue
    },
    // 发送阅后即焚
    async sendFire() {
      this.$refs.sendFireForm.validate(async (valid) => {
        if (valid) {
          const result = await this.$axios({
            url: '/fire/sendFireFile',
            method: 'post',
            data: {
              ...this.sendFireForm
            }
          }).then(res => res);
          // 清空文件
          this.$refs.upload.clearFiles()
          this.fileSize = null
          this.fileName = null
          this.filePath = null
          this.dialogFormVisible = false
          if (result.code === 0 && result.data) {
            let keyCodeShare = '给你发送一个只能查看一次的文件，请及时查看哦~' + ' 链接： '+ clientURL + '/s/' + result.data.key;
            if (result.data.code) {
              keyCodeShare = keyCodeShare + '；提取码：' + result.data.code
            }
            this.$alert('链接：'+ clientURL + '/s/' + result.data.key + '；提取码:' + result.data.code, '发送成功~', {
              confirmButtonText: '复制链接',
              center: true,
              callback: action => {
                var input = document.createElement('input');     //创建一个隐藏input（重要！）
                input.value = keyCodeShare;    //拼接多个赋值
                document.body.appendChild(input);
                input.select(); // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                input.hidden = true
                this.$message({
                  type: 'success',
                  message: `复制成功！`
                });
              }
            });
          } else {
            this.$message.warning(result.errMsg)
          }
        } else {
          this.$message.warning('请输入完整哦')
        }
      })
    },
    toIndex() {
      this.$router.push("/")
    }
  }
}
</script>

<style>
  .main{
    width: 100%;
    margin: 120px auto;
    text-align: center;
  }

  .el-form-item__label{
    line-height: 20px;
    padding-top: 10px;
  }

  .expireLabel .el-form-item__label{
    padding-top: 35px;
  }
  #sendButton{
    margin-top: 50px;
    height: 75px;
    width: 250px;
    font-size: 24px;
    border-radius: 5px;
    box-shadow:  -20px 0 20px 5px rgba(213, 255, 145, 0.5),
    0px -20px 20px 5px rgba(145, 255, 191, 0.5),
    20px 0 20px 5px rgba(82, 255, 220, 0.5),
    0 20px 20px 5px rgba(239, 255, 91, 0.5);
  }
  #fireButton{
    margin-top: 50px;
    height: 75px;
    width: 250px;
    font-size: 24px;
    border-radius: 5px;
    box-shadow:  -20px 0 20px 5px rgba(213, 255, 145, 0.5),
    0px -20px 20px 5px rgba(145, 255, 191, 0.5),
    20px 0 20px 5px rgba(82, 255, 220, 0.5),
    0 20px 20px 5px rgba(239, 255, 91, 0.5);
  }
  #returnButtonMain{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
    margin-top: 50px;
    color: white;
    border-radius: 5px;
  }
</style>
