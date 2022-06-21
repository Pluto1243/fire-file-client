<template>
  <div id="share" class="share">
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
    <el-dialog title="提取文件" :visible.sync="dialogFileVisible">
      <div style="text-align:left;">
          <span>分享名称 🤩： {{ showName }}</span><br/>
          <span>文件大小 💾： {{ fileSize }}</span><br/>
          <span>分享人 😼： {{ username }}</span><br/>
          <span>过期时间 🔥： {{ expireDate }}</span><br/>
      </div>
    </el-dialog>
    <el-button @click="toIndex" class="returnButton">返回</el-button><br/>
  </div>
</template>

<script>
import {formateDate} from "../utils/utils"

export default {
  name: 'Share',
  mounted: function(){
    this.getFireFileWithKey()
  },
  data() {
    return {
      key: this.$route.params.key,
      dialogFileVisible: false,
      keyError: false,
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
  }
}
</script>

<style>
  .share{
    width: 100%;
    margin: 120px auto;
    text-align: center;
  }

  .info{
    color: #666;
    font: 12px / 1.5 tahoma, arial, 宋体;
  }

  .el-dialog{
    width: 350px;
    text-align: center;
  }

  .returnButton{
    background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);
    margin-top: 25px;
    color: white;
    border-radius: 5px;
  }
</style>
