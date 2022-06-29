<template>
  <div id="share" class="main">
    <div class="error-main clearfix" :hidden="keyError">
      <div class="label"></div>
      <div class="info">
        <h3 class="title">啊哦，你所访问的页面不存在了。</h3>
        <div class="reason">
          <p>可能的原因：</p>
          <p>1.在地址栏中输入了错误的地址。</p>
          <p>2.你点击的某个链接已过期。</p>
          <img src="http://152.136.215.195:8082/fireFileUI/error.webp" width="200px">
        </div>
      </div>
    </div>
    <router-view/>
    <el-dialog title="提取文件" :visible.sync="dialogFileVisible" id="extractFile">
      <div style="text-align:left;">
        <span class="span1">分享名称 🤩： </span><span> {{ showName }}</span><br/>
        <span class="span1">文件大小 💾： </span><span> {{ fileSize }}</span><br/>
        <span class="span1">分享人 😼： </span><span> {{ username }}</span><br/>
        <span class="span1">过期时间 🔥： </span><span> {{ expireDate }}</span><br/>
      </div>
      <el-input placeholder="请输入提取码提取" v-model="code" class="input-with-select" style="margin-top:50px; width: 80%;">
        <el-button slot="append" icon="el-icon-download" @click="extractFile"></el-button>
      </el-input>
    </el-dialog>
    <el-button @click="getFireFileWithKey" id="extractAgain">再次提取</el-button><br/>
    <el-button @click="toIndex" id="returnButton">返回</el-button><br/>
  </div>
</template>

<script>
import {_customDownLoadZipGet, formatBytes, formateDate} from "../utils/utils"
import fileDownload from 'js-file-download'

export default {
  name: 'Share',
  mounted: function(){
    this.getFireFileWithKey()
  },
  data() {
    return {
      key: this.$route.params.key,
      dialogFileVisible: false,
      keyError: true,
      showName: null,
      fileSize: null,
      username: null,
      expireDate: null,
      code: null
    }
  },
  methods: {
    toIndex() {
      this.$router.push('/')
    },
    async getFireFileWithKey() {
      const result = await this.$axios({
        url: '/s/' + this.key,
        method: 'get',
      }).then(res => res);
      if (result.code === 0 && result.data) {
        this.showName = result.data.showName
        this.fileSize = result.data.fileSize
        this.username = result.data.username
        this.expireDate = formateDate(result.data.expireDate, 'YYYY-MM-dd hh:mm')
        this.dialogFileVisible = true
        this.keyError = true
      } else {
        this.keyError = false
        this.$message.error(result.data.errMsg)
      }
    },
    async extractFile() {
      if (!this.code) {
        this.$message.warning('请输入提取码');
        return
      }

      const result = await this.$axios('/fire/extractFile?key=' + this.key + '&code='+ this.code, {
        responseType: 'blob',  // zip文件流需要添加，不然文件无法打开
        method: 'get'
      }).then(res => res);
        // 文件大小一致才说明提取码正确下载成功了
        if (formatBytes(result.size) == this.fileSize) {
          fileDownload(result, this.showName)
          this.$message.success('下载成功~')
          this.dialogFileVisible = false
        } else {
          this.$message.error('提取码错误')
        }
    }
  }
}
</script>

<style>
  .main{
    width: 100%;
    margin: 50px auto;
    text-align: center;
  }

  .info{
    color: #666;
    font: 12px / 1.5 tahoma, arial, 宋体;
  }

  .el-dialog{
    width: 300px !important;
    text-align: center !important;
  }

  #returnButton{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
    margin-top: 25px;
    width: 200px;
    height: 50px;
    font-size: 16px;
    color: white;
    border-radius: 5px;
  }

  #extractAgain{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
    margin-top: 25px;
    width: 200px;
    height: 50px;
    font-size: 16px;
    color: white;
    border-radius: 5px;
  }

  .span1{
    font-weight: bolder;
    font-size: 14px;
    color: black;
  }
</style>
